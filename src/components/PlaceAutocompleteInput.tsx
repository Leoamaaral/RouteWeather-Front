"use client";

import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";

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
  /** Shows a button to fill the field with the user's current location */
  showCurrentLocationButton?: boolean;
};

function geolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Permissão de localização negada.";
    case 2:
      return "Localização indisponível.";
    case 3:
      return "Tempo esgotado ao obter a localização.";
    default:
      return "Não foi possível obter a localização.";
  }
}

export function PlaceAutocompleteInput({
  id,
  label,
  value,
  onChange,
  disabled,
  mapsReady,
  placeholder = "Digite ou escolha um endereço",
  showCurrentLocationButton = false,
}: Props) {
  const acRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const inputWithActionClass = showCurrentLocationButton
    ? `${inputClassName} pr-11`
    : inputClassName;

  function reverseGeocode(lat: number, lng: number) {
    if (mapsReady && window.google?.maps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setLocating(false);
        if (status === "OK" && results?.[0]?.formatted_address) {
          onChange(results[0].formatted_address);
          return;
        }
        onChange(`${lat},${lng}`);
      });
      return;
    }

    setLocating(false);
    onChange(`${lat},${lng}`);
  }

  function handleUseCurrentLocation() {
    if (disabled || locating) return;

    if (!navigator.geolocation) {
      setLocationError("Geolocalização não suportada neste navegador.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        reverseGeocode(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLocating(false);
        setLocationError(geolocationErrorMessage(err.code));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

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
      <div className="relative">
        {!mapsReady ? (
          <input
            id={id}
            type="text"
            className={inputWithActionClass}
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
              className={inputWithActionClass}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              required
              autoComplete="off"
            />
          </Autocomplete>
        )}

        {showCurrentLocationButton && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={disabled || locating}
            title="Usar minha localização atual"
            aria-label="Usar minha localização atual"
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {locating ? (
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-blue-300" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {locationError && (
        <p className="text-xs text-amber-200/90" role="alert">
          {locationError}
        </p>
      )}
    </div>
  );
}
