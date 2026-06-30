# Maakt een nep-dataset met transacties voor de demo.
import numpy as np
import pandas as pd


def generate_demo_dataframe():
    # random_state=42 zorgt dat we elke keer dezelfde 'toevallige' data krijgen.
    rng = np.random.RandomState(42)

    n_normal = 186  # normale transacties
    n_fraud = 10    # duidelijke fraude
    n_susp = 4      # twijfelgevallen

    # Normale uitgaven: kleine bedragen, overdag, bekende locaties, een paar
    # transacties per dag. Met wat spreiding zodat de groep een realistische rand
    # heeft (daar zitten de 'verdachte' grensgevallen).
    # rng.normal(gemiddelde, spreiding, aantal) = getallen rond een gemiddelde.
    # np.clip(..., 5, None) kapt af op minimaal 5 (geen negatieve bedragen).
    # rng.randint(8, 21, ...) = willekeurige hele uren tussen 8 en 20.
    # rng.uniform(0.62, 1.0, ...) = willekeurige kommagetallen in dat bereik.
    normal = pd.DataFrame({
        'amount': np.clip(rng.normal(50, 18, n_normal), 5, None).round(2),
        'hour': rng.randint(8, 21, n_normal),
        'location_score': rng.uniform(0.62, 1.0, n_normal).round(4),
        'daily_frequency': np.clip(rng.normal(4, 1.5, n_normal), 1, None).round(2),
        'label': 0,  # 0 = normaal
    })

    # Duidelijke fraude: hoog bedrag, midden in de nacht, onbekende locatie,
    # heel vaak op een dag.
    # rng.choice([0,1,2,3], ...) = kies willekeurig uit die nachtelijke uren.
    fraud = pd.DataFrame({
        'amount': np.clip(rng.normal(1700, 320, n_fraud), 1000, None).round(2),
        'hour': rng.choice([0, 1, 2, 3], n_fraud),
        'location_score': rng.uniform(0.0, 0.05, n_fraud).round(4),
        'daily_frequency': np.clip(rng.normal(32, 5, n_fraud), 22, None).round(2),
        'label': 1,  # 1 = fraude
    })

    # Twijfelgevallen: maar een beetje afwijkend, dichter bij de normale groep
    # dan bij de fraude. Het model zet deze meestal in de 'verdacht'-band.
    susp = pd.DataFrame({
        'amount': np.clip(rng.normal(85, 7, n_susp), 68, None).round(2),
        'hour': rng.choice([20, 21], n_susp),
        'location_score': rng.uniform(0.52, 0.58, n_susp).round(4),
        'daily_frequency': np.clip(rng.normal(6, 0.8, n_susp), 4, None).round(2),
        'label': 1,  # 1 = afwijkend (twijfelgeval)
    })

    # Alle groepen samenvoegen en door elkaar husselen.
    # sample(frac=1) = pak 100% van de rijen in willekeurige volgorde (schudden),
    # zodat de fraude niet netjes onderaan staat. reset_index nummert opnieuw.
    df = pd.concat([normal, fraud, susp], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # Geef elke transactie een net id, bv 'TXN-00001'.
    ids = []
    for i in range(1, len(df) + 1):
        ids.append('TXN-{:05d}'.format(i))
    df.insert(0, 'transaction_id', ids)
    return df
