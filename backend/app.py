"""Flask entry point: an application factory wiring routes, CORS, upload limits,
security headers and consistent JSON error handling."""
import logging
import os
import uuid

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from config import Config
from demo_data import generate_demo_dataframe
from model import FraudDetector
from scoring import build_response

logger = logging.getLogger(__name__)


def _error(message: str, status: int):
    return jsonify({'status': 'error', 'message': message}), status


def create_app(config_object=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    CORS(app, resources={r'/api/*': {'origins': app.config['CORS_ORIGINS']}})

    _register_routes(app)
    _register_error_handlers(app)
    _register_security_headers(app)
    return app


def _register_security_headers(app: Flask) -> None:
    @app.after_request
    def add_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['Referrer-Policy'] = 'no-referrer'
        return response


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(413)
    def too_large(_e):
        mb = app.config['MAX_UPLOAD_MB']
        return _error(f'Bestand te groot. Maximum is {mb} MB.', 413)

    @app.errorhandler(404)
    def not_found(_e):
        return _error('Niet gevonden.', 404)

    @app.errorhandler(HTTPException)
    def http_exception(e):
        return _error(e.description, e.code)

    @app.errorhandler(Exception)
    def unhandled(e):
        # Log the real error server-side; never leak internals to the client.
        logger.exception('Unhandled error: %s', e)
        return _error('Er ging iets mis bij het verwerken van het verzoek.', 500)


def _prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """Normalise column names and ensure every model feature is numeric."""
    df.columns = [str(c).lower().strip() for c in df.columns]
    if 'time' in df.columns and 'hour' not in df.columns:
        df = df.rename(columns={'time': 'hour'})

    missing = [c for c in ('amount', 'hour') if c not in df.columns]
    if missing:
        raise ValueError(
            'Ontbrekende kolommen: ' + ', '.join(missing)
            + '. De CSV moet minimaal "amount" en "hour" (of "time") bevatten.'
        )

    for col in FraudDetector.FEATURES:
        if col not in df.columns:
            df[col] = 0.0
        df[col] = pd.to_numeric(df[col], errors='coerce')
        df[col] = df[col].fillna(df[col].mean() if df[col].notna().any() else 0.0)
    return df


def _register_routes(app: Flask) -> None:
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
        if file is None or not file.filename:
            return _error('Geen bestand meegestuurd.', 400)
        if not file.filename.lower().endswith('.csv'):
            return _error('Alleen .csv-bestanden worden geaccepteerd.', 400)

        # Unique name avoids collisions / overwrites between concurrent uploads.
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f'{uuid.uuid4().hex}.csv')
        file.save(filepath)
        try:
            df = pd.read_csv(filepath, nrows=app.config['MAX_ROWS'])
            if df.empty:
                return _error('Het CSV-bestand bevat geen rijen.', 400)
            df = _prepare_features(df)
            return jsonify(build_response(df, 'upload'))
        except ValueError as e:
            return _error(str(e), 400)
        except pd.errors.ParserError:
            return _error('Kon het CSV-bestand niet lezen. Controleer het formaat.', 400)
        finally:
            if os.path.exists(filepath):
                os.remove(filepath)


app = create_app()


if __name__ == '__main__':
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])
