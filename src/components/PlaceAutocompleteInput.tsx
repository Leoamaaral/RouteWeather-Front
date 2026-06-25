"use client";

import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white shadow-inner shadow-black/20 transition outline-none placeholder:text-white/35 focus:border-blue-400/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-blue-500/25";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** When true, wraps input with Google Places Autocomplete */
  mapsReady: boolean;
  placeholder?: string;
};

export function PlaceAutocompleteInput({
  id,
  label,
  value,
  onChange,
  disabled,
  mapsReady,
  placeholder = "Digite ou escolha um endereço",
}: Props) {
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);

  function handlePlaceChanged() {
    const ac = acRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    const text =
      place.formatted_address?.trim() ||
      place.name?.trim() ||
      place.vicinity?.trim();
    if (text) onChange(text);
  }

  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-white/80" htmlFor={id}>
        {label}
      </label>
      {!mapsReady ? (
        <input
          id={id}
          type="text"
          className={inputClassName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          required
          autoComplete="off"
        />
      ) : (
        <Autocomplete
          onLoad={(a) => {
            acRef.current = a;
          }}
          onUnmount={() => {
            acRef.current = null;
          }}
          onPlaceChanged={handlePlaceChanged}
          options={{
            componentRestrictions: { country: "br" },
            fields: ["formatted_address", "name", "vicinity", "geometry"],
          }}
        >
          <input
            id={id}
            type="text"
            className={inputClassName}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            required
            autoComplete="off"
          />
        </Autocomplete>
      )}
    </div>
  );
}
