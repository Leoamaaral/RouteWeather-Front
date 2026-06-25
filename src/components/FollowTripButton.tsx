"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  origin: string;
  destination: string;
  /** Último ponto da rota para desambiguar o destino no Waze (lat,lng). */
  destinationHint?: { lat: number; lng: number } | null;
};

function googleMapsDirUrl(origin: string, destination: string) {
  const p = new URLSearchParams({
    api: "1",
    origin,
    destination,
    travelmode: "driving",
  });
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

function wazeNavigateUrl(
  destination: string,
  destinationHint?: { lat: number; lng: number } | null,
) {
  const p = new URLSearchParams({ navigate: "yes", q: destination });
  if (destinationHint) {
    p.set("ll", `${destinationHint.lat},${destinationHint.lng}`);
  }
  return `https://waze.com/ul?${p.toString()}`;
}

export function FollowTripButton({ origin, destination, destinationHint }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const trimmedOrigin = origin.trim();
  const trimmedDest = destination.trim();
  const canOpen = trimmedOrigin.length > 0 && trimmedDest.length > 0;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  if (!canOpen) return null;

  const googleUrl = googleMapsDirUrl(trimmedOrigin, trimmedDest);
  const wazeUrl = wazeNavigateUrl(trimmedDest, destinationHint);

  const linkClass =
    "flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition";

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/15 px-4 py-2.5 text-sm font-semibold text-blue-200 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-500/25 hover:shadow-lg hover:shadow-blue-500/20"
      >
        Seguir viagem
        <svg
          viewBox="0 0 24 24"
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="glass-solid absolute right-0 z-20 mt-2 min-w-[230px] rounded-xl p-2 animate-rise"
        >
          <a
            role="menuitem"
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={`${linkClass} text-blue-200 hover:bg-blue-500/15`}
          >
            Google Maps
          </a>
          <a
            role="menuitem"
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="No Waze a partida é sempre a sua localização atual; o destino vem preenchido."
            onClick={() => setOpen(false)}
            className={`${linkClass} text-sky-200 hover:bg-sky-500/15`}
          >
            Waze
          </a>
          <p className="mt-1 border-t border-white/10 px-2 pt-2 text-[11px] leading-snug text-white/45">
            Google Maps abre a rota origem → destino. No Waze, só o destino é fixo; a origem é a
            posição atual (limite do app).
          </p>
        </div>
      )}
    </div>
  );
}
