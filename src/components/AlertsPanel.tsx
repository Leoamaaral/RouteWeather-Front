"use client";

import type { RiskAlert } from "@/lib/types";

type Props = {
  score: number;
  summary: string;
  alerts: RiskAlert[];
  warnings?: string[];
};

const severityStyles: Record<string, string> = {
  critical: "border-red-500/40 bg-red-500/10 text-red-100",
  high: "border-orange-500/40 bg-orange-500/10 text-orange-100",
  low: "border-blue-500/40 bg-blue-500/10 text-blue-100",
};

const severityDot: Record<string, string> = {
  critical: "bg-red-400 shadow-red-400/70",
  high: "bg-orange-400 shadow-orange-400/70",
  low: "bg-blue-400 shadow-blue-400/70",
};

function scoreTone(score: number) {
  if (score >= 66) return { label: "Alto risco", text: "text-red-300" };
  if (score >= 33) return { label: "Atenção", text: "text-amber-300" };
  return { label: "Tranquilo", text: "text-emerald-300" };
}

export function AlertsPanel({ score, summary, alerts, warnings }: Props) {
  const bar = Math.min(100, Math.max(0, score));
  const tone = scoreTone(bar);

  return (
    <section className="glass grid gap-5 rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-white/45">
            Score de risco
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-4xl font-bold tracking-tight tabular-nums">{score}</p>
            <span className={`text-sm font-medium ${tone.text}`}>{tone.label}</span>
          </div>
        </div>
        <div className="flex w-full max-w-[200px] flex-col gap-1.5">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 transition-[width] duration-700 ease-out"
              style={{ width: `${bar}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/35">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-white/75">{summary}</p>
      {warnings && warnings.length > 0 && (
        <ul className="grid gap-1.5">
          {warnings.map((warning) => (
            <li
              key={warning}
              className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100"
            >
              <span className="mt-0.5 text-amber-300">⚠</span>
              <span>{warning}</span>
            </li>
          ))}
        </ul>
      )}
      {alerts.length > 0 && (
        <div className="grid gap-2.5">
          <h3 className="text-sm font-semibold text-white/90">Alertas</h3>
          <ul className="grid gap-2">
            {alerts.map((alert) => (
              <li
                key={`${alert.type}-${alert.segment}-${alert.order}`}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition hover:translate-x-0.5 ${
                  severityStyles[alert.severity] ??
                  "border-white/10 bg-white/5 text-white/80"
                }`}
              >
                <span
                  className={`size-2 shrink-0 rounded-full shadow-[0_0_8px] ${
                    severityDot[alert.severity] ?? "bg-white/40 shadow-white/30"
                  }`}
                />
                <span className="font-medium">{alert.label}</span>
                <span className="text-white/50">· trecho: {alert.segment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
