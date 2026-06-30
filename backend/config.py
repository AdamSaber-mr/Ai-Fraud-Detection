# Instellingen voor de server.
import os

# Beveiliging: debug staat standaard UIT. Alleen aanzetten via FLASK_DEBUG=1.
# (Met debug aan kan iemand code uitvoeren op de server — dus uit laten.)
DEBUG = os.environ.get('FLASK_DEBUG', '') == '1'

# De server draait standaard alleen op deze computer.
HOST = '127.0.0.1'
PORT = 5001

# Welke websites de API mogen aanroepen (alleen onze eigen frontend).
CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

# Uploadlimieten (beschermt het geheugen tegen veel te grote bestanden).
MAX_UPLOAD_MB = 5
MAX_CONTENT_LENGTH = MAX_UPLOAD_MB * 1024 * 1024

# Maximaal aantal rijen dat we uit een upload lezen.
MAX_ROWS = 50000

# Tijdelijke map voor geuploade CSV-bestanden (worden na gebruik verwijderd).
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
