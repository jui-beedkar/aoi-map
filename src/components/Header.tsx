import { useState } from "react";

type HeaderProps = {
  onSaveDraft: () => void;
  onPublish: () => void;
  isPublished: boolean;
  onProfileAction: (action: "profile" | "settings" | "logout") => void;
};

export function Header({
  onSaveDraft,
  onPublish,
  isPublished,
  onProfileAction,
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  function handleProfileClick() {
    setProfileOpen((open) => !open);
  }

  function handleProfileItem(action: "profile" | "settings" | "logout") {
    onProfileAction(action);
    setProfileOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-500/40">
            <span className="text-sm font-bold text-sky-400">AOI</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100">
              AOI Creator
            </h1>
            <p className="text-[11px] text-slate-400">
              Define and inspect Areas of Interest on orthophoto imagery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs relative">
          <button
            onClick={onSaveDraft}
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-300 shadow-sm hover:border-sky-500 hover:text-sky-300 hover:shadow-sky-900/40 transition"
          >
            Save draft
          </button>
          <button
            onClick={onPublish}
            className={`rounded-full px-3 py-1.5 font-medium shadow-lg shadow-sky-900/60 transition ${
              isPublished
                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                : "bg-sky-500 text-slate-950 hover:bg-sky-400"
            }`}
          >
            {isPublished ? "Published" : "Publish AOI set"}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={handleProfileClick}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 text-[11px] font-semibold text-slate-100 hover:ring-2 hover:ring-sky-500/60 transition"
            >
              J
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-800 bg-slate-900/95 text-[11px] text-slate-100 shadow-lg shadow-slate-900/80">
                <button
                  className="block w-full px-3 py-2 text-left hover:bg-slate-800"
                  onClick={() => handleProfileItem("profile")}
                >
                  View profile
                </button>
                <button
                  className="block w-full px-3 py-2 text-left hover:bg-slate-800"
                  onClick={() => handleProfileItem("settings")}
                >
                  Settings
                </button>
                <div className="h-px bg-slate-800" />
                <button
                  className="block w-full px-3 py-2 text-left text-red-300 hover:bg-slate-800 hover:text-red-200"
                  onClick={() => handleProfileItem("logout")}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
