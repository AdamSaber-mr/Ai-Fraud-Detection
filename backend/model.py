"""Het detectiemodel — puur machine learning, geen webcode.

Dit gebruikt EEN Isolation Forest uit scikit-learn. Dat is een 'unsupervised'
model: het krijgt nooit voorbeelden van echte fraude te zien. Het leert alleen
hoe een NORMALE transactie eruitziet en markeert daarna de uitschieters.

Hoe een Isolation Forest werkt, kort uitgelegd:
het bouwt heel veel willekeurige beslisbomen die de data steeds in tweeen
splitsen. Een normale transactie lijkt op veel andere en heeft dus veel splits
nodig voordat ze alleen komt te staan. Een afwijkende transactie staat los van
de rest en is al na een paar splits 'geisoleerd'. Hoe sneller geisoleerd, hoe
verdachter de transactie.
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


def format_euro(amount):
    """Maak van een bedrag een nette tekst, bv 1700 -> '€ 1.700'."""
    getal = '{:,}'.format(round(amount))   # bv '1,700'
    return '€ ' + getal.replace(',', '.')  # bv '€ 1.700'


def format_hour(hour):
    """Maak van een uur een nette tijd, bv 3 -> '03:00'."""
    return '{:02d}:00'.format(int(hour))


class FraudDetector:
    # De vier kenmerken (features) waar het model naar kijkt.
    FEATURES = ['amount', 'hour', 'location_score', 'daily_frequency']

    # Welk deel van de data we ongeveer als afwijkend beschouwen (5%).
    CONTAMINATION = 0.05

    def __init__(self):
        self.scaler = None
        self.model = None
        self.is_trained = False

    # ------------------------------------------------------------------ #
    # Trainen
    # ------------------------------------------------------------------ #
    def train(self, df):
        """Train het model op de transacties."""
        X = df[self.FEATURES]

        # Alle features op dezelfde schaal brengen. Een bedrag in euro's is veel
        # groter dan een uur (0-23), dus zonder schalen zou het bedrag veel te
        # zwaar meetellen. StandardScaler maakt van elke feature een getal rond 0.
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)

        # Het model: 200 willekeurige beslisbomen.
        # random_state=42 zorgt dat het resultaat elke keer hetzelfde is.
        self.model = IsolationForest(
            n_estimators=200,
            contamination=self.CONTAMINATION,
            random_state=42,
        )
        self.model.fit(X_scaled)

        self.is_trained = True
        return {'status': 'trained', 'rows': len(df)}

    # ------------------------------------------------------------------ #
    # Scoren (voorspellen)
    # ------------------------------------------------------------------ #
    def predict(self, df):
        """Geef elke transactie een score, een label en een risiconiveau."""
        result = df.copy()
        X_scaled = self.scaler.transform(df[self.FEATURES])

        # score_samples geeft per transactie een getal: hoe HOGER, hoe normaler.
        # Een lage score betekent dus: snel geisoleerd = verdacht.
        scores = self.model.score_samples(X_scaled)
        result['anomaly_score'] = np.round(scores, 4)

        # predict geeft -1 (afwijkend) of 1 (normaal). Wij maken er True/False van.
        result['is_fraud'] = self.model.predict(X_scaled) == -1

        # De 5% laagste scores worden HIGH risico, de 15% laagste MEDIUM,
        # de rest LOW. np.percentile zoekt de grenswaarde op.
        grens_high = np.percentile(scores, 5)
        grens_medium = np.percentile(scores, 15)

        risk_levels = []
        for score in scores:
            if score <= grens_high:
                risk = 'HIGH'
            elif score <= grens_medium:
                risk = 'MEDIUM'
            else:
                risk = 'LOW'
            risk_levels.append(risk)
        result['risk_level'] = risk_levels

        # Uitleg per transactie: waarom is ze (niet) verdacht?
        contributions, reasons = self._explain(df)
        result['contributions'] = pd.Series(contributions, index=result.index)
        result['reasons'] = pd.Series(reasons, index=result.index)
        return result

    # ------------------------------------------------------------------ #
    # Uitleg waarom een transactie opvalt (eenvoudige vuistregels)
    # ------------------------------------------------------------------ #
    def _explain(self, df):
        """Bereken per transactie hoe verdacht elke feature is (0-100) en zet
        de hoogste scores om in korte zinnen voor de uitleg in het dashboard."""
        contributions = []
        reasons = []

        for index, row in df.iterrows():
            amount = float(row['amount'])
            hour = float(row['hour'])
            loc = float(row['location_score'])
            freq = float(row['daily_frequency'])

            # Per feature een score van 0 tot 100 (100 = heel afwijkend).
            amount_score = min(int(amount / 1500 * 100), 100)

            if hour < 6:
                hour_score = 90
            elif hour >= 22:
                hour_score = 60
            else:
                hour_score = 10

            location_score = int((1 - loc) * 100)
            frequency_score = min(int(freq / 25 * 100), 100)

            contributions.append({
                'amount': amount_score,
                'hour': hour_score,
                'location': location_score,
                'frequency': frequency_score,
            })

            # De tekst voor het tijdstip hangt af van het uur.
            if hour < 6:
                hour_text = 'een transactie midden in de nacht (' + format_hour(hour) + ')'
            else:
                hour_text = 'een transactie laat op de avond (' + format_hour(hour) + ')'

            # Een lijstje van (score, tekst) per feature.
            candidates = [
                (amount_score, 'een hoog bedrag van ' + format_euro(amount)),
                (hour_score, hour_text),
                (location_score, 'een onbekende of ongewone locatie'),
                (frequency_score, str(round(freq)) + ' transacties op een dag'),
            ]
            # Hoogste score eerst.
            candidates.sort(reverse=True)

            # Alleen de duidelijke signalen (score 35 of hoger) bewaren als tekst.
            row_reasons = []
            for score, text in candidates:
                if score >= 35:
                    row_reasons.append(text)
            reasons.append(row_reasons)

        return contributions, reasons

    def model_info(self):
        """Korte beschrijving van het model, voor het dashboard."""
        return {
            'type': 'Isolation Forest',
            'features': self.FEATURES,
            'library': 'scikit-learn',
        }
