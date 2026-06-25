import type { CompareResponse, RoutePlanResponse } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function readError(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) {
    return `Falha na API (${response.status})`;
  }
  try {
    const parsed = JSON.parse(text) as {
      error?: { message?: string };
      message?: string;
    };
    return (
      parsed?.error?.message ||
      parsed?.message ||
      text
    );
  } catch {
    return text;
  }
}

export type PlanPayload = {
  origin: string;
  destination: string;
  departure_at?: string;
  sample_interval_km?: number;
  use_traffic?: boolean;
};

export async function planRouteWeather(
  payload: PlanPayload,
): Promise<RoutePlanResponse> {
  const response = await fetch(`${baseUrl}/api/v1/route-weather/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<RoutePlanResponse>;
}

export async function compareRouteWeather(payload: {
  origin: string;
  destination: string;
  departure_windows: string[];
  sample_interval_km?: number;
  use_traffic?: boolean;
}): Promise<CompareResponse> {
  const response = await fetch(`${baseUrl}/api/v1/route-weather/plan/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<CompareResponse>;
}
