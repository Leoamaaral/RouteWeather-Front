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
        className="rounded-xl border border-blue-600/25 bg-blue-600/10 px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-600/15 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-200 dark:hover:bg-blue-500/25"
      >
        Seguir viagem
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 min-w-[220px] rounded-xl border border-black/10 bg-white p-2 shadow-lg dark:border-white/12 dark:bg-neutral-900"
        >
          <a
            role="menuitem"
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={`${linkClass} text-blue-700 hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-white/10`}
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
            className={`${linkClass} text-sky-800 hover:bg-sky-50 dark:text-sky-200 dark:hover:bg-white/10`}
          >
            Waze
          </a>
          <p className="mt-1 border-t border-black/6 px-2 pt-2 text-[11px] leading-snug text-black/50 dark:border-white/10 dark:text-white/45">
            Google Maps abre a rota origem → destino. No Waze, só o destino é fixo; a origem é a
            posição atual (limite do app).
          </p>
        </div>
      )}
    </div>
  );
}
