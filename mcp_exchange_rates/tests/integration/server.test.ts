import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { app, historyCache, HISTORY_CACHE_TTL_MS } from "../../src/server.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeApiResponse(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    info: { rate: 0.012, timestamp: 1700000000 },
    result: 1.2,
    ...overrides,
  };
}

beforeEach(() => { mockFetch.mockReset(); historyCache.clear(); });
afterEach(() => vi.restoreAllMocks());

// ── GET /infer ────────────────────────────────────────────────────────────────

describe("GET /infer", () => {
  it("returns code for a known alias", async () => {
    const res = await request(app).get("/infer?q=euros");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ code: "EUR" });
  });

  it("returns code for a 3-letter input", async () => {
    const res = await request(app).get("/infer?q=jpy");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ code: "JPY" });
  });

  it("returns null for an unknown currency", async () => {
    const res = await request(app).get("/infer?q=banana");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ code: null });
  });

  it("returns null for empty query", async () => {
    const res = await request(app).get("/infer?q=");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ code: null });
  });
});

// ── POST /convert — validation errors ────────────────────────────────────────

describe("POST /convert — validation", () => {
  it("rejects unknown from currency", async () => {
    const res = await request(app).post("/convert").send({ from: "banana", to: "USD", amount: 100 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/banana/);
  });

  it("rejects unknown to currency", async () => {
    const res = await request(app).post("/convert").send({ from: "USD", to: "xyz123", amount: 100 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/xyz123/);
  });

  it("rejects zero amount", async () => {
    const res = await request(app).post("/convert").send({ from: "USD", to: "EUR", amount: 0 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/positive/i);
  });

  it("rejects negative amount", async () => {
    const res = await request(app).post("/convert").send({ from: "USD", to: "EUR", amount: -50 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/positive/i);
  });

  it("rejects non-numeric amount", async () => {
    const res = await request(app).post("/convert").send({ from: "USD", to: "EUR", amount: "lots" });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/positive/i);
  });
});

// ── POST /convert — successful conversion ─────────────────────────────────────

describe("POST /convert — success", () => {
  it("converts USD to EUR using named currencies", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeApiResponse({ result: 92.5, info: { rate: 0.925 } }),
    });

    const res = await request(app).post("/convert").send({ from: "dollars", to: "euros", amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  });

  it("accepts 3-letter codes directly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeApiResponse({ result: 14900, info: { rate: 149 } }),
    });

    const res = await request(app).post("/convert").send({ from: "USD", to: "JPY", amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ from: "USD", to: "JPY" });
  });

  it("infers rate from result/amount when info.rate is absent", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, result: 85, info: {} }),
    });

    const res = await request(app).post("/convert").send({ from: "USD", to: "EUR", amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body.rate).toBeCloseTo(0.85, 5);
  });

  it("handles very small rates (INR to USD)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => makeApiResponse({ result: 120105.06, info: { rate: 0.011996 } }),
    });

    const res = await request(app).post("/convert").send({ from: "indian rupees", to: "dollars", amount: 10012421 });
    expect(res.status).toBe(200);
    expect(res.body.rate).toBeCloseTo(0.011996, 4);
  });
});

// ── POST /convert — upstream errors ──────────────────────────────────────────

describe("POST /convert — upstream errors", () => {
  it("returns 502 on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    const res = await request(app).post("/convert").send({ from: "USD", to: "EUR", amount: 100 });
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/network/i);
  });

  it("returns 502 on non-OK HTTP response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403, statusText: "Forbidden" });
    const res = await request(app).post("/convert").send({ from: "USD", to: "EUR", amount: 100 });
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/403/);
  });

  it("returns 502 when API success flag is false", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: { info: "Invalid API key" } }),
    });
    const res = await request(app).post("/convert").send({ from: "USD", to: "EUR", amount: 100 });
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/invalid api key/i);
  });
});

// ── GET /history — helpers ────────────────────────────────────────────────────

function makeTimeframeResponse(source: string, target: string, dailyRates: Record<string, number>) {
  const pairKey = `${source}${target}`;
  return {
    success: true,
    timeframe: true,
    source,
    quotes: Object.fromEntries(
      Object.entries(dailyRates).map(([date, rate]) => [date, { [pairKey]: rate }])
    ),
  };
}

function mockTimeframeOnce(source: string, target: string, dailyRates: Record<string, number>) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => makeTimeframeResponse(source, target, dailyRates),
  });
}

// ── GET /history — validation ─────────────────────────────────────────────────

describe("GET /history — validation", () => {
  it("rejects unknown from currency", async () => {
    const res = await request(app).get("/history?from=banana&to=USD");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/banana/);
  });

  it("rejects unknown to currency", async () => {
    const res = await request(app).get("/history?from=USD&to=xyz123");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/xyz123/);
  });
});

// ── GET /history — success ────────────────────────────────────────────────────

describe("GET /history — success", () => {
  it("returns dates and rates arrays", async () => {
    mockTimeframeOnce("USD", "EUR", { "2026-04-01": 0.91, "2026-04-02": 0.92 });

    const res = await request(app).get("/history?from=USD&to=EUR");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ from: "USD", to: "EUR" });
    expect(res.body.dates).toEqual(["2026-04-01", "2026-04-02"]);
    expect(res.body.rates).toEqual([0.91, 0.92]);
  });

  it("resolves currency names to ISO codes", async () => {
    mockTimeframeOnce("EUR", "JPY", { "2026-04-01": 162.5 });

    const res = await request(app).get("/history?from=euros&to=yen");
    expect(res.status).toBe(200);
    expect(res.body.from).toBe("EUR");
    expect(res.body.to).toBe("JPY");
  });

  it("returns dates sorted chronologically", async () => {
    mockTimeframeOnce("USD", "GBP", {
      "2026-04-03": 0.79,
      "2026-04-01": 0.77,
      "2026-04-02": 0.78,
    });

    const res = await request(app).get("/history?from=USD&to=GBP");
    expect(res.status).toBe(200);
    expect(res.body.dates).toEqual(["2026-04-01", "2026-04-02", "2026-04-03"]);
    expect(res.body.rates).toEqual([0.77, 0.78, 0.79]);
  });
});

// ── GET /history — caching ────────────────────────────────────────────────────

describe("GET /history — caching", () => {
  it("serves second request from cache without calling fetch again", async () => {
    mockTimeframeOnce("USD", "EUR", { "2026-04-01": 0.91 });

    await request(app).get("/history?from=USD&to=EUR");
    await request(app).get("/history?from=USD&to=EUR");

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("re-fetches after the cache TTL expires", async () => {
    mockTimeframeOnce("USD", "EUR", { "2026-04-01": 0.91 });
    mockTimeframeOnce("USD", "EUR", { "2026-04-01": 0.92 });

    await request(app).get("/history?from=USD&to=EUR");

    vi.spyOn(Date, "now").mockReturnValue(Date.now() + HISTORY_CACHE_TTL_MS + 1);

    const res = await request(app).get("/history?from=USD&to=EUR");
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(res.body.rates).toEqual([0.92]);
  });

  it("caches pairs independently", async () => {
    mockTimeframeOnce("USD", "EUR", { "2026-04-01": 0.91 });
    mockTimeframeOnce("USD", "GBP", { "2026-04-01": 0.79 });

    await request(app).get("/history?from=USD&to=EUR");
    await request(app).get("/history?from=USD&to=GBP");
    await request(app).get("/history?from=USD&to=EUR"); // cache hit

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

// ── GET /history — upstream errors ───────────────────────────────────────────

describe("GET /history — upstream errors", () => {
  it("returns 502 on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    const res = await request(app).get("/history?from=USD&to=EUR");
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/network/i);
  });

  it("returns 502 on non-OK HTTP response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429, statusText: "Too Many Requests" });
    const res = await request(app).get("/history?from=USD&to=EUR");
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/429/);
  });

  it("returns 502 when API success flag is false", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: { info: "Invalid access key" } }),
    });
    const res = await request(app).get("/history?from=USD&to=EUR");
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/invalid access key/i);
  });

  it("returns 502 when quotes field is missing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    const res = await request(app).get("/history?from=USD&to=EUR");
    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/no quote data/i);
  });
});
