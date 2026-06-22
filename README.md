# Sentinel — AI Fraudedetectie

Een full-stack AI-webapp die frauduleuze transacties opspoort met een Isolation Forest
machine-learning model. De frontend is het **Sentinel**-dashboard: een strak fintech-design
met licht/donker-thema, een auto-roterende 3D-transactieruimte, en een super-simpele uitleg
van hoe het model werkt.

**Student:** Adam Saber — MBO Software Development, Grafisch Lyceum Rotterdam
**Opdracht:** Minor eindproject — AI/Machine Learning met Python

---

## Setup & Run

### Backend

```bash
cd backend
pip3 install -r requirements.txt
python3 app.py
# Draait op http://localhost:5001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Draait op http://localhost:5173 (proxy't /api naar de backend op :5001)
```

---

## Gebruik

- Open `http://localhost:5173`
- Klik op **Demo data laden** om het systeem direct in actie te zien (ruim 1.200 transacties: 10 fraude + 4 verdacht)
- Of upload een eigen CSV met de kolommen: `amount`, `hour`, `location_score`, `daily_frequency`
- Klik een transactie aan voor het detailpaneel ("waarom gemarkeerd" + bijdrage per kenmerk)
- Wissel rechtsboven tussen licht en donker thema

---

## Schermen

| Scherm | Inhoud |
|---|---|
| **Data inladen** | Demo-data of CSV-upload, met een geanimeerde "model traint…"-overlay |
| **Dashboard** | KPI's + 3 layouts (Overzicht / Visueel / Analyse): 3D-puntenwolk, statusdonut, transacties-per-uur, top-risico |
| **Transacties** | Filterbare lijst (Alle / Verdacht / Fraude) met risicoscore-balken |
| **Hoe werkt het** | Geanimeerde uitleg van Isolation Forest (diepe vs. ondiepe isolatie) |

---

## CSV-formaat

| Kolom | Beschrijving |
|---|---|
| `transaction_id` | Unieke identifier |
| `amount` | Transactiebedrag in € |
| `hour` | Uur van de dag (0–23) — `time` wordt ook geaccepteerd |
| `location_score` | Vertrouwdheid van locatie (0 = onbekend, 1 = bekend) |
| `daily_frequency` | Aantal transacties die dag |

---

## API

De Flask-backend (poort 5001) draait per request het hele model in-memory en geeft JSON terug:

- `GET /api/health` — health check
- `GET /api/demo` — genereert demo-data, traint, scoort en geeft resultaten terug
- `POST /api/upload` — verwerkt een geüploade CSV op dezelfde manier (`multipart/form-data`, veld `file`)

Elke transactie krijgt het echte modeloutput mee: `is_fraud`, `anomaly_score`, `risk_level`,
plus een afgeleide `risk` (0–100) en `status` (`normaal` / `verdacht` / `fraude`). De `stats`
worden over de volledige dataset berekend; de transactielijst is beperkt tot max. 500 rijen.

---

## Tech Stack

| Laag | Technologie |
|---|---|
| ML-model | scikit-learn Isolation Forest (contamination 0.05, 200 bomen) |
| Backend | Python + Flask + pandas |
| Frontend | React 19 + Vite |
| Grafieken | Apache ECharts + ECharts-GL (3D) |
| Styling | CSS variables + inline styles (licht/donker thema), fonts: Space Grotesk · IBM Plex Sans · IBM Plex Mono |
