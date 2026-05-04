"use client";

import { useState } from "react";
import { planRouteWeather } from "@/lib/api";
import type { RoutePlanResponse } from "@/lib/types";
import { AlertsPanel } from "./AlertsPanel";
import { FollowTripButton } from "./FollowTripButton";
import { RouteMap } from "./RouteMap";
import { RouteSearchForm } from "./RouteSearchForm";
import { WeatherTimeline } from "./WeatherTimeline";

export function RouteWeatherDashboard() {
  const [data, setData] = useState<RoutePlanResponse | null>(null);
  const [lastRoute, setLastRoute] = useState<{ origin: string; destination: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(values: {
    origin: string;
    destination: string;
    departureAt: string;
    sampleKm: number;
    useTraffic: boolean;
  }) {
    setLoading(true);
    setError(null);
    try {
      const payload: Parameters<typeof planRouteWeather>[0] = {
        origin: values.origin,
        destination: values.destination,
        sample_interval_km: values.sampleKm,
        use_traffic: values.useTraffic,
      };
      if (values.departureAt) {
        payload.departure_at = new Date(values.departureAt).toISOString();
      }
      const response = await planRouteWeather(payload);
      setData(response);
      setLastRoute({ origin: values.origin, destination: values.destination });
    } catch (e) {
      setData(null);
      setLastRoute(null);
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/80 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-10 border-b border-black/6 pb-8 dark:border-white/10">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            RouteWeather
          </p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Rota + clima ao longo do tempo de viagem
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-black/65 dark:text-white/60">
            Informe origem e destino. O backend consulta o Google Directions, amostra
            a polyline, estima ETA por ponto e cruza com a Tomorrow.io.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[400px_minmax(0,1fr)]">
          <RouteSearchForm loading={loading} onSubmit={handleSearch} />

          <section className="flex min-h-[320px] flex-col gap-6" aria-label="Resultados">
            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-900 dark:text-red-50">
                {error}
              </div>
            )}

            {!data && !error && !loading && (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-black/12 bg-white/50 px-6 py-16 text-center dark:border-white/12 dark:bg-black/25">
                <p className="max-w-sm text-sm text-black/55 dark:text-white/50">
                  Preencha origem e destino à esquerda e clique em{" "}
                  <span className="font-medium text-black/75 dark:text-white/70">
                    Planejar rota e clima
                  </span>
                  . O mapa, o score de risco e a linha do tempo aparecem aqui.
                </p>
              </div>
            )}

            {loading && !data && (
              <div className="flex flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white/60 py-20 text-sm text-black/50 dark:border-white/10 dark:bg-black/30 dark:text-white/45">
                Calculando rota e clima…
              </div>
            )}

            {data && (
              <>
                <div className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-black/40">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold tracking-tight">{data.route.summary}</p>
                      <p className="mt-1 text-sm text-black/55 dark:text-white/50">
                        {(data.route.total_distance_m / 1000).toFixed(1)} km ·{" "}
                        {Math.round(data.route.total_duration_s / 60)} min estimados
                      </p>
                    </div>
                    {lastRoute && (
                      <FollowTripButton
                        origin={lastRoute.origin}
                        destination={lastRoute.destination}
                        destinationHint={
                          data.timeline.length > 0
                            ? [...data.timeline].sort(
                                (a, b) => b.distance_from_start_km - a.distance_from_start_km,
                              )[0]!.location
                            : null
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-md dark:border-white/10 dark:bg-black/35">
                  <RouteMap encodedPath={data.route.polyline} />
                </div>
                <AlertsPanel
                  score={data.risk.score}
                  summary={data.risk.summary}
                  alerts={data.risk.alerts}
                />
                <WeatherTimeline items={data.timeline} />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
