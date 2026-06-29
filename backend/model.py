"""The detection engine — pure ML, no HTTP.

Three unsupervised detectors vote together (an *ensemble*), each looking at the
data a different way:

  * isolation  — Isolation Forest: how few random splits isolate a point
  * density    — Local Outlier Factor: how lonely a point is vs its neighbours
  * distance   — Elliptic Envelope: Mahalanobis distance from the data's centre

None of them ever sees a labelled fraud example; they only learn what "normal"
looks like. The raw inputs are first turned into richer engineered features
(log-scaled amounts, a cyclical clock, a velocity interaction) so the models see
the structure a human would.

On top of the score, the engine explains *why* a transaction stands out: per
feature it measures how far the value sits from the normal crowd, so the UI can
show data-driven reasons instead of hard-coded rules of thumb."""
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.covariance import EllipticEnvelope
from sklearn.preprocessing import StandardScaler


class FraudDetector:
    # The interpretable inputs the API speaks in. The model trains on engineered
    # features derived from these (see _engineer).
    RAW_FEATURES = ['amount', 'hour', 'location_score', 'daily_frequency']

    # Share of the data the ensemble treats as anomalous when drawing the
    # is_fraud line. The dashboard's risk bands are derived downstream from the
    # continuous score, so this only sets the hard -1/+1 label.
    CONTAMINATION = 0.05

    # Sensible fallbacks for an uploaded CSV that omits a column.
    _DEFAULTS = {'amount': 50.0, 'hour': 12.0, 'location_score': 0.9, 'daily_frequency': 3.0}

    def __init__(self):
        self.scaler = None
        self.models = {}
        self.is_trained = False
        self._norm = None  # normal-population reference stats for explainability

    # ------------------------------------------------------------------ #
    # Feature engineering
    # ------------------------------------------------------------------ #
    def _raw_frame(self, df: pd.DataFrame) -> pd.DataFrame:
        """The four raw features as clean numerics, with column-wise defaults."""
        out = pd.DataFrame(index=df.index)
        for col in self.RAW_FEATURES:
            s = pd.to_numeric(df[col], errors='coerce') if col in df.columns else pd.Series(np.nan, index=df.index)
            fill = s.median()
            if not np.isfinite(fill):
                fill = self._DEFAULTS[col]
            out[col] = s.fillna(fill)
        out['amount'] = out['amount'].clip(lower=0)
        out['hour'] = out['hour'].clip(0, 23)
        out['location_score'] = out['location_score'].clip(0, 1)
        out['daily_frequency'] = out['daily_frequency'].clip(lower=0)
        return out

    def _engineer(self, raw: pd.DataFrame) -> pd.DataFrame:
        """Turn the raw features into the richer signals the models train on.

        - amount_log / freq_log : tame the heavy right tail of money & counts
        - hour_sin / hour_cos   : a cyclical clock so 23:00 and 00:00 are neighbours
        - velocity              : spend × pace — a classic card-testing fingerprint
        """
        amount, freq = raw['amount'], raw['daily_frequency']
        ang = 2 * np.pi * raw['hour'] / 24.0
        return pd.DataFrame({
            'amount_log': np.log1p(amount),
            'hour_sin': np.sin(ang),
            'hour_cos': np.cos(ang),
            'location_score': raw['location_score'],
            'freq_log': np.log1p(freq),
            'velocity': np.log1p(amount) * np.log1p(freq),
        })

    # ------------------------------------------------------------------ #
    # Training
    # ------------------------------------------------------------------ #
    def train(self, df: pd.DataFrame) -> dict:
        raw = self._raw_frame(df)
        feats = self._engineer(raw)

        self.scaler = StandardScaler()
        X = self.scaler.fit_transform(feats)

        n = len(df)
        c = self.CONTAMINATION
        models = {}
        models['isolation'] = IsolationForest(
            n_estimators=200, contamination=c, random_state=42, n_jobs=-1,
        ).fit(X)
        models['density'] = LocalOutlierFactor(
            n_neighbors=int(min(20, max(5, n // 10))), novelty=True, contamination=c,
        ).fit(X)
        # Elliptic Envelope needs a well-conditioned covariance; on tiny or
        # degenerate data it can throw, so it's optional — the ensemble copes.
        try:
            models['distance'] = EllipticEnvelope(
                contamination=c, support_fraction=0.92, random_state=42,
            ).fit(X)
        except Exception:
            pass

        self.models = models
        self.is_trained = True
        return {'status': 'trained', 'rows': n, 'detectors': list(models.keys())}

    # ------------------------------------------------------------------ #
    # Scoring
    # ------------------------------------------------------------------ #
    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        result = df.copy()
        raw = self._raw_frame(df)
        X = self.scaler.transform(self._engineer(raw))

        # Each detector's score_samples: higher = more normal. Standardise per
        # detector so the three speak the same language, then average.
        per = {name: m.score_samples(X) for name, m in self.models.items()}
        z = []
        for s in per.values():
            sd = s.std() or 1.0
            z.append((s - s.mean()) / sd)
        ensemble = np.mean(z, axis=0)  # higher = more normal

        # anomaly_score keeps the sklearn convention (lower = more anomalous),
        # which the downstream risk mapping in scoring.py relies on.
        result['anomaly_score'] = np.round(ensemble, 4)
        result['is_fraud'] = ensemble <= np.quantile(ensemble, self.CONTAMINATION)

        q_high = np.quantile(ensemble, 0.05)
        q_med = np.quantile(ensemble, 0.15)
        result['risk_level'] = np.where(
            ensemble <= q_high, 'HIGH', np.where(ensemble <= q_med, 'MEDIUM', 'LOW'),
        )

        # Per-detector anomaly as a 0-100 figure (100 = most anomalous) plus a
        # vote count — surfaced in the UI so you can see the ensemble at work.
        det_scores, votes = self._detector_breakdown(per)
        result['detector_scores'] = pd.Series(det_scores, index=result.index)
        result['detector_votes'] = votes

        # Data-driven "why flagged" signals.
        contribs, reasons = self._explain(raw, result['is_fraud'].to_numpy())
        result['contributions'] = pd.Series(contribs, index=result.index)
        result['reasons'] = pd.Series(reasons, index=result.index)
        return result

    def _detector_breakdown(self, per: dict):
        """Per-row {detector: 0-100 anomaly} and how many detectors flagged it."""
        as_pct = {}
        votes = np.zeros(len(next(iter(per.values()))), dtype=int)
        for name, s in per.items():
            lo, hi = s.min(), s.max()
            span = (hi - lo) or 1.0
            as_pct[name] = np.round((hi - s) / span * 100).astype(int)
            votes += (s <= np.quantile(s, self.CONTAMINATION)).astype(int)
        rows = [{name: int(as_pct[name][i]) for name in as_pct} for i in range(len(votes))]
        return rows, votes

    # ------------------------------------------------------------------ #
    # Explainability — measured against the normal crowd, not fixed rules
    # ------------------------------------------------------------------ #
    def _explain(self, raw: pd.DataFrame, is_fraud: np.ndarray):
        """For each transaction, score how unusual every raw feature is (0-100)
        relative to the normal population, and turn the strong ones into
        plain-language reasons."""
        normal = raw[~is_fraud] if (~is_fraud).any() else raw
        ref = {col: (float(normal[col].median()), float(normal[col].std() or 1.0))
               for col in self.RAW_FEATURES}
        # Median hour of the normal crowd, for circular "odd time" distance.
        med_hour = float(normal['hour'].median())

        contribs, reasons = [], []
        for _, row in raw.iterrows():
            amount = float(row['amount'])
            hour = float(row['hour'])
            loc = float(row['location_score'])
            freq = float(row['daily_frequency'])

            # 0-100 contribution per feature; only the "risky" direction counts.
            amt_c = self._sigma_pct((amount - ref['amount'][0]) / ref['amount'][1])
            freq_c = self._sigma_pct((freq - ref['daily_frequency'][0]) / ref['daily_frequency'][1])
            loc_c = self._sigma_pct((ref['location_score'][0] - loc) / ref['location_score'][1])
            # Hour: circular distance (in hours) from the normal median, 0-12.
            d = abs(hour - med_hour) % 24
            hour_c = int(round(min(d, 24 - d) / 12 * 100))
            if 0 <= hour < 6:  # deep night carries extra weight
                hour_c = max(hour_c, 70)

            contribs.append({
                'amount': amt_c,
                'hour': int(hour_c),
                'location': loc_c,
                'frequency': freq_c,
            })

            # Reasons: the elevated signals, strongest first, as short phrases.
            cand = [
                (amt_c, f"een hoog bedrag van € {round(amount):,}".replace(',', '.')),
                (hour_c, ("een transactie midden in de nacht" if 0 <= hour < 6
                          else "een transactie op een ongebruikelijk tijdstip")
                 + f" ({int(round(hour)):02d}:00)"),
                (loc_c, "een onbekende of ongewone locatie"),
                (freq_c, f"{round(freq)} transacties op één dag"),
            ]
            reasons.append([text for score, text in sorted(cand, reverse=True) if score >= 35])
        return contribs, reasons

    @staticmethod
    def _sigma_pct(z: float) -> int:
        """Map a one-sided z-score to 0-100 (≈4σ saturates), ignoring the safe side."""
        return int(round(min(max(z, 0.0), 4.0) / 4.0 * 100))

    # ------------------------------------------------------------------ #
    # Aggregate stats
    # ------------------------------------------------------------------ #
    def get_stats(self, df: pd.DataFrame) -> dict:
        total = len(df)
        fraud_df = df[df['is_fraud']]
        normal_df = df[~df['is_fraud']]
        fraud_count = len(fraud_df)
        normal_count = len(normal_df)
        return {
            'total': total,
            'fraud_count': fraud_count,
            'normal_count': normal_count,
            'fraud_percentage': round(fraud_count / total * 100, 1) if total else 0,
            'avg_fraud_amount': round(float(fraud_df['amount'].mean()), 2) if fraud_count else 0,
            'avg_normal_amount': round(float(normal_df['amount'].mean()), 2) if normal_count else 0,
            'high_risk_count': int((df['risk_level'] == 'HIGH').sum()),
            'medium_risk_count': int((df['risk_level'] == 'MEDIUM').sum()),
        }

    def model_info(self) -> dict:
        """A short description of the ensemble, for the UI."""
        names = {
            'isolation': 'Isolation Forest',
            'density': 'Local Outlier Factor',
            'distance': 'Elliptic Envelope',
        }
        return {
            'type': 'ensemble',
            'detectors': [names.get(k, k) for k in self.models],
            'detector_count': len(self.models),
            'features': self.RAW_FEATURES,
            'library': 'scikit-learn',
        }
