import "dotenv/config";
import express from "express";
import cors from "cors";
import { getWeatherForCity } from "./weatherService.js";
import { getOutfitSuggestion } from "./fitLogic.js";

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/weather", async (req, res) => {
  try {
    const city =
      (req.query.city || process.env.DEFAULT_CITY || "Budapest").toString();
    const country =
      (req.query.country || process.env.DEFAULT_COUNTRY || "").toString();

    const weather = await getWeatherForCity(city, country);

    const outfit = getOutfitSuggestion(
      weather.tempCelsius,
      weather.condition
    );

    res.json({
      city: weather.city,
      countryCode: weather.countryCode,
      countryName: weather.countryName,
      tempCelsius: weather.tempCelsius,
      condition: weather.condition,
      outfit
    });
  } catch (err) {
    console.error("Error in /api/weather:", err.message);

    if (err.statusCode === 404) {
      return res.status(404).json({ error: "City not found" });
    }

    if (err.response?.status === 429) {
      return res
        .status(503)
        .json({ error: "Upstream API rate limit – try again later" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

export { app };
