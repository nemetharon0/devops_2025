export function getOutfitSuggestion(tempCelsius, condition) {
  if (tempCelsius === null || tempCelsius === undefined) {
    throw new Error("Temperature is required");
  }

  const temp = Number(tempCelsius);
  const cond = (condition || "").toLowerCase();

  // Rain / snow override
  if (cond.includes("snow")) {
    return "heavy_jacket_and_boots";
  }
  if (cond.includes("rain")) {
    if (temp <= 10) return "raincoat_and_warm_clothes";
    return "light_rain_jacket";
  }

  // Basic by temperature
  if (temp <= 0) return "heavy_jacket_scarf_hat";
  if (temp <= 10) return "coat_and_sweater";
  if (temp <= 18) return "light_jacket";
  if (temp <= 25) return "tshirt_and_jeans";
  return "tshirt_and_shorts";
}