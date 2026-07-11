import { buildProductSeo } from "./seoHelpers";

describe("buildProductSeo", () => {
  test("returns title with brand + model when both present", () => {
    const result = buildProductSeo(["Apple"], ["iPhone 15"], "/phones");
    expect(result.title).toBe("Apple iPhone 15");
    expect(result.path).toBe("/phones");
  });

  test("description mentions model and brand when both present", () => {
    const result = buildProductSeo(["Samsung"], ["Galaxy S24"], "/phones");
    expect(result.description).toContain("Galaxy S24");
    expect(result.description).toContain("Samsung");
  });

  test("returns brand-only title when no model", () => {
    const result = buildProductSeo(["Xiaomi"], [], "/phones");
    expect(result.title).toContain("Xiaomi");
    expect(result.description).toContain("Xiaomi");
  });

  test("returns generic title when no brand or model", () => {
    const result = buildProductSeo([], [], "/phones");
    expect(result.title).toBe("Telefoane și Accesorii");
  });

  test("handles multiple brands in title", () => {
    const result = buildProductSeo(["Apple", "Samsung"], [], "/phones");
    expect(result.title).toContain("Apple");
    expect(result.title).toContain("Samsung");
  });
});
