export type Weather = {
  temperature_c: number | null;
  rain_probability: number | null;
  condition: string | null;
  weather_code: number | null;
  precipitation_intensity_mm_h: number | null;
  wind_speed_kmh: number | null;
  visibility_km: number | null;
  cloud_cover: number | null;
};

export type TimelineItem = {
  order: number;
  estimated_at: string;
  eta_offset_seconds: number;
  distance_from_start_km: number;
  location: { lat: number; lng: number; city?: string | null };
  weather: Weather;
};

export type RiskAlert = {
  type: string;
  label: string;
  severity: string;
  segment: string;
  order: number;
};

export type Risk = {
  score: number;
  alerts: RiskAlert[];
  summary: string;
};

export type RoutePlanResponse = {
  meta: {
    generated_at: string;
    departure_at: string;
    sample_interval_km: number;
    warnings: string[];
  };
  route: {
    summary: string;
    polyline: string;
    total_distance_m: number;
    total_duration_s: number;
  };
  timeline: TimelineItem[];
  risk: Risk;
};

export type CompareOption = {
  departure_at: string;
  arrival_at: string;
  route: {
    total_distance_m: number;
    total_duration_s: number;
  };
  risk: {
    score: number;
    summary: string;
    alerts_count: number;
  };
};

export type CompareResponse = {
  origin: string;
  destination: string;
  options: CompareOption[];
  best: { departure_at: string; score: number } | null;
  recommendation: string;
};
