import type { RoutePlanResponse } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function planRouteWeather(payload: {
  origin: string;
  destination: string;
  departure_at?: string;
  sample_interval_km?: number;
  use_traffic?: boolean;
}): Promise<RoutePlanResponse> {
  const response = await fetch(`${baseUrl}/api/v1/route-weather/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Falha na API (${response.status})`);
  }

  return response.json() as Promise<RoutePlanResponse>;
}
