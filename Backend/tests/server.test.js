import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { app } from "../server.js";
import { getWeatherForCity } from "../weatherService.js";

vi.mock("../weatherService.js", () => ({
  getWeatherForCity: vi.fn()
}));

describe("server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("healthcheck responds with ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("returns weather and outfit", async () => {
    getWeatherForCity.mockResolvedValue({
      city: "Berlin",
      countryCode: "DE",
      countryName: "Germany",
      tempCelsius: 15.2,
      condition: "rain showers"
    });

    const res = await request(app).get("/api/weather?city=Berlin");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      city: "Berlin",
      countryCode: "DE",
      countryName: "Germany",
      tempCelsius: 15.2,
      condition: "rain showers",
      outfit: "light_rain_jacket"
    });
  });

  it("returns 404 when city not found", async () => {
    const err = new Error("City not found");
    err.statusCode = 404;
    getWeatherForCity.mockRejectedValue(err);

    const res = await request(app).get("/api/weather?city=Nowhere");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "City not found" });
  });
});
