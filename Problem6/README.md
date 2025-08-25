# Problem6 — Free API Utility (Frontend + Backend)

This mini app demonstrates calling **free public APIs** from both the **backend (Express)** and the **frontend (HTML/JS)**.

- **Backend**: `/api/bitcoin` proxies **Coindesk** BTC price (no API key required).
- **Frontend**: Calls **Cat Facts API** directly from the browser to fetch a random fact.

## Run Locally
```bash
cd Problem6
npm install
npm run dev   # or: npm start
# Open http://localhost:5000
```

## Files
- `src/server.js` — Express server with `/api/bitcoin` route.
- `public/index.html` — UI with two buttons.
- `public/js/app.js` — Fetch logic for backend and frontend calls.
- `public/css/style.css` — Simple styles.
