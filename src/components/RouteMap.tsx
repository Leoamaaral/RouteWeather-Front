"use client";

import polyline from "@mapbox/polyline";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const mapContainerStyle = { width: "100%", height: "min(55vh, 520px)" };

const polylineOptions: google.maps.PolylineOptions = {
  strokeColor: "#2563eb",
  strokeOpacity: 0.95,
  strokeWeight: 5,
};

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
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-amber-500/60 bg-amber-500/10 p-6 text-sm text-amber-900 dark:text-amber-100">
        Defina <code className="mx-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> no ambiente
        para visualizar o mapa.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-100">
        Não foi possível carregar o Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-black/10 bg-black/5 text-sm dark:border-white/10">
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
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    />
  );
}
