import { useState } from "react";
import type { WeatherResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function App() {
  const [city, setCity] = useState<string>(
    import.meta.env.VITE_DEFAULT_CITY || "Budapest"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setData(null);

    try {
      const url = `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with ${res.status}`);
      }
      const json = (await res.json()) as WeatherResponse;
      setData(json);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold">Weather & Outfit Suggester</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="border rounded px-2 py-1"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g. Budapest)"
        />
        <button
          type="submit"
          className="px-4 py-1 rounded bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Check"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <section className="border rounded p-4 shadow max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">
            {data.city}, {data.country || ""}
          </h2>
          <p>Temperature: {data.tempCelsius} °C</p>
          <p>Condition: {data.condition}</p>
          <p className="mt-2 font-semibold">
            Suggested outfit: <span className="font-mono">{data.outfit}</span>
          </p>
        </section>
      )}
    </main>
  );
}

export default App;