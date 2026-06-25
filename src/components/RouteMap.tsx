"use client";

import polyline from "@mapbox/polyline";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const mapContainerStyle = { width: "100%", height: "min(55vh, 520px)" };

const polylineOptions: google.maps.PolylineOptions = {
  strokeColor: "#3b82f6",
  strokeOpacity: 0.95,
  strokeWeight: 5,
};

// Dark "tech" map theme to match the premium dark UI.
const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0f1115" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9aa0a6" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a2f3a" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#c0c6cf" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#23262d" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1c22" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#33373f" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a909a" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0a0d12" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3b82f6" }] },
];

type Props = {
  encodedPath: string;
};

export function RouteMap({ encodedPath }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const routePolylineRef = useRef<google.maps.Polyline | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "route-weather-google",
    googleMapsApiKey: apiKey,
    libraries: ["maps", "places"],
    language: "pt-BR",
    region: "BR",
  });

  const path = useMemo(() => {
    if (!encodedPath) return [];
    const pairs = polyline.decode(encodedPath) as [number, number][];
    return pairs.map(([lat, lng]) => ({ lat, lng }));
  }, [encodedPath]);

  const center = path[0] ?? { lat: -14.235, lng: -51.9253 };

  const onLoad = useCallback((instance: google.maps.Map) => {
    setMap(instance);
  }, []);

  const onUnmount = useCallback(() => {
    routePolylineRef.current?.setMap(null);
    routePolylineRef.current = null;
    setMap(null);
  }, []);

  useEffect(() => {
    routePolylineRef.current?.setMap(null);
    routePolylineRef.current = null;

    if (!map || path.length < 2) return;

    const line = new google.maps.Polyline({
      ...polylineOptions,
      map,
      path,
    });
    routePolylineRef.current = line;

    const bounds = new google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 48);

    return () => {
      line.setMap(null);
      if (routePolylineRef.current === line) {
        routePolylineRef.current = null;
      }
    };
  }, [map, path]);

  if (!apiKey) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-amber-500/50 bg-amber-500/10 p-6 text-sm text-amber-100">
        Defina <code className="mx-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> no ambiente
        para visualizar o mapa.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
        Não foi possível carregar o Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[320px] items-center justify-center gap-3 bg-white/[0.02] text-sm text-white/50">
        <span className="size-4 animate-spin rounded-full border-2 border-white/15 border-t-blue-400" />
        Carregando mapa…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        styles: darkMapStyles,
        backgroundColor: "#0f1115",
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    />
  );
}
