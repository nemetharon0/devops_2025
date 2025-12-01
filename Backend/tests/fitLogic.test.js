import { describe, it, expect } from "vitest";
import { getOutfitSuggestion } from "../fitLogic.js";

describe("getOutfitSuggestion", () => {
  it("returns warm gear for freezing temps", () => {
    expect(getOutfitSuggestion(-2, "clear")).toBe("heavy_jacket_scarf_hat");
  });

  it("prefers raincoat on cold rain", () => {
    expect(getOutfitSuggestion(8, "rain")).toBe("raincoat_and_warm_clothes");
  });

  it("uses light rain jacket on mild rain", () => {
    expect(getOutfitSuggestion(15, "rain showers")).toBe("light_rain_jacket");
  });

  it("overrides to boots on snow", () => {
    expect(getOutfitSuggestion(1, "snow")).toBe("heavy_jacket_and_boots");
  });

  it("throws when temperature missing", () => {
    expect(() => getOutfitSuggestion(undefined, "clear")).toThrow();
  });
});
