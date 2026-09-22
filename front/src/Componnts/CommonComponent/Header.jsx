import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiCopy, FiCheck, FiSearch, FiDownload, FiX, FiFileText } from "react-icons/fi";
import axios from "axios";
import { useShare } from "../../App";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    activeSpaceId,
    retrievedItem,
    setRetrievedItem,
    isRetrieveModalOpen,
    setIsRetrieveModalOpen,
  } = useShare();

  const [inputId, setInputId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isSharePage = location.pathname.toLowerCase().includes("share");

  const copyId = async () => {
    if (!activeSpaceId) return;
    try {
      await navigator.clipboard.writeText(String(activeSpaceId));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnterSpace = async (e) => {
    e?.preventDefault();
    const queryId = inputId.trim();
    if (!queryId) return;

    setInputId("");
    navigate(`/${queryId}`);
  };

  return (
    <>
      <header className="w-full shrink-0 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200 z-30">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Link<span className="text-blue-600 dark:text-blue-500">Lab</span>
            </span>
          </Link>

          {/* Center/Right Section */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dynamic Space ID or Search input */}
            {isSharePage ? (
              activeSpaceId ? (
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Space ID:
                  </span>
                  <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                    {activeSpaceId}
                  </span>
                  <button
                    type="button"
                    onClick={copyId}
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                    title="Copy Space ID"
                  >
                    {copied ? <FiCheck className="text-emerald-600 dark:text-emerald-400" /> : <FiCopy size={13} />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="hidden sm:inline">Active Space:</span>
                  <span>ID generates upon upload</span>
                </div>
              )
            ) : (
              <form onSubmit={handleEnterSpace} className="relative flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={inputId}
                    onChange={(e) => {
                      setInputId(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="Enter Space ID..."
                    className="h-10 w-36 sm:w-52 rounded-xl border border-slate-300 bg-slate-50 px-3.5 text-xs sm:text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-900"
                  />
                  {errorMessage && (
                    <div className="absolute left-0 top-11 whitespace-nowrap rounded-lg bg-red-500 px-2 py-1 text-[11px] text-white shadow-lg z-50">
                      {errorMessage}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputId.trim() || isLoading}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
                >
                  <FiSearch size={14} />
                  <span className="hidden sm:inline">{isLoading ? "Searching..." : "Enter Space"}</span>
                </button>
              </form>
            )}

            {/* Dark Mode Button in Nav */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FiSun size={17} className="text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <FiMoon size={17} className="text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
