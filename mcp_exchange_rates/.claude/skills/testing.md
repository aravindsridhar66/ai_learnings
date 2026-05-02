# testing skill

## Running tests

**Unit + integration tests (Vitest):**
```bash
npm test
```

**Watch mode during development:**
```bash
npm run test:watch
```

**E2E tests (Playwright / Chromium):**
```bash
npm run build && npm run test:e2e
```
Playwright starts the server automatically on port 3001 — no need to run it manually.

## Test structure

```
tests/
  setup.ts                    # sets EXCHANGERATE_HOST_API_KEY for all Vitest tests
  unit/
    currencyMap.test.ts       # inferCurrencyCode — aliases, codes, edge cases
  integration/
    server.test.ts            # Express routes via supertest with mocked fetch
  e2e/
    ui.test.ts                # Playwright browser tests
```

## Rules for new code

1. **All tests must pass before committing.** Run `npm test` and `npm run test:e2e` and fix any failures first.

2. **New functionality requires test coverage:**
   - New currency aliases → add cases to `tests/unit/currencyMap.test.ts`
   - New or changed API/server behaviour → add cases to `tests/integration/server.test.ts`
   - New UI behaviour → add cases to `tests/e2e/ui.test.ts`
   - New MCP tools → add a new test file under `tests/unit/` or `tests/integration/`

3. **Error states must be tested.** Every new feature should cover at least one error/edge case, not just the happy path.

4. **Integration tests mock fetch** — never hit the real exchangerate.host API in tests. Use `vi.stubGlobal('fetch', mockFetch)` and return a shaped response object.

5. **E2E tests mock `/convert`** — use `page.route('/convert', ...)` to return preset payloads. Tests should not depend on a live API key or network.

## Key patterns

**Mocking fetch in integration tests:**
```typescript
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ success: true, info: { rate: 0.925 }, result: 92.5 }),
});
```

**Mocking the /convert endpoint in E2E tests:**
```typescript
await page.route("/convert", (route) =>
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ from: "USD", to: "EUR", amount: 100, converted_amount: 92.5, rate: 0.925 }),
  })
);
```
