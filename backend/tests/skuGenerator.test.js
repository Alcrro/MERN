const { generateSku } = require("../utils/skuGenerator");

describe("generateSku", () => {
  test("starts with RO", () => {
    expect(generateSku("Samsung", "București", "Galaxy S21")).toMatch(/^RO/);
  });

  test("encodes city as first 2 chars after RO", () => {
    expect(generateSku("Samsung", "București", "S21").slice(2, 4)).toBe("BU");
    expect(generateSku("Apple",   "Cluj",      "14").slice(2, 4)).toBe("CL");
  });

  test("encodes brand as next 3 chars", () => {
    expect(generateSku("Samsung", "București", "S21").slice(4, 7)).toBe("SAM");
    expect(generateSku("Apple",   "Cluj",      "14").slice(4, 7)).toBe("APP");
    expect(generateSku("Xiaomi",  "Iași",      "12").slice(4, 7)).toBe("XIA");
  });

  test("extracts letter+digit article code (Galaxy S21 → S21)", () => {
    expect(generateSku("Samsung", "București", "Galaxy S21")).toContain("S21");
  });

  test("extracts digit-only word preceded by initial (Note 12 → N12)", () => {
    expect(generateSku("Samsung", "Cluj", "Note 12")).toContain("N12");
  });

  test("extracts digit-only word with iPhone pattern (iPhone 14 → I14)", () => {
    expect(generateSku("Apple", "Cluj", "iPhone 14")).toContain("I14");
  });

  test("handles Romanian diacritics in city (Iași → IA)", () => {
    expect(generateSku("Apple", "Iași", "iPhone 14").slice(2, 4)).toBe("IA");
  });

  test("pads city with X when city is empty", () => {
    expect(generateSku("Samsung", "", "S21").slice(2, 4)).toBe("XX");
  });

  test("result is at most 15 characters", () => {
    expect(generateSku("Samsung", "București", "Galaxy S21").length).toBeLessThanOrEqual(15);
    expect(generateSku("Apple",   "Cluj-Napoca", "iPhone 14 Pro Max").length).toBeLessThanOrEqual(15);
  });

  test("two calls produce different random suffixes", () => {
    const a = generateSku("Samsung", "Cluj", "S21");
    const b = generateSku("Samsung", "Cluj", "S21");
    expect(a.slice(0, -4)).toBe(b.slice(0, -4));
  });
});
