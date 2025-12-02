import { useState } from "react";
import type { WeatherResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const WIKI_SUMMARY_BASE =
  "https://en.wikipedia.org/api/rest_v1/page/summary/";

const OUTFIT_IMAGES: Record<string, string> = {
  heavy_jacket_and_boots: "/outfits/heavy_jacket_and_boots.png",
  raincoat_and_warm_clothes: "/outfits/raincoat_and_warm_clothes.png",
  light_rain_jacket: "/outfits/light_rain_jacket.png",
  heavy_jacket_scarf_hat: "/outfits/heavy_jacket_scarf_hat.png",
  coat_and_sweater: "/outfits/coat_and_sweater.png",
  light_jacket: "/outfits/light_jacket.png",
  tshirt_and_jeans: "/outfits/tshirt_and_jeans.png",
  tshirt_and_shorts: "/outfits/tshirt_and_shorts.png"
};

const OUTFIT_LABELS: Record<string, string> = {
  heavy_jacket_and_boots: "Heavy jacket & boots",
  raincoat_and_warm_clothes: "Raincoat & warm clothes",
  light_rain_jacket: "Light rain jacket",
  heavy_jacket_scarf_hat: "Heavy jacket, scarf & hat",
  coat_and_sweater: "Coat & sweater",
  light_jacket: "Light jacket",
  tshirt_and_jeans: "T-shirt & jeans",
  tshirt_and_shorts: "T-shirt & shorts"
};

function App() {
  const [city, setCity] = useState<string>(
    import.meta.env.VITE_DEFAULT_CITY || "Budapest"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const fetchWikiImage = async (cityName: string) => {
    try {
      const res = await fetch(
        `${WIKI_SUMMARY_BASE}${encodeURIComponent(cityName)}`
      );
      if (!res.ok) return null;
      const summary = await res.json();
      return (
        summary?.originalimage?.source ||
        summary?.thumbnail?.source ||
        null
      );
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setData(null);
    setBgUrl(null);

    try {
      const url = `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed with ${res.status}`);
      }
      const json = (await res.json()) as WeatherResponse;
      setData(json);

       const image = await fetchWikiImage(json.city);
       setBgUrl(image);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = bgUrl
    ? { backgroundImage: `url(${bgUrl})` }
    : undefined;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {bgUrl && (
        <div
          className="absolute inset-0 bg-center bg-cover blur-md opacity-70"
          style={backgroundStyle}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900/60 via-slate-950/55 to-black/60" />

      <main className="relative min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-white">
        <h1 className="text-3xl font-bold drop-shadow">
          Weather & Outfit Suggester
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 bg-white/10 backdrop-blur px-3 py-2 rounded-lg shadow"
        >
          <input
            className="border border-white/20 bg-white/10 rounded px-2 py-1 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city (e.g. Budapest)"
          />
          <button
            type="submit"
            className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600 transition text-white shadow"
            disabled={loading}
          >
            {loading ? "Loading..." : "Check"}
          </button>
        </form>

        {error && <p className="text-red-300">{error}</p>}

        {data && (
          <section className="border border-white/10 bg-white/10 backdrop-blur p-4 shadow max-w-md w-full rounded-lg">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span>{data.city}</span>
              {data.country && (
                <span className="text-sm text-slate-200">({data.country})</span>
              )}
            </h2>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 text-white font-semibold backdrop-blur border border-white/20 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                {data.tempCelsius} °C
              </span>
              <span className="text-sm text-slate-100">{data.condition}</span>
            </div>
            <p className="mt-2 font-semibold">
              Suggested outfit:{" "}
              <span className="font-mono">
                {OUTFIT_LABELS[data.outfit] || data.outfit}
              </span>
            </p>
            {data.outfit && OUTFIT_IMAGES[data.outfit] && (
              <div className="mt-4">
                <img
                  src={OUTFIT_IMAGES[data.outfit]}
                  alt={data.outfit}
                  className="w-full max-h-64 object-cover rounded-lg shadow-lg border border-white/10 cursor-pointer"
                  onClick={() => setLightboxUrl(OUTFIT_IMAGES[data.outfit])}
                />
                <p className="mt-1 text-sm text-slate-200 text-center">
                  Outfit preview
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm hover:bg-black/80 transition"
              onClick={() => setLightboxUrl(null)}
            >
              Close
            </button>
            <img
              src={lightboxUrl}
              alt="Outfit enlarged"
              className="w-full rounded-xl shadow-2xl border border-white/10 object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
