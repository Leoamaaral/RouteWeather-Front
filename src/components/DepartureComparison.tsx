"use client";

import { useState } from "react";
import { compareRouteWeather } from "@/lib/api";
import type { CompareResponse } from "@/lib/types";

type Props = {
  origin: string;
  destination: string;
  sampleKm: number;
  useTraffic: boolean;
};

const MAX_WINDOWS = 6;

function defaultWindow(hoursFromNow: number): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + hoursFromNow);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

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

function scoreTone(score: number) {
  if (score >= 66) return "text-red-300";
  if (score >= 33) return "text-amber-300";
  return "text-emerald-300";
}

export function DepartureComparison({ origin, destination, sampleKm, useTraffic }: Props) {
  const [windows, setWindows] = useState<string[]>([
    defaultWindow(1),
    defaultWindow(4),
  ]);
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fieldClass =
    "rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white shadow-inner shadow-black/20 transition outline-none focus:border-blue-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-blue-500/25 [color-scheme:dark]";

  function updateWindow(index: number, value: string) {
    setWindows((prev) => prev.map((w, i) => (i === index ? value : w)));
  }

  function addWindow() {
    setWindows((prev) =>
      prev.length >= MAX_WINDOWS ? prev : [...prev, defaultWindow(prev.length + 2)],
    );
  }

  function removeWindow(index: number) {
    setWindows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleCompare() {
    const filled = windows.filter((w) => w.trim().length > 0);
    if (filled.length === 0) {
      setError("Informe pelo menos um horário de partida.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await compareRouteWeather({
        origin,
        destination,
        departure_windows: filled.map((w) => new Date(w).toISOString()),
        sample_interval_km: sampleKm,
        use_traffic: useTraffic,
      });
      setResult(response);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  const bestDeparture = result?.best?.departure_at ?? null;

  return (
    <section className="glass grid gap-5 rounded-2xl p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Comparar horários de partida</h2>
          <p className="mt-1 text-sm text-white/50">
            Veja qual janela tem o menor risco para {origin} → {destination}.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/55">
          até {MAX_WINDOWS} horários
        </span>
      </header>

      <div className="grid gap-2.5">
        {windows.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="datetime-local"
              className={`${fieldClass} min-w-0 flex-1`}
              value={value}
              onChange={(e) => updateWindow(index, e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => removeWindow(index)}
              disabled={loading || windows.length <= 1}
              aria-label="Remover horário"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/50 transition hover:border-red-400/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addWindow}
          disabled={loading || windows.length >= MAX_WINDOWS}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70 transition hover:border-blue-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Adicionar horário
        </button>
        <button
          type="button"
          onClick={handleCompare}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Comparando…
            </>
          ) : (
            "Comparar horários"
          )}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-100">
          {error}
        </p>
      )}

      {result && (
        <div className="grid gap-3">
          <p className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2.5 text-sm leading-relaxed text-blue-100">
            {result.recommendation}
          </p>
          <ol className="grid gap-2">
            {result.options.map((option) => {
              const isBest = option.departure_at === bestDeparture;
              return (
                <li
                  key={option.departure_at}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    isBest
                      ? "border-emerald-400/40 bg-emerald-500/10"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-medium text-white/90">
                      {formatTime(option.departure_at)}
                      {isBest && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                          melhor
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-white/50">
                      chega ~{formatTime(option.arrival_at)} ·{" "}
                      {Math.round(option.route.total_duration_s / 60)} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold tabular-nums ${scoreTone(option.risk.score)}`}>
                      {option.risk.score}
                    </p>
                    <p className="text-[11px] text-white/45">
                      {option.risk.alerts_count} alerta(s)
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
