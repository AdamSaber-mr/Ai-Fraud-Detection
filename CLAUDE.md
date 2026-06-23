# CLAUDE.md — Sentinel AI Fraudedetectie

Project guide for working in this repo. Read before making changes.

**Student:** Adam Saber — MBO Software Development, Grafisch Lyceum Rotterdam
**Opdracht:** Minor eindproject — AI/Machine Learning met Python

---

## What this is

A full-stack fraud-detection demo. A Flask backend runs a scikit-learn
**Isolation Forest** over transaction data (generated demo set or an uploaded
CSV) and returns per-transaction anomaly scores. A React frontend — the
**Sentinel** dashboard — visualises the results: KPIs, a 3D transaction cloud,
a status donut, an hourly bar chart, a transaction table and a detail panel,
plus a plain-language "how it works" explainer. Dark aubergine/lavender
theme with a drifting aurora and framer-motion animations, matching the
landing story.

The model is **unsupervised**: it learns what "normal" looks like and flags
outliers — it never sees labelled fraud examples.

---

## Architecture

```
backend/                     Flask API (Python 3.10+)
├── app.py                   create_app() factory, routes, error handlers, security headers
├── config.py                env-driven settings (debug, host/port, CORS, upload limits)
├── scoring.py               risk-band derivation + JSON response shaping
├── model.py                 FraudDetector — the Isolation Forest (pure ML, no HTTP)
├── demo_data.py             synthetic demo dataset generator
├── requirements.txt         pinned dependencies
└── uploads/                 temp dir for uploaded CSVs (auto-created, gitignored)

frontend/                    React 19 + Vite (one app: landing story + dashboard)
└── src/
    ├── main.jsx             entry — mounts <BrowserRouter>
    ├── App.jsx              router: "/" -> Landing, "/dashboard" -> DashboardApp (lazy)
    │
    ├── landing/             scrollytelling intro (framer-motion), was the prototype
    │   ├── Landing.jsx      composes the story sections; "Probeer het uit" -> /dashboard
    │   ├── anim.jsx         Reveal/Kinetic/CountUp/GrowBar/SectionHead helpers
    │   ├── data.js          static demo figures for the story
    │   ├── styles.css       landing-only CSS, scoped under .landing
    │   ├── hooks/useMouse.js   parallax pointer hook
    │   └── components/      AuroraBg, Navbar, Hero, Figures, Isolation, Signals,
    │                        CallToAction, Radar
    │
    └── dashboard/           the live dashboard (ECharts + real backend)
        ├── DashboardApp.jsx state machine: screen/layout/filter/theme/loading/data
        ├── api.js           axios calls to /api/* (proxied to the backend)
        ├── adapt.js         maps the backend response -> UI shape + KPIs
        ├── constants.js     RISK thresholds + STATUS helpers (single source of truth)
        ├── theme.js         aubergine/lavender palette + CSS-var builder
        ├── anim.jsx         CountUp (count-up KPI numbers)
        ├── charts.js        ECharts option builders (3D scatter, donut, hourly bar)
        ├── styles/index.css reset, keyframes, hover helpers
        └── components/      Sidebar (logo -> "/"), Topbar, DataScreen, Dashboard,
                             TransactionsScreen, HowItWorks, DetailPanel, EChart,
                             EmptyState, LoadingOverlay, Toast
```

The landing page and dashboard are one Vite app behind `react-router`. The
dashboard is code-split (`React.lazy`) so the landing stays light and only pulls
in ECharts on `/dashboard`.

---

## Run

```bash
# Backend  (http://127.0.0.1:5001)
cd backend && pip install -r requirements.txt && python app.py

# Frontend (http://localhost:5173, proxies /api -> :5001)
cd frontend && npm install && npm run dev
```

Always run `npm run lint` and `npm run build` before committing frontend changes.

---

## API

All responses are JSON `{ status, ... }`; errors are `{ status: "error", message }`.

- `GET /api/health` — liveness check
- `GET /api/demo` — generate demo data, train, score, return results
- `POST /api/upload` — same pipeline for an uploaded CSV (`multipart/form-data`, field `file`)

Each transaction carries the real model output (`is_fraud`, `anomaly_score`,
`risk_level`) plus a derived `risk` (0-100) and `status`
(`normaal`/`verdacht`/`fraude`). `stats` is computed over the **full** dataset;
the `transactions` array is capped at 500 rows (all flagged + a random sample).

CSV must contain at least `amount` and `hour` (or `time`); the other features
(`location_score`, `daily_frequency`) default sensibly when absent.

---

## Conventions

- **Risk bands** live in `backend/scoring.py` (`RISK_FRAUD`, `RISK_SUSPICIOUS`)
  and `frontend/src/constants.js` (`RISK`). Keep the two in sync.
- **Backend layering:** `model.py` is pure ML; `scoring.py` shapes responses;
  `app.py` only does routing/validation/errors. Don't put ML or response logic
  back in `app.py`.
- **Frontend styling** is inline styles + CSS variables (no Tailwind). Theme
  colours come from `theme.js`; reference them as `var(--accent)` etc.
- Merchant/location names are **synthesised** in `adapt.js` for visual flavour —
  they are not real model output.

## Security (keep these intact)

- Flask `debug` is OFF by default (only via `FLASK_DEBUG`); never hardcode it on.
- Uploads are size-capped (`MAX_CONTENT_LENGTH`) and row-capped (`MAX_ROWS`),
  saved under unique temp names, and deleted after processing.
- Internal exceptions are logged server-side and never returned to the client.
- CORS is restricted to an explicit origin allow-list.

## Out of scope

No auth, no database (everything in-memory per request), no theme switching
(the app is dark-only), no Docker, no tests.
