import type { AOI } from "../App";

type RightPanelProps = {
  selectedAoi: AOI | null;
  isPublished: boolean;
  onFocus: () => void;
  onRemove: () => void;
};

export function RightPanel({
  selectedAoi,
  isPublished,
  onFocus,
  onRemove,
}: RightPanelProps) {
  return (
    <aside
      className="flex w-80 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-[0_0_30px_rgba(15,23,42,0.7)]"
      data-testid="right-panel"
    >
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
        AOI Details
      </h2>
      <p className="mb-3 text-[11px] text-slate-500">
        Inspect metadata and coordinates for the active AOI.
      </p>

      {selectedAoi ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-100">
                {selectedAoi.name}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ring-1 ${
                  isPublished
                    ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40"
                    : "bg-sky-500/15 text-sky-300 ring-sky-500/40"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {selectedAoi.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-2">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Lat
              </p>
              <p className="font-mono text-xs text-slate-100">
                {selectedAoi.center[0].toFixed(4)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-2">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Lng
              </p>
              <p className="font-mono text-xs text-slate-100">
                {selectedAoi.center[1].toFixed(4)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-2">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Zoom
              </p>
              <p className="font-mono text-xs text-slate-100">
                {selectedAoi.zoom}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-2">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Status
              </p>
              <p className="text-xs text-emerald-300">
                {isPublished ? "Ready for review" : "Draft in progress"}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            <button
              className="w-full rounded-xl border border-sky-500/60 bg-sky-500/10 px-3 py-1.5 text-center font-medium text-sky-300 hover:bg-sky-500/20 transition"
              onClick={onFocus}
            >
              Focus this AOI on map
            </button>
            <button
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-center text-slate-300 hover:border-red-500/60 hover:text-red-300 transition"
              onClick={onRemove}
            >
              Remove from session
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/70 p-4 text-[11px] text-slate-400">
          No AOI selected. Choose an AOI from the left panel to see details
          here.
        </div>
      )}
    </aside>
  );
}
