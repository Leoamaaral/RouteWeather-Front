"use client";

type Alert = {
  type: string;
  label: string;
  severity: string;
  segment: string;
  order: number;
};

type Props = {
  score: number;
  summary: string;
  alerts: Alert[];
};

const severityStyles: Record<string, string> = {
  critical: "border-red-500/60 bg-red-500/10 text-red-900 dark:text-red-50",
  high: "border-orange-500/60 bg-orange-500/10 text-orange-900 dark:text-orange-50",
  low: "border-blue-500/50 bg-blue-500/10 text-blue-900 dark:text-blue-50",
};

export function AlertsPanel({ score, summary, alerts }: Props) {
  const bar = Math.min(100, Math.max(0, score));

  return (
    <section className="grid gap-4 rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-black/50 dark:text-white/50">
            Score de risco
          </p>
          <p className="text-3xl font-bold">{score}</p>
        </div>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600"
            style={{ width: `${bar}%` }}
          />
        </div>
      </div>
      <p className="text-sm leading-relaxed text-black/80 dark:text-white/80">
        {summary}
      </p>
      {alerts.length > 0 && (
        <div className="grid gap-2">
          <h3 className="text-sm font-semibold">Alertas</h3>
          <ul className="grid gap-2">
            {alerts.map((alert) => (
              <li
                key={`${alert.type}-${alert.segment}-${alert.order}`}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  severityStyles[alert.severity] ??
                  "border-black/10 bg-black/5 dark:border-white/10"
                }`}
              >
                <span className="font-medium">{alert.label}</span>
                <span className="text-black/60 dark:text-white/60">
                  {" "}
                  · trecho: {alert.segment}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
