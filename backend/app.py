"""De webserver (Flask). Hier komen de verzoeken van de frontend binnen.

Deze laag doet alleen het 'webwerk': de routes (/api/...), het controleren van
een upload en nette foutmeldingen. Het echte rekenwerk zit in model.py en
scoring.py."""
import logging
import os
import uuid

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

import config
from demo_data import generate_demo_dataframe
from model import FraudDetector
from scoring import build_response

# Maak de Flask-app.
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH

# Zorg dat de map voor uploads bestaat.
os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)

# Alleen onze eigen frontend mag de API aanroepen.
# r'/api/*' = geldt voor alle adressen die met /api/ beginnen.
CORS(app, resources={r'/api/*': {'origins': config.CORS_ORIGINS}})


def error(message, status):
    """Hulpfunctie: stuur een nette foutmelding terug als JSON."""
    return jsonify({'status': 'error', 'message': message}), status


def prepare_features(df):
    """Maak de kolomnamen netjes en zorg dat alle features uit getallen bestaan."""
    # Alle kolomnamen klein maken, zodat 'Amount' ook werkt.
    nieuwe_namen = []
    for kolom in df.columns:
        nieuwe_namen.append(str(kolom).lower().strip())
    df.columns = nieuwe_namen

    # 'time' mag ook 'hour' heten.
    if 'time' in df.columns and 'hour' not in df.columns:
        df = df.rename(columns={'time': 'hour'})

    # De CSV moet minimaal 'amount' en 'hour' bevatten.
    if 'amount' not in df.columns or 'hour' not in df.columns:
        raise ValueError('De CSV moet minimaal "amount" en "hour" (of "time") bevatten.')

    # Zorg dat elke feature bestaat en uit getallen bestaat.
    for col in FraudDetector.FEATURES:
        if col not in df.columns:
            df[col] = 0.0
        # to_numeric zet tekst om in getallen; errors='coerce' maakt van iets
        # wat geen getal is een lege waarde (NaN) in plaats van een crash.
        df[col] = pd.to_numeric(df[col], errors='coerce')
        # Lege waarden opvullen met het gemiddelde van de kolom (of 0 als de
        # hele kolom leeg is). fillna = 'fill not-a-number'.
        if df[col].notna().any():
            df[col] = df[col].fillna(df[col].mean())
        else:
            df[col] = df[col].fillna(0.0)
    return df


# ---------------------------------------------------------------------- #
# Routes
# ---------------------------------------------------------------------- #
# @app.route koppelt een webadres (URL) aan een functie: roept iemand
# /api/health aan, dan draait de functie hieronder en wordt het resultaat
# als antwoord teruggestuurd.
@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Fraud Detection API running'})


@app.route('/api/demo')
def demo():
    df = generate_demo_dataframe()
    return jsonify(build_response(df, 'demo'))


@app.route('/api/upload', methods=['POST'])
def upload():
    file = request.files.get('file')
    if file is None or file.filename == '':
        return error('Geen bestand meegestuurd.', 400)
    if not file.filename.lower().endswith('.csv'):
        return error('Alleen .csv-bestanden worden geaccepteerd.', 400)

    # uuid4().hex is een lange willekeurige code; zo krijgt elk bestand een
    # unieke naam en overschrijven twee uploads elkaar nooit.
    filename = uuid.uuid4().hex + '.csv'
    filepath = os.path.join(config.UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        df = pd.read_csv(filepath, nrows=config.MAX_ROWS)
        if df.empty:
            return error('Het CSV-bestand bevat geen rijen.', 400)
        df = prepare_features(df)
        return jsonify(build_response(df, 'upload'))
    except ValueError as e:
        return error(str(e), 400)
    except pd.errors.ParserError:
        return error('Kon het CSV-bestand niet lezen. Controleer het formaat.', 400)
    finally:
        # Verwijder het bestand altijd weer, ook als er iets misging.
        if os.path.exists(filepath):
            os.remove(filepath)


# ---------------------------------------------------------------------- #
# Veiligheid + foutafhandeling
# ---------------------------------------------------------------------- #
# @app.after_request draait NA elk verzoek; hier voegen we beveiligings-
# regels toe aan elk antwoord (bv. niet in een iframe laden).
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'no-referrer'
    return response


# @app.errorhandler vangt een bepaalde fout op. 413 = bestand te groot.
@app.errorhandler(413)
def too_large(e):
    return error('Bestand te groot. Maximum is ' + str(config.MAX_UPLOAD_MB) + ' MB.', 413)


@app.errorhandler(404)
def not_found(e):
    return error('Niet gevonden.', 404)


@app.errorhandler(Exception)
def something_went_wrong(e):
    # De echte fout in het logboek zetten, maar NOOIT details naar de gebruiker
    # sturen (dat zou onveilig zijn).
    logging.exception('Er ging iets mis: %s', e)
    return error('Er ging iets mis bij het verwerken van het verzoek.', 500)


if __name__ == '__main__':
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
