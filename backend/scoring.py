"""Maakt van de modeluitkomst het JSON-antwoord dat de frontend verwacht.

Het model (model.py) doet het echte rekenwerk. Hier zetten we de uitkomst om
in nette getallen voor het dashboard: een risico van 0-100, de tellingen (KPI's)
en de lijst met transacties."""
import random

from model import FraudDetector

# Grenzen voor het risico (0-100). Moet gelijk blijven aan de frontend
# (frontend/src/dashboard/constants.js).
RISK_FRAUD = 70
RISK_SUSPICIOUS = 45

# Maximaal aantal transacties dat we terugsturen. De tellingen gaan wel over
# de HELE dataset, alleen de lijst is afgekapt.
MAX_TRANSACTIONS = 500


def status_of(risk):
    """Zet een risicogetal (0-100) om in een status."""
    if risk >= RISK_FRAUD:
        return 'fraude'
    if risk >= RISK_SUSPICIOUS:
        return 'verdacht'
    return 'normaal'


def to_python(value):
    """numpy-getallen omzetten naar gewone Python-getallen, zodat ze in JSON
    passen. Gewone waarden (tekst, lijsten) laten we met rust."""
    # numpy-getallen hebben een .item()-functie (gewone tekst/lijsten niet);
    # die maakt er een normaal Python-getal van dat wel in JSON past.
    if hasattr(value, 'item'):
        return value.item()
    return value


def add_risk_columns(result):
    """Reken de anomaly-score om naar een risico van 0-100 (een lage score
    betekent een hoog risico) en bepaal de status."""
    scores = result['anomaly_score']
    laagste = float(scores.min())
    hoogste = float(scores.max())
    span = hoogste - laagste
    if span == 0:
        span = 1.0  # voorkom delen door nul

    risks = []
    statuses = []
    for score in scores:
        # Omrekenen naar 0-100. (hoogste - score) draait het om: de LAAGSTE
        # score wordt het HOOGSTE risico. Delen door 'span' maakt er een deel
        # tussen 0 en 1 van, '* 100' maakt er een percentage van.
        risk = round((hoogste - score) / span * 100)
        if risk < 0:
            risk = 0
        if risk > 100:
            risk = 100
        risks.append(risk)
        statuses.append(status_of(risk))

    result['risk'] = risks
    result['status'] = statuses


def make_stats(result):
    """Bereken alle cijfers (KPI's) over de HELE dataset."""
    total = len(result)

    fraud_rows = result[result['is_fraud'] == True]
    normal_rows = result[result['is_fraud'] == False]
    fraud_count = len(fraud_rows)
    normal_count = len(normal_rows)

    # Gemiddelde bedragen (0 als er geen rijen zijn).
    if fraud_count > 0:
        avg_fraud_amount = round(float(fraud_rows['amount'].mean()), 2)
    else:
        avg_fraud_amount = 0
    if normal_count > 0:
        avg_normal_amount = round(float(normal_rows['amount'].mean()), 2)
    else:
        avg_normal_amount = 0

    # Tellingen op basis van het risiconiveau van het model (HIGH / MEDIUM).
    high_risk_count = len(result[result['risk_level'] == 'HIGH'])
    medium_risk_count = len(result[result['risk_level'] == 'MEDIUM'])

    # Tellingen op basis van het risicogetal 0-100 (de banden in het dashboard).
    # result[result['risk'] >= 70] = alleen de rijen met risico 70 of hoger;
    # len(...) telt hoeveel dat er zijn. De '&' betekent 'EN' (allebei waar),
    # en elk deel moet tussen haakjes (verplicht in pandas).
    fraud_alert_count = len(result[result['risk'] >= RISK_FRAUD])
    suspicious_count = len(result[(result['risk'] >= RISK_SUSPICIOUS) & (result['risk'] < RISK_FRAUD)])
    normal_band_count = len(result[result['risk'] < RISK_SUSPICIOUS])

    # Totaalbedrag van alles wat opvalt (verdacht + fraude).
    flagged_rows = result[result['risk'] >= RISK_SUSPICIOUS]
    flagged_amount = round(float(flagged_rows['amount'].sum()), 2)

    if total > 0:
        fraud_percentage = round(fraud_count / total * 100, 1)
    else:
        fraud_percentage = 0

    return {
        'total': total,
        'fraud_count': fraud_count,
        'normal_count': normal_count,
        'fraud_percentage': fraud_percentage,
        'avg_fraud_amount': avg_fraud_amount,
        'avg_normal_amount': avg_normal_amount,
        'high_risk_count': high_risk_count,
        'medium_risk_count': medium_risk_count,
        'fraud_alert_count': fraud_alert_count,
        'suspicious_count': suspicious_count,
        'normal_band_count': normal_band_count,
        'flagged_count': fraud_alert_count + suspicious_count,
        'flagged_amount': flagged_amount,
    }


def make_transactions(result):
    """Stuur alle gemarkeerde transacties terug + een willekeurige greep uit de
    normale transacties, tot maximaal MAX_TRANSACTIONS rijen."""
    # to_dict(orient='records') maakt van de tabel een lijst met dictionaries,
    # eentje per rij: [{'amount': 50, 'hour': 14, ...}, {...}, ...].
    fraud_rows = result[result['is_fraud'] == True].to_dict(orient='records')
    normal_rows = result[result['is_fraud'] == False].to_dict(orient='records')

    # Te veel rijen? Pak een willekeurige steekproef van de normale transacties.
    if len(fraud_rows) + len(normal_rows) > MAX_TRANSACTIONS:
        ruimte = MAX_TRANSACTIONS - len(fraud_rows)
        if ruimte < 0:
            ruimte = 0
        if ruimte < len(normal_rows):
            # random.sample pakt willekeurig 'ruimte' rijen uit de normale lijst.
            normal_rows = random.sample(normal_rows, ruimte)

    rows = fraud_rows + normal_rows
    random.shuffle(rows)

    # Elke waarde JSON-veilig maken.
    nette_rows = []
    for row in rows:
        nette_row = {}
        for key in row:
            nette_row[key] = to_python(row[key])
        nette_row['is_fraud'] = bool(nette_row['is_fraud'])
        nette_rows.append(nette_row)
    return nette_rows


def build_response(df, source):
    """Train het model, scoor de transacties en bouw het hele antwoord op."""
    detector = FraudDetector()
    detector.train(df)
    result = detector.predict(df)

    add_risk_columns(result)
    stats = make_stats(result)
    transactions = make_transactions(result)

    return {
        'status': 'success',
        'source': source,
        'stats': stats,
        'model': detector.model_info(),
        'transactions': transactions,
    }
