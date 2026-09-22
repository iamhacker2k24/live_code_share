import React, { useState, useRef, useEffect } from "react";
import {
  FiFileText,
  FiImage,
  FiVideo,
  FiFile,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiGrid,
  FiX,
  FiClock,
  FiChevronDown,
  FiTrash2,
  FiFolder,
} from "react-icons/fi";
import { useShare } from "../../App";

export default function RecentUploads() {
  const { recentUploads, clearRecentUploads } = useShare();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedItemId, setCopiedItemId] = useState(null);
  const [qrModalItem, setQrModalItem] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getItemLink = (item) => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:5173";
    if (item?.id) {
      return `${origin}/${item.id}`;
    }
    return item?.link || `${origin}/`;
  };

  const copyLink = async (link, id) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const copySpaceId = async (id) => {
    try {
      await navigator.clipboard.writeText(String(id));
      setCopiedItemId(id);
      setTimeout(() => setCopiedItemId(null), 1500);
    } catch (error) {
      console.error("Copy ID failed:", error);
    }
  };

  const getFileIcon = (type) => {
    if (type === "pdf") return <FiFileText size={16} />;
    if (type === "image") return <FiImage size={16} />;
    if (type === "video") return <FiVideo size={16} />;
    return <FiFile size={16} />;
  };

  const getIconStyle = (type) => {
    if (type === "pdf") return "bg-red-500/10 text-red-500 border border-red-500/20";
    if (type === "image") return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    if (type === "video") return "bg-violet-500/10 text-violet-500 border border-violet-500/20";
    return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-blue-500 hover:text-blue-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
      >
        <FiFolder size={14} className="text-blue-600 dark:text-blue-400" />
        <span>Previous Uploads</span>
        <span
          className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${
            recentUploads.length > 0
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {recentUploads.length}
        </span>
        <FiChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-1 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Previous Uploads
              </span>
              <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                {recentUploads.length}
              </span>
            </div>

            {recentUploads.length > 0 && (
              <button
                type="button"
                onClick={clearRecentUploads}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors"
                title="Clear upload history"
              >
                <FiTrash2 size={12} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Uploads List or Empty State */}
          <div className="mt-2 max-h-72 overflow-y-auto space-y-2 pr-1">
            {recentUploads.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <FiFolder size={20} />
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No previous uploads yet
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Files or notes you upload will appear in this dropdown.
                </p>
              </div>
            ) : (
              recentUploads.map((file) => (
                <div
                  key={file.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 transition-all hover:border-slate-200 hover:bg-slate-100/70 dark:border-slate-800/80 dark:bg-slate-850/60 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* File Icon & Details */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getIconStyle(
                          file.type
                        )}`}
                      >
                        {getFileIcon(file.type)}
                      </div>

                      <div className="truncate min-w-0">
                        <p
                          className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FiClock size={10} /> {file.uploaded}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ID Pill with Copy */}
                    <button
                      type="button"
                      onClick={() => copySpaceId(file.id)}
                      className="shrink-0 flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50/80 px-2 py-1 text-[11px] font-mono font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                      title="Copy Space ID"
                    >
                      <span>ID: {file.id}</span>
                      {copiedItemId === file.id ? (
                        <FiCheck size={11} className="text-emerald-500" />
                      ) : (
                        <FiCopy size={11} />
                      )}
                    </button>
                  </div>

                  {/* Action buttons row */}
                  <div className="mt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/60 pt-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyLink(getItemLink(file), file.id)}
                        className="flex items-center gap-1 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
                        title={`Copy: ${getItemLink(file)}`}
                      >
                        {copiedId === file.id ? (
                          <>
                            <FiCheck size={11} className="text-emerald-500" />
                            <span className="text-emerald-500 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FiCopy size={11} />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <span className="text-slate-300 dark:text-slate-700">•</span>

                      <button
                        type="button"
                        onClick={() => setQrModalItem(file)}
                        className="flex items-center gap-1 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
                      >
                        <FiGrid size={11} />
                        <span>QR Code</span>
                      </button>
                    </div>

                    <a
                      href={getItemLink(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-blue-400"
                      title={getItemLink(file)}
                    >
                      <span>Open</span>
                      <FiExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {qrModalItem.name}
              </h4>
              <button
                onClick={() => setQrModalItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="my-3 flex justify-center p-3 bg-white rounded-xl border border-slate-200 dark:border-slate-800">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  getItemLink(qrModalItem)
                )}`}
                alt="QR Code"
                className="h-36 w-36 rounded-lg"
              />
            </div>

            {/* Display the link clearly */}
            <div className="mb-2 rounded-lg bg-slate-100 p-2 text-[11px] font-mono text-blue-600 dark:bg-slate-800 dark:text-blue-400 break-all select-all text-center">
              {getItemLink(qrModalItem)}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Scan with your phone to access this item directly.
            </p>

            <button
              onClick={() => copyLink(getItemLink(qrModalItem), qrModalItem.id)}
              className="mt-3 w-full rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              {copiedId === qrModalItem.id ? "Link Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}