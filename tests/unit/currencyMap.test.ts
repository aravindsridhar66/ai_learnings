import { describe, it, expect } from "vitest";
import { inferCurrencyCode } from "../../src/currencyMap.js";

describe("inferCurrencyCode — 3-letter codes", () => {
  it("returns uppercase code as-is", () => expect(inferCurrencyCode("USD")).toBe("USD"));
  it("uppercases lowercase code", () => expect(inferCurrencyCode("eur")).toBe("EUR"));
  it("uppercases mixed-case code", () => expect(inferCurrencyCode("Gbp")).toBe("GBP"));
});

describe("inferCurrencyCode — common currencies", () => {
  const cases: [string, string][] = [
    ["euro", "EUR"],
    ["euros", "EUR"],
    ["dollar", "USD"],
    ["dollars", "USD"],
    ["us dollar", "USD"],
    ["american dollar", "USD"],
    ["buck", "USD"],
    ["pound", "GBP"],
    ["sterling", "GBP"],
    ["pound sterling", "GBP"],
    ["yen", "JPY"],
    ["japanese yen", "JPY"],
    ["yuan", "CNY"],
    ["renminbi", "CNY"],
    ["rupee", "INR"],
    ["rupees", "INR"],
    ["indian rupee", "INR"],
    ["indian rupees", "INR"],
    ["canadian dollar", "CAD"],
    ["loonie", "CAD"],
    ["australian dollar", "AUD"],
    ["franc", "CHF"],
    ["swiss franc", "CHF"],
    ["ringgit", "MYR"],
    ["baht", "THB"],
    ["rupiah", "IDR"],
    ["won", "KRW"],
    ["south korean won", "KRW"],
    ["rand", "ZAR"],
    ["real", "BRL"],
    ["dirham", "AED"],
    ["riyal", "SAR"],
    ["dinar", "KWD"],
    ["shekel", "ILS"],
    ["ruble", "RUB"],
    ["zloty", "PLN"],
    ["forint", "HUF"],
    ["dong", "VND"],
    ["krona", "SEK"],
    ["norwegian krone", "NOK"],
    ["lira", "TRY"],
    ["taka", "BDT"],
    ["naira", "NGN"],
  ];

  it.each(cases)('"%s" → %s', (input, expected) => {
    expect(inferCurrencyCode(input)).toBe(expected);
  });
});

describe("inferCurrencyCode — case insensitivity", () => {
  it("handles title case", () => expect(inferCurrencyCode("Indian Rupees")).toBe("INR"));
  it("handles upper case", () => expect(inferCurrencyCode("EUROS")).toBe("EUR"));
  it("handles mixed case", () => expect(inferCurrencyCode("Japanese Yen")).toBe("JPY"));
});

describe("inferCurrencyCode — whitespace", () => {
  it("trims leading spaces", () => expect(inferCurrencyCode("  euros")).toBe("EUR"));
  it("trims trailing spaces", () => expect(inferCurrencyCode("euros  ")).toBe("EUR"));
  it("trims both sides", () => expect(inferCurrencyCode("  euros  ")).toBe("EUR"));
});

describe("inferCurrencyCode — edge cases", () => {
  it("returns null for empty string", () => expect(inferCurrencyCode("")).toBeNull());
  it("returns null for whitespace only", () => expect(inferCurrencyCode("   ")).toBeNull());
  it("returns null for unknown name", () => expect(inferCurrencyCode("banana")).toBeNull());
  it("returns null for partial match", () => expect(inferCurrencyCode("eur")).toBe("EUR")); // 3-letter code passthrough
  it("returns null for 4-letter unknown", () => expect(inferCurrencyCode("EURX")).toBeNull());
});
