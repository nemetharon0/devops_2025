import axios from "axios";

const GEOCODING_API_URL =
  process.env.GEOCODING_API_URL ||
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_API_URL =
  process.env.FORECAST_API_URL ||
  "https://api.open-meteo.com/v1/forecast";

// Open-Meteo weather_code -> leírás (nagyon egyszerűsítve)
function mapWeatherCodeToDescription(code) {
  const map = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "depositing rime fog",
    51: "light drizzle",
    53: "moderate drizzle",
    55: "dense drizzle",
    61: "slight rain",
    63: "moderate rain",
    65: "heavy rain",
    71: "slight snowfall",
    73: "moderate snowfall",
    75: "heavy snowfall",
    80: "rain showers",
    81: "moderate rain showers",
    82: "violent rain showers"
  };
  return map[code] || "unknown";
}

export async function getWeatherForCity(city, countryCode) {
  if (!city || city.length < 2) {
    throw new Error("Invalid city name");
  }

  // 1) Geocoding: város → koordináta
  const geoRes = await axios.get(GEOCODING_API_URL, {
    params: {
      name: city,
      count: 1,
      language: "en",
      format: "json",
      countryCode: countryCode || undefined
    },
    timeout: 5000
  });

  const result = geoRes.data?.results?.[0];

  if (!result) {
    const err = new Error("City not found");
    err.statusCode = 404;
    throw err;
  }

  const {
    latitude,
    longitude,
    name,
    country_code: geoCountryCode,
    country
  } = result;

  // 2) Forecast API: koordináta → current weather
  const fcRes = await axios.get(FORECAST_API_URL, {
    params: {
      latitude,
      longitude,
      current: "temperature_2m,apparent_temperature,weather_code",
      timezone: "auto"
    },
    timeout: 5000
  });

  const current = fcRes.data?.current;
  if (!current) {
    throw new Error("Current weather not available");
  }

  const tempC = current.temperature_2m;
  const weatherCode = current.weather_code;
  const condition = mapWeatherCodeToDescription(weatherCode);

  return {
    city: name,
    countryCode: geoCountryCode || countryCode || null,
    countryName: country || null,
    tempCelsius: typeof tempC === "number" ? Number(tempC.toFixed(1)) : null,
    condition
  };
}