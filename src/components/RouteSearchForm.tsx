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
    "rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm transition outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/25 dark:border-white/15 dark:bg-black dark:focus:border-blue-400/50 dark:focus:ring-blue-400/20";

  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-md shadow-black/5 backdrop-blur-md dark:border-white/10 dark:bg-black/45 dark:shadow-black/40"
      >
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Planejamento
          </h2>
          <p className="mt-1 text-sm text-black/55 dark:text-white/50">
            Origem e destino com sugestões do Google Places (Brasil).
          </p>
        </div>

        <div className="h-px bg-black/8 dark:bg-white/10" />

        <div className="grid gap-4">
          <PlaceAutocompleteInput
            id="origin"
            label="Origem"
            value={origin}
            onChange={setOrigin}
            disabled={loading}
            mapsReady={mapsReady}
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
          <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-950 dark:text-amber-100">
            Sem <code className="rounded bg-black/5 px-1 dark:bg-white/10">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
            : autocomplete desativado; o mapa também não carrega.
          </p>
        )}

        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="grid min-w-0 gap-1.5">
            <label className="text-sm font-medium text-black/80 dark:text-white/85" htmlFor="departure">
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
            <label className="text-sm font-medium text-black/80 dark:text-white/85" htmlFor="sample">
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

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/6 bg-black/[0.02] px-3 py-3 text-sm dark:border-white/8 dark:bg-white/[0.03]">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-black/20 text-blue-600 focus:ring-blue-500 dark:border-white/30"
            checked={useTraffic}
            onChange={(e) => setUseTraffic(e.target.checked)}
            disabled={loading}
          />
          <span className="text-black/75 dark:text-white/70">
            Usar tráfego no Google (quando disponível)
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {loading ? "Calculando rota…" : "Planejar rota e clima"}
        </button>
      </form>
    </aside>
  );
}
