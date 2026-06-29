"""Turns raw Isolation Forest output into the JSON shape the frontend consumes.

Keeps the HTTP/response concerns out of model.py (pure ML) and app.py (routing)."""
import random

import pandas as pd

from model import FraudDetector

# Risk-score band thresholds (0-100). Kept in sync with the frontend constants.
RISK_FRAUD = 70
RISK_SUSPICIOUS = 45

# Cap the number of transactions returned in the payload (stats use the full set).
MAX_TRANSACTIONS = 500


def status_of(risk: int) -> str:
    if risk >= RISK_FRAUD:
        return 'fraude'
    if risk >= RISK_SUSPICIOUS:
        return 'verdacht'
    return 'normaal'


def _json_safe(value):
    """Convert numpy scalars to native Python types for JSON serialisation."""
    return value.item() if hasattr(value, 'item') else value


def _add_risk_columns(result_df: pd.DataFrame) -> pd.DataFrame:
    """Derive a 0-100 risk score from the anomaly score (lower score -> higher
    risk) plus a status band, computed over the FULL dataset."""
    scores = result_df['anomaly_score'].astype(float)
    lo, hi = float(scores.min()), float(scores.max())
    span = (hi - lo) or 1.0
    result_df['risk'] = (((hi - scores) / span) * 100).round().clip(0, 100).astype(int)
    result_df['status'] = result_df['risk'].apply(status_of)
    return result_df


def _band_stats(result_df: pd.DataFrame) -> dict:
    """Full-dataset band counts + flagged amount for the dashboard KPIs / donut."""
    risk = result_df['risk']
    fraud_alert_count = int((risk >= RISK_FRAUD).sum())
    suspicious_count = int(((risk >= RISK_SUSPICIOUS) & (risk < RISK_FRAUD)).sum())
    normal_band_count = int((risk < RISK_SUSPICIOUS).sum())
    flagged_amount = float(result_df.loc[risk >= RISK_SUSPICIOUS, 'amount'].sum())
    return {
        'fraud_alert_count': fraud_alert_count,
        'suspicious_count': suspicious_count,
        'normal_band_count': normal_band_count,
        'flagged_count': fraud_alert_count + suspicious_count,
        'flagged_amount': round(flagged_amount, 2),
    }


def _sample_transactions(result_df: pd.DataFrame) -> list:
    """Keep all flagged rows plus a random sample of normal rows, up to the cap."""
    fraud_rows = result_df[result_df['is_fraud']].to_dict(orient='records')
    normal_rows = result_df[~result_df['is_fraud']].to_dict(orient='records')

    if len(fraud_rows) + len(normal_rows) > MAX_TRANSACTIONS:
        remaining = max(MAX_TRANSACTIONS - len(fraud_rows), 0)
        normal_rows = random.sample(normal_rows, min(remaining, len(normal_rows)))

    transactions = fraud_rows + normal_rows
    random.shuffle(transactions)

    for t in transactions:
        t['is_fraud'] = bool(t['is_fraud'])
        for key, val in t.items():
            t[key] = _json_safe(val)
    return transactions


def build_response(df: pd.DataFrame, source: str) -> dict:
    """Train, score and assemble the full API payload for a transaction set."""
    detector = FraudDetector()
    detector.train(df)
    result_df = detector.predict(df)

    stats = detector.get_stats(result_df)
    _add_risk_columns(result_df)
    stats.update(_band_stats(result_df))

    return {
        'status': 'success',
        'source': source,
        'stats': stats,
        'model': detector.model_info(),
        'transactions': _sample_transactions(result_df),
    }
