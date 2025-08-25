import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// Backend route that calls a FREE external API (Coindesk)
app.get("/api/bitcoin", async (req, res) => {
  try {
    const r = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
    const data = await r.json();
    const usd = data?.bpi?.USD?.rate || "N/A";
    res.json({ currency: "USD", price: usd, updated: data?.time?.updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Problem6 server running at http://localhost:${PORT}`));
