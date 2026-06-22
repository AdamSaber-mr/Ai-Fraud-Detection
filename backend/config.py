"""Application configuration, driven by environment variables with safe defaults.

Every value can be overridden via the environment so the same code runs locally
and in a hardened deployment without edits."""
import os


def _env_bool(name: str, default: bool = False) -> bool:
    val = os.environ.get(name)
    if val is None:
        return default
    return val.strip().lower() in ('1', 'true', 'yes', 'on')


class Config:
    # Debug exposes the Werkzeug debugger (arbitrary code execution) and stack
    # traces — it must stay OFF unless explicitly enabled for local dev.
    DEBUG = _env_bool('FLASK_DEBUG', False)

    # Bind to localhost by default; only expose externally on purpose.
    HOST = os.environ.get('HOST', '127.0.0.1')
    PORT = int(os.environ.get('PORT', '5001'))

    # CORS allow-list for the API (comma-separated). Defaults to the Vite dev server.
    CORS_ORIGINS = [
        o.strip()
        for o in os.environ.get(
            'CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173'
        ).split(',')
        if o.strip()
    ]

    # Reject uploads larger than this to avoid memory exhaustion (Flask -> 413).
    MAX_UPLOAD_MB = int(os.environ.get('MAX_UPLOAD_MB', '5'))
    MAX_CONTENT_LENGTH = MAX_UPLOAD_MB * 1024 * 1024

    # Hard cap on rows processed from an upload (extra DoS guard).
    MAX_ROWS = int(os.environ.get('MAX_ROWS', '50000'))

    # Temp folder for uploaded CSVs (files are deleted right after processing).
    UPLOAD_FOLDER = os.environ.get(
        'UPLOAD_FOLDER', os.path.join(os.path.dirname(__file__), 'uploads')
    )
