"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { DivIcon } from "leaflet";

export interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  title: string;
  address: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapProps {
  markers: MapMarker[];
  center?: LatLng | null;
  zoom?: number | null;
  /** CSS height for the map container. */
  height?: string;
  className?: string;
  onMarkerClick?: (markerId: number) => void;
  selectedMarkerId?: number | null;
}

/** Damascus, used when no markers and no explicit centre are supplied. */
const DEFAULT_CENTER: LatLng = { lat: 33.5138, lng: 36.2765 };

/**
 * Leaflet is loaded lazily because it touches `window` at import time. The
 * module is cached at module scope so it is only ever fetched once.
 */
let leafletModule: typeof import("leaflet") | null = null;
let leafletLoader: Promise<typeof import("leaflet")> | null = null;

function loadLeaflet(): Promise<typeof import("leaflet")> {
  leafletLoader ??= import("leaflet").then((mod) => {
    const L = mod.default ?? mod;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
    leafletModule = L;
    return L;
  });
  return leafletLoader;
}

function createMarkerIcon(isSelected: boolean): DivIcon | undefined {
  if (!leafletModule) return undefined;

  return leafletModule.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${isSelected ? "#dc2626" : "#111827"};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

/** Pans the map when the selected marker changes. */
function MapController({
  center,
  zoom,
  selectedMarkerId,
  markers,
}: Required<Pick<MapProps, "center" | "zoom" | "markers">> & {
  selectedMarkerId: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    const selected =
      selectedMarkerId === null
        ? undefined
        : markers.find((marker) => marker.id === selectedMarkerId);
    const target = selected ?? center;
    if (!target) return;
    map.setView([target.lat, target.lng], zoom ?? map.getZoom(), { animate: true, duration: 0.5 });
  }, [map, center, zoom, selectedMarkerId, markers]);

  return null;
}

/** Store locator map. Rendered client-side only (`ssr: false` at the import). */
export default function Map({
  markers,
  center = null,
  zoom = null,
  height = "100%",
  className = "",
  onMarkerClick,
  selectedMarkerId = null,
}: MapProps) {
  const [isLeafletReady, setIsLeafletReady] = useState(leafletModule !== null);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then(() => {
        if (!cancelled) setIsLeafletReady(true);
      })
      .catch(() => {
        // Custom pins are cosmetic; Leaflet's own defaults still render.
        if (!cancelled) setIsLeafletReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const validMarkers = useMemo(
    () => markers.filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng)),
    [markers]
  );

  const resolvedCenter = useMemo<LatLng>(() => {
    if (center && Number.isFinite(center.lat) && Number.isFinite(center.lng)) {
      return center;
    }
    if (validMarkers.length === 0) return DEFAULT_CENTER;
    return {
      lat: validMarkers.reduce((sum, m) => sum + m.lat, 0) / validMarkers.length,
      lng: validMarkers.reduce((sum, m) => sum + m.lng, 0) / validMarkers.length,
    };
  }, [center, validMarkers]);

  const resolvedZoom = useMemo(() => {
    if (zoom !== null) return zoom;
    if (validMarkers.length <= 1) return 13;
    return 5;
  }, [zoom, validMarkers.length]);

  if (validMarkers.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-sunken ${className}`}
        style={{ height }}
      >
        <p className="text-muted">No locations to display</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <MapContainer
        center={[resolvedCenter.lat, resolvedCenter.lng]}
        zoom={resolvedZoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          center={resolvedCenter}
          zoom={resolvedZoom}
          selectedMarkerId={selectedMarkerId}
          markers={validMarkers}
        />

        {validMarkers.map((marker) => {
          const icon = isLeafletReady ? createMarkerIcon(selectedMarkerId === marker.id) : undefined;
          return (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              {...(icon ? { icon } : {})}
              eventHandlers={{ click: () => onMarkerClick?.(marker.id) }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">{marker.title}</h3>
                  <p className="text-xs text-muted">{marker.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
