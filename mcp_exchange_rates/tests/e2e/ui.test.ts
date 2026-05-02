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
