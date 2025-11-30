import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvent,
  CircleMarker,
  Popup,
} from "react-leaflet";
import type { AOI, DrawnPoint } from "../App";
import type { LeafletMouseEvent } from "leaflet";

type MapPanelProps = {
  selectedAoi: AOI | null;
  drawnPoints: DrawnPoint[];
  showBaseLayer: boolean;
  showFeatures: boolean;
  onAddDrawnPoint: (lat: number, lng: number) => void;
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

function MapControls({
  drawMode,
  onToggleDrawMode,
}: {
  drawMode: boolean;
  onToggleDrawMode: () => void;
}) {
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

      <button
        className={`pointer-events-auto rounded-full border px-3 py-1.5 text-[11px] shadow-md shadow-slate-900/70 transition ${
          drawMode
            ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
            : "border-slate-700 bg-slate-900/90 text-slate-200 hover:border-sky-500/60 hover:text-sky-300"
        }`}
        onClick={onToggleDrawMode}
      >
        {drawMode ? "Click map to add point (Esc to exit)" : "Draw AOI point"}
      </button>
    </div>
  );
}


function DrawPointHandler({
  enabled,
  onAddDrawnPoint,
}: {
  enabled: boolean;
  onAddDrawnPoint: (lat: number, lng: number) => void;
}) {
  useMapEvent("click", (e) => {
    if (!enabled) return;
    onAddDrawnPoint(e.latlng.lat, e.latlng.lng);
  });
  return null;
}

// debounced moveend handler for performance demo
function DebouncedMoveLogger() {
  const map = useMap();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function onMoveEnd() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        const bounds = map.getBounds();
        // This is where you would trigger server-side loading.
        console.log("Debounced moveend, bounds:", bounds.toBBoxString());
      }, 300);
    }

    map.on("moveend", onMoveEnd);
    return () => {
      map.off("moveend", onMoveEnd);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [map]);

  return null;
}

// geocoding search using Nominatim
function GeocodeSearch() {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;
      const res = await fetch(url, {
        headers: {
          "Accept-Language": "en",
        },
      });
      const data: Array<{ lat: string; lon: string }> = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 13, { duration: 0.8 });
      } else {
        
        console.log("No geocoding results.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-[11px] text-slate-200 shadow-md shadow-slate-900/70"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search place…"
        className="w-36 bg-transparent text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-sky-500 px-2 py-0.5 text-[11px] text-slate-950 hover:bg-sky-400 disabled:opacity-60"
      >
        Go
      </button>
    </form>
  );
}

export function MapPanel({
  selectedAoi,
  drawnPoints,
  showBaseLayer,
  showFeatures,
  onAddDrawnPoint,
}: MapPanelProps) {
  const defaultCenter: [number, number] = selectedAoi?.center ?? [51.5, 7.5];
  const defaultZoom = selectedAoi?.zoom ?? 9;
  const [drawMode, setDrawMode] = useState(false);

  // allow Esc to exit draw mode
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawMode(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative h-full w-full" data-testid="map-panel">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {showBaseLayer && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}

        {/* drawn AOI points */}
        {showFeatures &&
          drawnPoints.map((pt) => (
            <CircleMarker
              key={pt.id}
              center={pt.position}
              radius={5}
              color="#38bdf8"
              weight={2}
              fillOpacity={0.9}
            >
              <Popup>{pt.label}</Popup>
            </CircleMarker>
          ))}

        <MapAoiSync selectedAoi={selectedAoi} />
        <DrawPointHandler enabled={drawMode} onAddDrawnPoint={onAddDrawnPoint} />
        <DebouncedMoveLogger />
        <MapControls
          drawMode={drawMode}
          onToggleDrawMode={() => setDrawMode((v) => !v)}
        />

        {/* overlay header + geocode search */}
        <div className="pointer-events-none absolute left-4 top-4 flex gap-2 z-[1000]">
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-[11px] text-slate-200 shadow-md shadow-slate-900/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">
              {selectedAoi ? selectedAoi.name : "No AOI selected"}
            </span>
            <span className="text-[10px] text-slate-400">
              WMS · NRW Orthophoto
            </span>
          </div>
          <div className="pointer-events-auto">
            <GeocodeSearch />
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
