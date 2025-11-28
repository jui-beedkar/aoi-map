import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { RightPanel } from "./components/RightPanel";
import { MapPanel } from "./components/MapPanel";

export type AOI = {
  id: string;
  name: string;
  description: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
};

type ToastState = {
  id: number;
  message: string;
} | null;

const STORAGE_KEY = "aoi-map-draft-v1";

function App() {
  const [aois, setAois] = useState<AOI[]>([
    {
      id: "aoi-1",
      name: "AOI 1 · Urban Core",
      description: "Dense urban test AOI near city center with mixed land use.",
      center: [51.5, 7.5],
      zoom: 12,
    },
    {
      id: "aoi-2",
      name: "AOI 2 · Farmland",
      description: "Agricultural region with crop fields and irrigation patterns.",
      center: [51.8, 7.0],
      zoom: 12,
    },
    {
      id: "aoi-3",
      name: "AOI 3 · Forest Edge",
      description: "Transition zone between forested area and nearby roads.",
      center: [51.3, 6.8],
      zoom: 12,
    },
  ]);

  const [selectedAoiId, setSelectedAoiId] = useState<string | null>("aoi-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [nextId, setNextId] = useState(4);
  const [toast, setToast] = useState<ToastState>(null);

  
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        aois: AOI[];
        selectedAoiId: string | null;
        isPublished?: boolean;
        nextId?: number;
      };

      if (parsed.aois && Array.isArray(parsed.aois) && parsed.aois.length > 0) {
        setAois(parsed.aois);
        setSelectedAoiId(parsed.selectedAoiId ?? parsed.aois[0].id);
        setIsPublished(Boolean(parsed.isPublished));
        setNextId(parsed.nextId ?? parsed.aois.length + 1);
        showToast("Loaded last saved draft from this browser.");
      }
    } catch {
      
    }
    
  }, []);

  const selectedAoi = useMemo(
    () => aois.find((aoi) => aoi.id === selectedAoiId) ?? null,
    [aois, selectedAoiId]
  );

  const filteredAois = useMemo(() => {
    if (!searchQuery.trim()) return aois;
    const q = searchQuery.toLowerCase();
    return aois.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [aois, searchQuery]);

  function showToast(message: string) {
    setToast({ id: Date.now(), message });
    setTimeout(() => {
      setToast((current) =>
        current && current.id === toast?.id ? null : current
      );
    }, 2500);
  }

  function handleSaveDraft() {
    try {
      const payload = {
        aois,
        selectedAoiId,
        isPublished,
        nextId,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      showToast("Draft saved locally in this browser.");
    } catch {
      showToast("Unable to save draft (localStorage error).");
    }
  }

  function handlePublish() {
    setIsPublished(true);
    showToast("AOI set published (simulated).");
  }

  function handleCreateAoi() {
    const baseCenter = selectedAoi?.center ?? [51.5, 7.5];
    const newId = `aoi-${nextId}`;
    const newAoi: AOI = {
      id: newId,
      name: `AOI ${nextId} · New`,
      description: "Newly created AOI (placeholder metadata).",
      center: [baseCenter[0] + 0.03, baseCenter[1] + 0.03],
      zoom: selectedAoi?.zoom ?? 12,
    };
    setAois((prev) => [...prev, newAoi]);
    setSelectedAoiId(newId);
    setNextId((n) => n + 1);
    showToast("New AOI created.");
  }

  function handleRemoveSelectedAoi() {
    if (!selectedAoi) return;
    setAois((prev) => {
      const remaining = prev.filter((a) => a.id !== selectedAoi.id);
      if (remaining.length === 0) {
        setSelectedAoiId(null);
      } else if (!remaining.some((a) => a.id === selectedAoiId)) {
        setSelectedAoiId(remaining[0].id);
      }
      return remaining;
    });
    showToast("AOI removed from this session.");
  }

  function handleFocusSelectedAoi() {
    if (selectedAoi) {
      showToast(`Focusing map on ${selectedAoi.name}.`);
      
    }
  }

  function handleProfileAction(action: "profile" | "settings" | "logout") {
    if (action === "profile") {
      showToast("Profile view is not implemented in this prototype.");
    } else if (action === "settings") {
      showToast("Settings panel is not implemented in this prototype.");
    } else if (action === "logout") {
      showToast("Sign-out is simulated only (no auth wired).");
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      {}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#1e293b_0,#020617_55%)] opacity-70" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isPublished={isPublished}
          onProfileAction={handleProfileAction}
        />

        <div className="flex flex-1 gap-3 p-3">
          <Sidebar
            aois={filteredAois}
            selectedAoiId={selectedAoiId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectAoi={setSelectedAoiId}
            onCreateAoi={handleCreateAoi}
          />

          <main className="flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
            <MapPanel selectedAoi={selectedAoi} />
          </main>

          <RightPanel
            selectedAoi={selectedAoi}
            isPublished={isPublished}
            onFocus={handleFocusSelectedAoi}
            onRemove={handleRemoveSelectedAoi}
          />
        </div>

        {toast && (
          <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
            <div className="pointer-events-auto max-w-md rounded-full border border-slate-700 bg-slate-900/95 px-4 py-2 text-xs text-slate-100 shadow-lg shadow-slate-900/80">
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
