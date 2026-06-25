"use client";

import { useState } from "react";
import { planRouteWeather } from "@/lib/api";
import type { RoutePlanResponse } from "@/lib/types";
import { AlertsPanel } from "./AlertsPanel";
import { DepartureComparison } from "./DepartureComparison";
import { FollowTripButton } from "./FollowTripButton";
import { RouteMap } from "./RouteMap";
import { RouteSearchForm } from "./RouteSearchForm";
import { WeatherTimeline } from "./WeatherTimeline";

type LastRoute = {
  origin: string;
  destination: string;
  sampleKm: number;
  useTraffic: boolean;
};

export function RouteWeatherDashboard() {
  const [data, setData] = useState<RoutePlanResponse | null>(null);
  const [lastRoute, setLastRoute] = useState<LastRoute | null>(null);
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
      setLastRoute({
        origin: values.origin,
        destination: values.destination,
        sampleKm: values.sampleKm,
        useTraffic: values.useTraffic,
      });
    } catch (e) {
      setData(null);
      setLastRoute(null);
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Sticky brand bar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30 animate-pulse-glow">
              <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Route<span className="text-blue-400">Weather</span>
            </span>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/55 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/70" />
            Powered by Google Directions · Tomorrow.io
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Hero */}
        <section className="mb-12 animate-rise [animation-delay:60ms] opacity-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-blue-300">
            Inteligência de rota
          </p>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Clima ao longo da sua rota,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent">
              ponto a ponto no tempo
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-white/55">
            Informe origem e destino. Amostramos a polyline da rota, estimamos o ETA
            de cada ponto e cruzamos com a previsão da Tomorrow.io — para você sair
            na hora certa.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(300px,400px)_minmax(0,1fr)] lg:gap-10">
          <div className="animate-rise [animation-delay:140ms] opacity-0">
            <RouteSearchForm loading={loading} onSubmit={handleSearch} />
          </div>

          <section
            className="flex min-h-[360px] flex-col gap-6 animate-rise [animation-delay:220ms] opacity-0"
            aria-label="Resultados"
          >
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100 animate-rise">
                <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {!data && !error && !loading && (
              <div className="glass flex flex-1 flex-col items-center justify-center rounded-3xl px-6 py-20 text-center">
                <span className="mb-5 grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <svg viewBox="0 0 24 24" className="size-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="6" cy="19" r="3" />
                    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                    <circle cx="18" cy="5" r="3" />
                  </svg>
                </span>
                <p className="max-w-sm text-sm leading-relaxed text-white/50">
                  Preencha origem e destino e clique em{" "}
                  <span className="font-medium text-white/80">Planejar rota e clima</span>.
                  O mapa, o score de risco e a linha do tempo aparecem aqui.
                </p>
              </div>
            )}

            {loading && !data && (
              <div className="glass flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl py-24">
                <span className="relative grid size-12 place-items-center">
                  <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />
                  <span className="size-2 rounded-full bg-blue-400" />
                </span>
                <p className="text-sm text-white/55">Calculando rota e clima…</p>
              </div>
            )}

            {data && (
              <>
                <div className="glass-solid rounded-2xl p-5 animate-rise has-[button[aria-expanded=true]]:relative has-[button[aria-expanded=true]]:z-30">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold tracking-tight">{data.route.summary}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/70">
                          <span className="text-blue-400">◆</span>
                          {(data.route.total_distance_m / 1000).toFixed(1)} km
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/70">
                          <span className="text-blue-400">◷</span>
                          {Math.round(data.route.total_duration_s / 60)} min
                        </span>
                      </div>
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
                <div className="glass-solid overflow-hidden rounded-2xl animate-rise [animation-delay:80ms] opacity-0">
                  <RouteMap encodedPath={data.route.polyline} />
                </div>
                <div className="animate-rise [animation-delay:160ms] opacity-0">
                  <AlertsPanel
                    score={data.risk.score}
                    summary={data.risk.summary}
                    alerts={data.risk.alerts}
                    warnings={data.meta.warnings}
                  />
                </div>
                <div className="animate-rise [animation-delay:240ms] opacity-0">
                  <WeatherTimeline items={data.timeline} />
                </div>
                {lastRoute && (
                  <div className="animate-rise [animation-delay:320ms] opacity-0">
                    <DepartureComparison
                      origin={lastRoute.origin}
                      destination={lastRoute.destination}
                      sampleKm={lastRoute.sampleKm}
                      useTraffic={lastRoute.useTraffic}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <footer className="mt-16 border-t border-white/8 pt-6 text-center text-xs text-white/35">
          RouteWeather · planeje com confiança
        </footer>
      </div>
    </div>
  );
}
