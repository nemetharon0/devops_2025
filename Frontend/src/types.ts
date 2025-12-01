export type WeatherResponse = {
  city: string;
  country: string | null;
  tempCelsius: number;
  condition: string;
  outfit: string;
};