import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import { inferCurrencyCode } from "./currencyMap.js";

dotenv.config();

const API_KEY = process.env.EXCHANGERATE_HOST_API_KEY;
if (!API_KEY) throw new Error("EXCHANGERATE_HOST_API_KEY is not set");

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "../public")));

export const historyCache = new Map<string, { data: unknown; expiresAt: number }>();
export const HISTORY_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

app.post("/convert", async (req, res) => {
  const { from, to, amount } = req.body as { from?: string; to?: string; amount?: unknown };

  const fromCode = inferCurrencyCode(from ?? "");
  const toCode = inferCurrencyCode(to ?? "");
  const parsedAmount = Number(amount);

  if (!fromCode) return void res.status(400).json({ error: `Could not recognise currency: "${from}"` });
  if (!toCode) return void res.status(400).json({ error: `Could not recognise currency: "${to}"` });
  if (!parsedAmount || parsedAmount <= 0) return void res.status(400).json({ error: "Amount must be a positive number" });

  const params = new URLSearchParams({
    access_key: API_KEY,
    from: fromCode,
    to: toCode,
    amount: String(parsedAmount),
  });

  let response: Response;
  try {
    response = await fetch(`https://api.exchangerate.host/convert?${params}`);
  } catch (err) {
    return void res.status(502).json({ error: `Network error: ${err instanceof Error ? err.message : String(err)}` });
  }

  if (!response.ok) {
    return void res.status(502).json({ error: `API error: ${response.status} ${response.statusText}` });
  }

  const data = (await response.json()) as Record<string, unknown>;

  if (data["success"] !== true) {
    const info = (data["error"] as Record<string, unknown> | undefined)?.["info"];
    return void res.status(502).json({ error: `Conversion failed: ${info ?? "unknown error"}` });
  }

  const rateInfo = data["info"] as Record<string, unknown> | undefined;
  const result = typeof data["result"] === "number" ? data["result"] : null;

  // Prefer info.rate; fall back to computing it from the result
  const rate =
    typeof rateInfo?.["rate"] === "number"
      ? rateInfo["rate"]
      : result !== null
        ? result / parsedAmount
        : null;

  res.json({
    from: fromCode,
    to: toCode,
    amount: parsedAmount,
    converted_amount: result,
    rate,
  });
});

app.get("/history", async (req, res) => {
  const fromParam = typeof req.query["from"] === "string" ? req.query["from"] : "";
  const toParam = typeof req.query["to"] === "string" ? req.query["to"] : "";

  const fromCode = inferCurrencyCode(fromParam);
  const toCode = inferCurrencyCode(toParam);

  if (!fromCode) return void res.status(400).json({ error: `Could not recognise currency: "${fromParam}"` });
  if (!toCode) return void res.status(400).json({ error: `Could not recognise currency: "${toParam}"` });

  const cacheKey = `${fromCode}:${toCode}`;
  const cached = historyCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return void res.json(cached.data);
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 89);

  const fmt = (d: Date): string => d.toISOString().substring(0, 10);

  const params = new URLSearchParams({
    access_key: API_KEY,
    start_date: fmt(startDate),
    end_date: fmt(endDate),
    currencies: toCode,
    source: fromCode,
  });

  let response: Response;
  try {
    response = await fetch(`https://api.exchangerate.host/timeframe?${params}`);
  } catch (err) {
    return void res.status(502).json({ error: `Network error: ${err instanceof Error ? err.message : String(err)}` });
  }

  if (!response.ok) {
    return void res.status(502).json({ error: `API error: ${response.status} ${response.statusText}` });
  }

  const data = (await response.json()) as Record<string, unknown>;

  if (data["success"] !== true) {
    const info = (data["error"] as Record<string, unknown> | undefined)?.["info"];
    return void res.status(502).json({ error: `History failed: ${info ?? "unknown error"}` });
  }

  const quotes = data["quotes"] as Record<string, Record<string, number>> | undefined;
  if (!quotes) {
    return void res.status(502).json({ error: "No quote data in response" });
  }

  const pairKey = `${fromCode}${toCode}`;
  const dates = Object.keys(quotes).sort();
  const rates = dates.map(date => quotes[date]?.[pairKey] ?? null);

  const result = { from: fromCode, to: toCode, dates, rates };
  historyCache.set(cacheKey, { data: result, expiresAt: Date.now() + HISTORY_CACHE_TTL_MS });
  res.json(result);
});

app.get("/infer", (req, res) => {
  const q = typeof req.query["q"] === "string" ? req.query["q"] : "";
  const code = inferCurrencyCode(q);
  res.json({ code });
});

export { app };

// Only bind to a port when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Currency Converter running at http://localhost:${PORT}`);
  });
}
