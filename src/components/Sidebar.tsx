import type { AOI } from "../App";

type SidebarProps = {
  aois: AOI[];
  selectedAoiId: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectAoi: (id: string) => void;
  onCreateAoi: () => void;
};

export function Sidebar({
  aois,
  selectedAoiId,
  searchQuery,
  onSearchChange,
  onSelectAoi,
  onCreateAoi,
}: SidebarProps) {
  const total = aois.length;

  return (
    <aside
      className="flex w-72 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-[0_0_30px_rgba(15,23,42,0.7)]"
      data-testid="sidebar"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Areas of Interest
          </h2>
          <p className="text-[11px] text-slate-500">
            {total} {total === 1 ? "AOI" : "AOIs"} in session
          </p>
        </div>
        <button
          onClick={onCreateAoi}
          className="rounded-full border border-dashed border-slate-600 px-2 py-1 text-[11px] text-slate-300 hover:border-sky-500 hover:text-sky-300 transition"
        >
          + New
        </button>
      </div>

      <div className="mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search AOIs…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 pr-8 text-xs text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <span className="pointer-events-none absolute right-2 top-1.5 text-[13px] text-slate-500">
            🔍
          </span>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-1">
        {aois.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/70 p-3 text-[11px] text-slate-400">
            No AOIs match your filters. Create a new one or clear the search.
          </div>
        )}

        {aois.map((aoi) => {
          const isActive = aoi.id === selectedAoiId;
          return (
            <button
              key={aoi.id}
              onClick={() => onSelectAoi(aoi.id)}
              className={`group w-full rounded-xl border px-3 py-2 text-left text-xs transition
                ${
                  isActive
                    ? "border-sky-500/70 bg-sky-500/10 shadow-inner shadow-sky-900/70"
                    : "border-slate-800 bg-slate-900/70 hover:border-sky-500/40 hover:bg-slate-900"
                }`}
              data-testid={`aoi-item-${aoi.id}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`line-clamp-1 font-medium ${
                    isActive ? "text-sky-300" : "text-slate-100"
                  }`}
                >
                  {aoi.name}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  AOI
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">
                {aoi.description}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
