import { test, expect, type Page } from "@playwright/test";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function mockConvert(page: Page, payload: Record<string, unknown>) {
  await page.route("/convert", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payload) })
  );
}

async function mockConvertError(page: Page, error: string, status = 400) {
  await page.route("/convert", (route) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ error }) })
  );
}

async function mockHistory(page: Page, payload: Record<string, unknown>, status = 200) {
  await page.route("/history**", (route) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(payload) })
  );
}

// ── Page load ─────────────────────────────────────────────────────────────────

test("page loads with correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Currency Converter");
  await expect(page.getByRole("heading", { name: "Currency Converter" })).toBeVisible();
});

// ── Currency inference badges ──────────────────────────────────────────────────

test("shows recognised badge for known currency name", async ({ page }) => {
  await page.goto("/");
  await page.fill("#from", "euros");
  await expect(page.locator("#from-badge .badge.found")).toHaveText("EUR");
});

test("shows recognised badge for 3-letter code", async ({ page }) => {
  await page.goto("/");
  await page.fill("#to", "JPY");
  await expect(page.locator("#to-badge .badge.found")).toHaveText("JPY");
});

test("shows not-recognised badge for unknown input", async ({ page }) => {
  await page.goto("/");
  await page.fill("#from", "banana");
  await expect(page.locator("#from-badge .badge.notfound")).toBeVisible();
});

test("clears badge when input is cleared", async ({ page }) => {
  await page.goto("/");
  await page.fill("#from", "euros");
  await expect(page.locator("#from-badge .badge.found")).toBeVisible();
  await page.fill("#from", "");
  await expect(page.locator("#from-badge")).toBeEmpty();
});

// ── Swap button ───────────────────────────────────────────────────────────────

test("swap button exchanges from and to values", async ({ page }) => {
  await page.goto("/");
  await page.fill("#from", "euros");
  await page.fill("#to", "dollars");
  await page.click("#swap");
  await expect(page.locator("#from")).toHaveValue("dollars");
  await expect(page.locator("#to")).toHaveValue("euros");
});

// ── Successful conversion ─────────────────────────────────────────────────────

test("displays conversion result", async ({ page }) => {
  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await expect(page.locator("#result")).toBeVisible();
  await expect(page.locator("#result-amount")).toContainText("92.5");
  await expect(page.locator("#result-meta")).toContainText("0.925000");
});

test("displays very small rate using significant digits", async ({ page }) => {
  await mockConvert(page, { from: "INR", to: "USD", amount: 100, converted_amount: 1.1996, rate: 0.011996 });
  await page.goto("/");
  await page.fill("#from", "INR");
  await page.fill("#to", "USD");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await expect(page.locator("#result-meta")).toContainText("0.011996");
});

// ── Error states ──────────────────────────────────────────────────────────────

test("shows error for unrecognised currency", async ({ page }) => {
  await page.goto("/");
  await page.fill("#from", "banana");
  await page.fill("#to", "USD");
  await page.fill("#amount", "100");
  // /convert won't be called since server rejects unknown currencies — but we can also
  // mock a 400 to verify the UI error path end-to-end
  await mockConvertError(page, 'Could not recognise currency: "banana"');
  await page.click("#convert-btn");
  await expect(page.locator("#error-msg")).toBeVisible();
  await expect(page.locator("#error-msg")).toContainText("banana");
});

test("shows error on upstream API failure", async ({ page }) => {
  await mockConvertError(page, "API error: 403 Forbidden", 502);
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await expect(page.locator("#error-msg")).toBeVisible();
  await expect(page.locator("#error-msg")).toContainText("403");
});

// ── Chart panel ───────────────────────────────────────────────────────────────

test("chart placeholder is visible on load, chart container is hidden", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#chart-placeholder")).toBeVisible();
  await expect(page.locator("#chart-container")).not.toBeVisible();
});

test("convert button shows loading state and is disabled while chart loads", async ({ page }) => {
  await page.clock.install();
  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await mockHistory(page, { from: "USD", to: "EUR", dates: ["2026-04-01"], rates: [0.92] });
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await expect(page.locator("#result")).toBeVisible();
  await expect(page.locator("#convert-btn")).toBeDisabled();
  await expect(page.locator("#convert-btn")).toHaveText("Loading chart…");
});

test("chart renders and placeholder hides after successful conversion", async ({ page }) => {
  await page.clock.install();
  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await mockHistory(page, {
    from: "USD", to: "EUR",
    dates: ["2026-04-01", "2026-04-02", "2026-04-03"],
    rates: [0.91, 0.92, 0.93],
  });
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await expect(page.locator("#result")).toBeVisible();
  await page.clock.fastForward(3000);
  await expect(page.locator("#chart-container")).toBeVisible();
  await expect(page.locator("#chart-placeholder")).not.toBeVisible();
  await expect(page.locator("#chart-pair-label")).toHaveText("USD / EUR");
});

test("convert button is re-enabled after chart loads", async ({ page }) => {
  await page.clock.install();
  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await mockHistory(page, { from: "USD", to: "EUR", dates: ["2026-04-01"], rates: [0.92] });
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await page.clock.fastForward(3000);
  await expect(page.locator("#convert-btn")).toBeEnabled();
  await expect(page.locator("#convert-btn")).toHaveText("Convert");
});

test("chart stats are populated after conversion", async ({ page }) => {
  await page.clock.install();
  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await mockHistory(page, {
    from: "USD", to: "EUR",
    dates: ["2026-04-01", "2026-04-02", "2026-04-03"],
    rates: [0.91, 0.93, 0.92],
  });
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await page.clock.fastForward(3000);
  await expect(page.locator("#stat-current")).not.toBeEmpty();
  await expect(page.locator("#stat-high")).not.toBeEmpty();
  await expect(page.locator("#stat-low")).not.toBeEmpty();
  await expect(page.locator("#stat-change")).not.toBeEmpty();
});

test("chart placeholder is restored when history fetch returns an error", async ({ page }) => {
  await page.clock.install();
  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await mockHistory(page, { error: "API error: 429 Too Many Requests" }, 502);
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await expect(page.locator("#result")).toBeVisible();
  await page.clock.fastForward(3000);
  await expect(page.locator("#chart-placeholder")).toBeVisible();
  await expect(page.locator("#chart-container")).not.toBeVisible();
});

test("chart pair label updates when a second conversion uses a different pair", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");

  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await mockHistory(page, { from: "USD", to: "EUR", dates: ["2026-04-01"], rates: [0.92] });
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await page.clock.fastForward(3000);
  await expect(page.locator("#chart-pair-label")).toHaveText("USD / EUR");

  await page.unrouteAll();
  await mockConvert(page, { from: "GBP", to: "JPY", amount: 50, converted_amount: 9500, rate: 190 });
  await mockHistory(page, { from: "GBP", to: "JPY", dates: ["2026-04-01"], rates: [190] });
  await page.fill("#from", "GBP");
  await page.fill("#to", "JPY");
  await page.fill("#amount", "50");
  await page.click("#convert-btn");
  await page.clock.fastForward(3000);
  await expect(page.locator("#chart-pair-label")).toHaveText("GBP / JPY");
});

// ── Error states ──────────────────────────────────────────────────────────────

test("hides previous error when a new successful conversion runs", async ({ page }) => {
  // First request fails
  await mockConvertError(page, "API error: 403 Forbidden", 502);
  await page.goto("/");
  await page.fill("#from", "USD");
  await page.fill("#to", "EUR");
  await page.fill("#amount", "100");
  await page.click("#convert-btn");
  await expect(page.locator("#error-msg")).toBeVisible();

  // Second request succeeds
  await page.unrouteAll();
  await mockConvert(page, { from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 });
  await page.click("#convert-btn");
  await expect(page.locator("#error-msg")).not.toBeVisible();
  await expect(page.locator("#result")).toBeVisible();
});
