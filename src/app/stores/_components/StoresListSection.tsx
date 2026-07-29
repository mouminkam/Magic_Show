"use client";

import { useState, useMemo } from "react";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Accordion, { type AccordionItem, type AccordionItemId } from "@/components/ui/Accordion";
import type { MapMarker } from "@/components/ui/Map";
import type { Store } from "@/types";
import StoreAccordionItem from "./StoreAccordionItem";

// Dynamic import for Map component (client-side only)
const Map = dynamic(() => import("@/components/ui/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-sunken rounded-lg">
      <p className="text-muted">Loading map...</p>
    </div>
  ),
});

export interface StoresListSectionProps {
  stores?: Store[];
}

/**
 * StoresListSection Component
 * Displays a list of stores with accordion pattern and map view
 */
export default function StoresListSection({ stores = [] }: StoresListSectionProps) {
  const safeStores = Array.isArray(stores) ? stores : [];
  const [selectedStoreId, setSelectedStoreId] = useState<AccordionItemId | null>(
    safeStores[0]?.id ?? null
  );

  // Prepare markers for map (ensure lat/lng are numbers to avoid NaN in Leaflet; skip stores with no coordinates)
  const mapMarkers = useMemo<MapMarker[]>(
    () =>
      safeStores
        .filter((store) => store.lat != null && store.lng != null)
        .map((store) => {
          const lat = Number(store.lat);
          const lng = Number(store.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return {
            id: store.id,
            lat,
            lng,
            title: store.name,
            address: store.address,
          };
        })
        .filter((marker): marker is MapMarker => marker !== null),
    [safeStores]
  );

  // Prepare accordion items
  const accordionItems = useMemo<AccordionItem[]>(
    () =>
      safeStores.map((store) => ({
        id: store.id,
        header: (
          <div>
            <h3 className="font-bold text-lg text-ink mb-1">
              {store.name}
            </h3>
            <p className="text-sm text-muted flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{store.address}</span>
            </p>
          </div>
        ),
        content: <StoreAccordionItem store={store} />,
      })),
    [safeStores]
  );

  if (safeStores.length === 0) return null;

  // Handle accordion change
  const handleAccordionChange = (expandedId: AccordionItemId | null) => {
    setSelectedStoreId(expandedId);
  };

  // Handle marker click
  const handleMarkerClick = (markerId: number) => {
    setSelectedStoreId(markerId);
  };

  return (
    <section id="stores" className="py-16 lg:py-20 bg-sunken">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4">
            Our Stores
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Visit us at one of our locations. We&apos;re here to help you find the
            perfect piece.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Stores Accordion List */}
          <div className="lg:col-span-1 flex flex-col">
            <Accordion
              items={accordionItems}
              defaultExpanded={safeStores[0]?.id ?? null}
              allowMultiple={false}
              onChange={handleAccordionChange}
            />
          </div>

          {/* Map with all markers */}
          <div className="lg:col-span-2 flex-1 min-h-[400px] lg:min-h-[600px]">
            <div className="bg-surface rounded-lg shadow-[var(--shadow-lg)] overflow-hidden h-full">
              {mapMarkers.length > 0 ? (
                <Map
                  markers={mapMarkers}
                  height="100%"
                  selectedMarkerId={
                    typeof selectedStoreId === "number" ? selectedStoreId : null
                  }
                  onMarkerClick={handleMarkerClick}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sunken">
                  <p className="text-muted">No map data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
