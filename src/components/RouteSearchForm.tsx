"use client";

import { FormEvent, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { PlaceAutocompleteInput } from "./PlaceAutocompleteInput";

type Props = {
  loading: boolean;
  onSubmit: (values: {
    origin: string;
    destination: string;
    departureAt: string;
    sampleKm: number;
    useTraffic: boolean;
  }) => void;
};

export function RouteSearchForm({ loading, onSubmit }: Props) {
  const [origin, setOrigin] = useState("São Paulo, SP");
  const [destination, setDestination] = useState("Rio de Janeiro, RJ");
  const [departureAt, setDepartureAt] = useState("");
  const [sampleKm, setSampleKm] = useState(25);
  const [useTraffic, setUseTraffic] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "route-weather-google",
    googleMapsApiKey: apiKey,
    libraries: ["maps", "places"],
    language: "pt-BR",
    region: "BR",
  });

  const mapsReady = Boolean(apiKey && isLoaded && !loadError);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ origin, destination, departureAt, sampleKm, useTraffic });
  }

  const fieldClass =
    "rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white shadow-inner shadow-black/20 transition outline-none focus:border-blue-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-blue-500/25 [color-scheme:dark]";

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <form
        onSubmit={handleSubmit}
        className="glass flex flex-col gap-5 rounded-3xl p-6"
      >
        <div>
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-300">
            <span className="size-1.5 rounded-full bg-blue-400 shadow-[0_0_8px] shadow-blue-400/70" />
            Planejamento
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Origem e destino com sugestões do Google Places (Brasil).
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        <div className="grid gap-4">
          <PlaceAutocompleteInput
            id="origin"
            label="Origem"
            value={origin}
            onChange={setOrigin}
            disabled={loading}
            mapsReady={mapsReady}
            showCurrentLocationButton
          />
          <PlaceAutocompleteInput
            id="destination"
            label="Destino"
            value={destination}
            onChange={setDestination}
            disabled={loading}
            mapsReady={mapsReady}
          />
        </div>

        {!apiKey && (
          <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100">
            Sem{" "}
            <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>:
            autocomplete desativado; o mapa também não carrega.
          </p>
        )}

        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="grid min-w-0 gap-1.5">
            <label className="text-sm font-medium text-white/80" htmlFor="departure">
              Partida (opcional)
            </label>
            <input
              id="departure"
              type="datetime-local"
              className={`${fieldClass} min-w-0 w-full max-w-full`}
              value={departureAt}
              onChange={(e) => setDepartureAt(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid min-w-0 gap-1.5">
            <label className="text-sm font-medium text-white/80" htmlFor="sample">
              Amostragem (km)
            </label>
            <input
              id="sample"
              type="number"
              min={1}
              max={250}
              className={`${fieldClass} min-w-0 w-full max-w-full`}
              value={sampleKm}
              onChange={(e) => setSampleKm(Number(e.target.value))}
              disabled={loading}
            />
          </div>
        </div>

        <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 text-sm transition hover:border-blue-400/30 hover:bg-blue-500/[0.06]">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-white/30 bg-transparent text-blue-500 accent-blue-500 focus:ring-blue-500"
            checked={useTraffic}
            onChange={(e) => setUseTraffic(e.target.checked)}
            disabled={loading}
          />
          <span className="text-white/70 transition group-hover:text-white/90">
            Usar tráfego no Google (quando disponível)
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="group relative mt-1 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Calculando rota…
              </>
            ) : (
              <>
                Planejar rota e clima
                <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </span>
        </button>
      </form>
    </aside>
  );
}
