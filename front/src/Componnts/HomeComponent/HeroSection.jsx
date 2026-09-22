import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiArrowRight, FiFileText, FiFolder, FiZap, FiShield } from "react-icons/fi";
import { useShare } from "../../App";

export default function HeroSection() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useShare();
  const [shareType, setShareType] = useState("");

  const handleContinue = () => {
    if (!shareType) return;
    if (shareType === "text") {
      navigate("/ShareText");
    }
    if (shareType === "file") {
      navigate("/ShareFile");
    }
  };

  return (
    <main className="flex-1 min-h-0 flex items-center justify-center px-4 py-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Prominent Dark Mode Toggle on Home Page */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <FiZap size={13} className="text-amber-500" />
            <span>Instant P2P Transfer</span>
          </div>

          {/* Theme switch button */}
          <button
            type="button"
            onClick={toggleTheme}
            id="home-dark-mode-toggle"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-500 hover:shadow active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:bg-slate-700"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <>
                <FiSun size={14} className="text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <FiMoon size={14} className="text-indigo-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/90 dark:shadow-none transition-colors duration-200">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Share{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Share text or files securely between your phone and PC in seconds.
            </p>
          </div>

          {/* Interactive Share Type Selector */}
          <div className="mt-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select what to share
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Text Option Card */}
              <button
                type="button"
                onClick={() => setShareType("text")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                  shareType === "text"
                    ? "border-blue-600 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/50 dark:hover:bg-slate-800"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl mb-2 ${
                    shareType === "text"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <FiFileText size={20} />
                </div>
                <span className="text-sm font-bold">Text Note</span>
                <span className="text-[11px] opacity-75 mt-0.5">Code, links, notes</span>
              </button>

              {/* File Option Card */}
              <button
                type="button"
                onClick={() => setShareType("file")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                  shareType === "file"
                    ? "border-blue-600 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/50 dark:hover:bg-slate-800"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl mb-2 ${
                    shareType === "file"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <FiFolder size={20} />
                </div>
                <span className="text-sm font-bold">File / Media</span>
                <span className="text-[11px] opacity-75 mt-0.5">PDF, images, video</span>
              </button>
            </div>

            {/* Hidden native select for backwards compatibility */}
            <select
              value={shareType}
              onChange={(e) => setShareType(e.target.value)}
              className="sr-only"
              aria-label="Share format selector"
            >
              <option value="">Select an option</option>
              <option value="text">Text</option>
              <option value="file">File</option>
            </select>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!shareType}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none dark:disabled:from-slate-800 dark:disabled:to-slate-800 dark:disabled:text-slate-600"
          >
            <span>Continue to Share</span>
            <FiArrowRight size={16} />
          </button>

          {/* Trust badges */}
          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <FiShield size={12} className="text-emerald-500" /> End-to-end direct
            </span>
            <span>•</span>
            <span>No sign-up required</span>
          </div>
        </div>
      </div>
    </main>
  );
}
