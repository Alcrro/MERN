import { isLightHex } from "./colorUtils";

describe("isLightHex", () => {
  test("white (#ffffff) is light", () => {
    expect(isLightHex("#ffffff")).toBe(true);
  });

  test("black (#000000) is dark", () => {
    expect(isLightHex("#000000")).toBe(false);
  });

  test("yellow (#ffff00) is light", () => {
    expect(isLightHex("#ffff00")).toBe(true);
  });

  test("dark navy (#0d1117) is dark", () => {
    expect(isLightHex("#0d1117")).toBe(false);
  });

  test("mid gray (#bbbbbb) is light (above threshold 180)", () => {
    expect(isLightHex("#bbbbbb")).toBe(true);
  });
});
