import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("shows weather data and outfit on success", async () => {
    const mockData = {
      city: "Berlin",
      country: "Germany",
      tempCelsius: 15,
      condition: "partly cloudy",
      outfit: "light_jacket"
    };

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as unknown as Response);

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/enter city/i);
    await user.clear(input);
    await user.type(input, "Berlin");
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(await screen.findByText(/Berlin/)).toBeInTheDocument();
    expect(screen.getByText(/Temperature:/)).toHaveTextContent("15 °C");
    expect(screen.getByText(/Suggested outfit:/)).toHaveTextContent(
      "light_jacket"
    );
  });

  it("shows error on failed fetch", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: "City not found" })
    } as unknown as Response);

    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/enter city/i);
    await user.clear(input);
    await user.type(input, "Nowhere");
    await user.click(screen.getByRole("button", { name: /check/i }));

    expect(await screen.findByText(/City not found/i)).toBeInTheDocument();
  });
});
