import { useEffect } from "react";
import { MapContainer, WMSTileLayer, useMap } from "react-leaflet";
import type { AOI } from "../App";

type MapPanelProps = {
  selectedAoi: AOI | null;
};

function MapAoiSync({ selectedAoi }: { selectedAoi: AOI | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedAoi) return;
    const [lat, lng] = selectedAoi.center;
    map.flyTo([lat, lng], selectedAoi.zoom, { duration: 0.7 });
  }, [selectedAoi, map]);

  return null;
}

function MapControls() {
  const map = useMap();

  return (
    <div className="pointer-events-none absolute bottom-4 right-4 flex flex-col gap-2">
      <div className="pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg shadow-slate-900/70">
        <button
          onClick={() => map.zoomIn()}
          className="px-3 py-2 text-xs text-slate-100 hover:bg-slate-800 transition"
        >
          +
        </button>
        <div className="h-px bg-slate-800" />
        <button
          onClick={() => map.zoomOut()}
          className="px-3 py-2 text-xs text-slate-100 hover:bg-slate-800 transition"
        >
          –
        </button>
      </div>
    </div>
  );
}

export function MapPanel({ selectedAoi }: MapPanelProps) {
  const defaultCenter: [number, number] = selectedAoi?.center ?? [51.5, 7.5];
  const defaultZoom = selectedAoi?.zoom ?? 9;

  return (
    <div className="relative h-full w-full" data-testid="map-panel">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        zoomControl={false}
      >
        <WMSTileLayer
          url="https://www.wms.nrw.de/geobasis/wms_nw_dop"
          layers="nw_dop_rgb"
          format="image/jpeg"
          transparent={false}
          version="1.3.0"
          attribution='&copy; Land NRW – Geobasis NRW'
        />

        <MapAoiSync selectedAoi={selectedAoi} />
        <MapControls />
      </MapContainer>

      {/* overlay header pill */}
      <div className="pointer-events-none absolute left-4 top-4">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-[11px] text-slate-200 shadow-md shadow-slate-900/70">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">
            {selectedAoi ? selectedAoi.name : "No AOI selected"}
          </span>
          <span className="text-[10px] text-slate-400">
            WMS · NRW Orthophoto
          </span>
        </div>
      </div>
    </div>
  );
}
