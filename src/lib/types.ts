export type TimelineItem = {
  order: number;
  estimated_at: string;
  eta_offset_seconds: number;
  distance_from_start_km: number;
  location: { lat: number; lng: number; city?: string | null };
  weather: {
    temperature_c: number | null;
    rain_probability: number | null;
    condition: string | null;
    weather_code: number | null;
    precipitation_intensity_mm_h: number | null;
  };
};

export type RoutePlanResponse = {
  meta: {
    generated_at: string;
    departure_at: string;
    sample_interval_km: number;
  };
  route: {
    summary: string;
    polyline: string;
    total_distance_m: number;
    total_duration_s: number;
  };
  timeline: TimelineItem[];
  risk: {
    score: number;
    alerts: Array<{
      type: string;
      label: string;
      severity: string;
      segment: string;
      order: number;
    }>;
    summary: string;
  };
};
