"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Tables } from "@/lib/database.types";

type Dog = Tables<"dogs">;

interface DogMapProps {
  dogs: Dog[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

const PAW_ICON_GREEN = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#16a34a" stroke="#fff" stroke-width="2"/><text x="18" y="24" text-anchor="middle" font-size="18">🐾</text></svg>'
)}`;

const PAW_ICON_ORANGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#d97740" stroke="#fff" stroke-width="2"/><text x="18" y="24" text-anchor="middle" font-size="18">🐾</text></svg>'
)}`;

const PAW_ICON_RED = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="#dc2626" stroke="#fff" stroke-width="2"/><text x="18" y="24" text-anchor="middle" font-size="18">🐾</text></svg>'
)}`;

function iconForDog(dog: Dog) {
  const url = dog.report_type === "sos" ? PAW_ICON_RED : dog.is_vaccinated ? PAW_ICON_GREEN : PAW_ICON_ORANGE;
  return L.icon({ iconUrl: url, iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16] });
}

export function DogMap({ dogs, center = [30.427755, -9.598107], zoom = 12, onMapClick, className }: DogMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false }).setView(center, zoom);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    if (onMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) => onMapClick(e.latlng.lat, e.latlng.lng));
    }

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    dogs.forEach((dog) => {
      if (!dog.latitude || !dog.longitude) return;
      const marker = L.marker([dog.latitude, dog.longitude], { icon: iconForDog(dog) });
      marker.bindPopup(
        `<div style="min-width:140px">
          <strong>${dog.name}</strong><br/>
          <span style="font-size:12px;color:#666">${dog.location ?? ""}</span><br/>
          ${dog.ear_tag ? `<span style="font-size:11px;background:#f3f4f6;padding:1px 4px;border-radius:3px">${dog.ear_tag}</span>` : ""}
        </div>`
      );
      marker.addTo(map);
    });
  }, [dogs]);

  return <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-xl"} />;
}
