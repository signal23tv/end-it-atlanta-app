"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapsUrl, telHref } from "@/lib/resources-data";

export type MapPin = {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
};

// Custom pin instead of Leaflet's default marker image, which needs
// asset-path config to survive bundling. A plain inline SVG sidesteps
// that entirely and matches the site's red/gold palette.
const pinIcon = L.divIcon({
  className: "",
  html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0Z" fill="#e5161c"/>
    <circle cx="15" cy="15" r="6" fill="#fbf8f1"/>
  </svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -36],
});

/**
 * Real interactive multi-pin map -- OpenStreetMap tiles via Leaflet,
 * no API key needed or configured. Coordinates were geocoded once
 * from each location's real address (see resources-data.ts) and are
 * not estimates or fabricated positions.
 */
export default function ClinicMap({ pins }: { pins: MapPin[] }) {
  if (pins.length === 0) return null;

  const center: [number, number] =
    pins.length === 1
      ? [pins[0].lat, pins[0].lng]
      : [
          pins.reduce((s, p) => s + p.lat, 0) / pins.length,
          pins.reduce((s, p) => s + p.lng, 0) / pins.length,
        ];

  return (
    <div className="rounded-xl overflow-hidden border border-black/10 mb-8 h-80">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{p.name}</p>
                <p>{p.address}</p>
                <div className="flex gap-2 mt-2">
                  <a href={telHref(p.phone)} className="text-red font-semibold">
                    Call
                  </a>
                  <a
                    href={mapsUrl(p.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red font-semibold"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
