import numpy as np
import pandas as pd


def generate_demo_dataframe() -> pd.DataFrame:
    """Synthetic transaction set tuned for a clean demo: a normal cluster,
    10 clearly fraudulent transactions (extreme on every feature) and 4 mildly
    suspicious ones. After the Isolation Forest scores are normalised to a 0-100
    risk, this lands 10 in the 'fraude' band and 4 in 'verdacht', the rest normal."""
    rng = np.random.RandomState(42)

    n_normal = 186
    n_fraud = 10
    n_susp = 4

    normal = pd.DataFrame({
        'amount': np.clip(rng.normal(40, 5, n_normal), 1, None).round(2),
        'hour': rng.randint(10, 19, n_normal),
        'location_score': rng.uniform(0.78, 1.0, n_normal).round(4),
        'daily_frequency': np.clip(rng.normal(3, 0.4, n_normal), 1, None).round(2),
        'label': 0,
    })

    # Clearly fraudulent: high amount, dead of night, unknown location, very frequent.
    fraud = pd.DataFrame({
        'amount': np.clip(rng.normal(1700, 320, n_fraud), 1000, None).round(2),
        'hour': rng.choice([0, 1, 2, 3], n_fraud),
        'location_score': rng.uniform(0.0, 0.05, n_fraud).round(4),
        'daily_frequency': np.clip(rng.normal(32, 5, n_fraud), 22, None).round(2),
        'label': 1,
    })

    # Mildly suspicious: elevated but not extreme — should land in the middle band.
    susp = pd.DataFrame({
        'amount': np.clip(rng.normal(58, 2, n_susp), 54, None).round(2),
        'hour': np.full(n_susp, 19),
        'location_score': rng.uniform(0.74, 0.76, n_susp).round(4),
        'daily_frequency': np.clip(rng.normal(3.3, 0.1, n_susp), 3.2, None).round(2),
        'label': 1,
    })

    df = pd.concat([normal, fraud, susp], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    df.insert(0, 'transaction_id', [
              f'TXN-{i:05d}' for i in range(1, len(df) + 1)])
    return df
