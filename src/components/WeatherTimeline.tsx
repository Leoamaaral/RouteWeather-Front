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
    <section className="glass rounded-2xl p-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Linha do tempo climática</h2>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/55">
          {items.length} pontos
        </span>
      </header>
      <ol className="relative space-y-4 border-l border-white/10 pl-6">
        {items.map((item, idx) => (
          <li
            key={item.order}
            className="relative animate-rise opacity-0"
            style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
          >
            <span className="absolute -left-[31px] top-1.5 size-3.5 rounded-full border-2 border-blue-400 bg-black shadow-[0_0_10px] shadow-blue-500/50" />
            <div className="group rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm transition hover:border-blue-400/30 hover:bg-white/[0.04]">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-white/90">{formatTime(item.estimated_at)}</p>
                <p className="text-xs text-white/45 tabular-nums">
                  +{Math.round(item.eta_offset_seconds / 60)} min ·{" "}
                  {item.distance_from_start_km.toFixed(1)} km
                </p>
              </div>
              <p className="mt-0.5 text-xs text-white/55">
                {item.location.city?.trim() || "Cidade não identificada"}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
         
                <Metric
                  label="Temp."
                  value={
                    item.weather.temperature_c != null
                      ? `${item.weather.temperature_c.toFixed(1)}°`
                      : "—"
                  }
                />
                <Metric
                  label="Chuva"
                  value={
                    item.weather.rain_probability != null
                      ? `${Math.round(item.weather.rain_probability * 100)}%`
                      : "—"
                  }
                />
                <Metric label="Condição" value={item.weather.condition ?? "—"} />
                <Metric
                  label="Vento"
                  value={
                    item.weather.wind_speed_kmh != null
                      ? `${Math.round(item.weather.wind_speed_kmh)} km/h`
                      : "—"
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-white/85">{value}</p>
    </div>
  );
}
