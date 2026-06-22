import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


class FraudDetector:
    FEATURES = ['amount', 'hour', 'location_score', 'daily_frequency']

    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_trained = False

    def train(self, df: pd.DataFrame) -> dict:
        X = df[self.FEATURES].copy()
        for col in self.FEATURES:
            if col not in X.columns:
                X[col] = 0
            X[col] = X[col].fillna(X[col].mean())

        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)

        self.model = IsolationForest(
            contamination=0.05,
            n_estimators=200,
            random_state=42,
            n_jobs=-1,
        )
        self.model.fit(X_scaled)
        self.is_trained = True
        return {'status': 'trained', 'rows': len(df)}

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        result = df.copy()
        X = result[self.FEATURES].copy()
        for col in self.FEATURES:
            if col not in X.columns:
                X[col] = 0
            X[col] = X[col].fillna(X[col].mean())

        X_scaled = self.scaler.transform(X)
        preds = self.model.predict(X_scaled)
        scores = self.model.score_samples(X_scaled)

        result['is_fraud'] = preds == -1
        result['anomaly_score'] = np.round(scores, 4)

        def risk_level(score):
            if score < -0.6:
                return 'HIGH'
            elif score < -0.4:
                return 'MEDIUM'
            return 'LOW'

        result['risk_level'] = result['anomaly_score'].apply(risk_level)
        return result

    def get_stats(self, df: pd.DataFrame) -> dict:
        total = len(df)
        fraud_df = df[df['is_fraud']]
        normal_df = df[~df['is_fraud']]
        fraud_count = len(fraud_df)
        normal_count = len(normal_df)
        fraud_percentage = round(fraud_count / total * 100, 1) if total > 0 else 0
        avg_fraud_amount = round(float(fraud_df['amount'].mean()), 2) if fraud_count > 0 else 0
        avg_normal_amount = round(float(normal_df['amount'].mean()), 2) if normal_count > 0 else 0
        high_risk_count = int((df['risk_level'] == 'HIGH').sum())
        medium_risk_count = int((df['risk_level'] == 'MEDIUM').sum())

        return {
            'total': total,
            'fraud_count': fraud_count,
            'normal_count': normal_count,
            'fraud_percentage': fraud_percentage,
            'avg_fraud_amount': avg_fraud_amount,
            'avg_normal_amount': avg_normal_amount,
            'high_risk_count': high_risk_count,
            'medium_risk_count': medium_risk_count,
        }
