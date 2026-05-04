"use client";

import type { TimelineItem } from "@/lib/types";

type Props = {
  items: TimelineItem[];
};

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function WeatherTimeline({ items }: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Linha do tempo climática</h2>
        <span className="text-xs text-black/50 dark:text-white/50">
          {items.length} pontos
        </span>
      </header>
      <ol className="relative space-y-4 border-l border-black/10 pl-6 dark:border-white/15">
        {items.map((item) => (
          <li key={item.order} className="relative">
            <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-black" />
            <div className="flex flex-col gap-1 rounded-xl border border-black/5 bg-white/80 p-4 text-sm dark:border-white/10 dark:bg-black/30">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{formatTime(item.estimated_at)}</p>
                <p className="text-xs text-black/50 dark:text-white/50">
                  +{Math.round(item.eta_offset_seconds / 60)} min ·{" "}
                  {item.distance_from_start_km.toFixed(1)} km
                </p>
              </div>
              <p className="text-xs text-black/60 dark:text-white/50">
                {item.location.city?.trim() || "Cidade não identificada"}
              </p>
              <div className="mt-2 grid gap-1 text-sm">
                <p>
                  <span className="text-black/50 dark:text-white/50">Temp. </span>
                  {item.weather.temperature_c != null
                    ? `${item.weather.temperature_c.toFixed(1)} °C`
                    : "—"}
                </p>
                <p>
                  <span className="text-black/50 dark:text-white/50">Chuva </span>
                  {item.weather.rain_probability != null
                    ? `${Math.round(item.weather.rain_probability * 100)}%`
                    : "—"}
                </p>
                <p>
                  <span className="text-black/50 dark:text-white/50">Condição </span>
                  {item.weather.condition ?? "—"}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
