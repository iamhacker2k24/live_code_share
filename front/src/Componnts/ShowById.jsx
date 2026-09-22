import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiSearch,
  FiCopy,
  FiCheck,
  FiDownload,
  FiFileText,
  FiExternalLink,
  FiRefreshCw,
  FiAlertCircle,
  FiHardDrive,
  FiCalendar,
  FiEye,
  FiCode,
  FiShare2,
} from "react-icons/fi";
import Header from "./CommonComponent/Header";
import Footer from "./CommonComponent/Footer";

const ShowById = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentParamId =
    params.id || searchParams.get("id") || searchParams.get("fileid") || "13935";

  const [fileId, setFileId] = useState(currentParamId);
  const [inputVal, setInputVal] = useState(currentParamId);
  const [dataResult, setDataResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [textContent, setTextContent] = useState(null);

  // Synchronize fileId with URL parameter changes
  useEffect(() => {
    const idFromUrl =
      params.id || searchParams.get("id") || searchParams.get("fileid");
    if (idFromUrl && idFromUrl !== fileId) {
      setFileId(idFromUrl);
      setInputVal(idFromUrl);
    }
  }, [params.id, searchParams]);

  // Fetch file details from backend /findDataOfupload
  const fetchData = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError("");
    setDataResult(null);
    setTextContent(null);

    try {
      const response = await axios.post("http://localhost:3000/findDataOfupload", {
        fileid: Number(idToFetch) || idToFetch,
      });

      setDataResult(response.data);
    } catch (err) {
      console.error("Error fetching data by ID:", err);
      setError(err.message || "Failed to connect to backend server.");
      setDataResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fileId);
  }, [fileId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      const trimmed = inputVal.trim();
      setFileId(trimmed);
      navigate(`/${trimmed}`);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(timestamp);
    }
  };

  // Extract metadata object if found
  const msg =
    dataResult?.sucess && dataResult?.msg && typeof dataResult.msg === "object"
      ? dataResult.msg
      : null;

  // Build the target preview & download URLs
  const fileUrl =
    msg?.newid && msg?.name
      ? `https://store3.gofile.io/download/web/${msg.newid}/${msg.name}`
      : msg?.downloadPage || "";
  const downloadUrl = fileUrl;
  const previewUrl = fileUrl;

  // Detect whether this is a text type file
  const isTextType =
    msg?.mimetype?.includes("text") ||
    msg?.mimetype === "text/plain; charset=utf-8" ||
    msg?.type === "text" ||
    /\.(txt|jsx|js|ts|tsx|html|css|json|md|py|java|c|cpp|go|rs|sql|xml|csv|log|sh)$/i.test(
      msg?.name || ""
    );

  // Attempt to fetch raw text content for inline preview with request headers
  useEffect(() => {
    if (!msg || !isTextType || !previewUrl) return;

    let isMounted = true;
    setTextContent(null);

    // 1. If text is already present in DB metadata, use it directly
    if (msg.text) {
      setTextContent(msg.text);
      return;
    }

    // 2. Request headers specified by user
    const requestHeaders = {
      Range: "bytes=0-1048575",
      Referer: "https://gofile.io/",
      "Sec-Ch-Ua": '"Google Chrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36",
    };

    // Use backend proxy endpoint with exact request headers
    const proxyUrl = `http://localhost:3000/api/fetchPreview?url=${encodeURIComponent(previewUrl)}`;

    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Backend preview proxy failed");
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          if (text && !text.includes("<!doctype html>") && !text.includes("<html")) {
            setTextContent(text);
          } else {
            // Fallback: direct fetch with headers
            fetch(previewUrl, { headers: requestHeaders })
              .then((r) => r.text())
              .then((directText) => {
                if (isMounted && directText && !directText.includes("<!doctype html>")) {
                  setTextContent(directText);
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch((err) => {
        console.warn("Preview fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [msg?.newid, msg?.text, previewUrl, isTextType]);

  const copyText = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else if (type === "id") {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else if (type === "raw") {
        setCopiedRaw(true);
        setTimeout(() => setCopiedRaw(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Header />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-start items-center">
        {/* Ambient lighting glow */}
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-4xl z-10 flex flex-col gap-4">
          {/* Top navigation & Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              <FiArrowLeft size={14} />
              <span>Back to Home</span>
            </button>

            {/* Quick Space ID search input */}
            <form onSubmit={handleSearch} className="flex items-center gap-1.5 self-end sm:self-auto">
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Enter Space ID..."
                  className="h-9 w-36 sm:w-44 rounded-xl border border-slate-200 bg-white px-3 text-xs font-mono font-medium text-slate-800 outline-none shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="flex h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
              >
                <FiSearch size={13} />
                <span>Fetch</span>
              </button>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-12 text-center shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FiRefreshCw size={22} className="animate-spin" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                Retrieving Space ID: <span className="font-mono text-blue-600 dark:text-blue-400">{fileId}</span>
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Fetching file metadata and download link...
              </p>
            </div>
          )}

          {/* Error / Not Found State */}
          {!loading && (!dataResult?.sucess || !msg) && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-50/50 p-8 sm:p-10 text-center shadow-sm dark:border-amber-500/20 dark:bg-amber-950/20">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FiAlertCircle size={24} />
              </div>
              <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                Space ID Not Found
              </h2>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {typeof dataResult?.msg === "string"
                  ? dataResult.msg
                  : error || `No active file found matching ID "${fileId}".`}
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchData(fileId)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-200"
                >
                  <FiRefreshCw size={13} />
                  <span>Retry</span>
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <span>Upload a File</span>
                </Link>
              </div>
            </div>
          )}

          {/* Success File View */}
          {!loading && msg && (
            <div className="flex flex-col gap-4">
              {/* Primary File Information Card */}
              <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                      {isTextType ? <FiFileText size={22} /> : <FiHardDrive size={22} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h1
                        className="truncate text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
                        title={msg.name}
                      >
                        {msg.name}
                      </h1>

                      {/* Meta badges row */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {/* Space ID Badge */}
                        <button
                          type="button"
                          onClick={() => copyText(String(msg.pageid || fileId), "id")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/80 px-2.5 py-1 text-xs font-mono font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300 transition-colors"
                          title="Copy Space ID"
                        >
                          <span>Space ID: {msg.pageid || fileId}</span>
                          {copiedId ? (
                            <FiCheck size={12} className="text-emerald-500" />
                          ) : (
                            <FiCopy size={12} />
                          )}
                        </button>

                        {/* File Size */}
                        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
                          <FiHardDrive size={11} className="text-slate-400" />
                          <span>{formatFileSize(msg.size)}</span>
                        </span>

                        {/* MimeType Badge */}
                        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
                          <FiCode size={11} className="text-blue-500" />
                          <span>{msg.mimetype || "text/plain"}</span>
                        </span>

                        {/* Date Badge */}
                        {msg.createTime && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <FiCalendar size={11} />
                            <span>{formatDate(msg.createTime)}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Header Pill */}
                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Ready to Download
                    </span>
                  </div>
                </div>

                {/* Primary Action Button Bar */}
                <div className="mt-5 flex items-center gap-3">
                  {/* Single Clean Primary Download Button */}
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={msg.name}
                    className="flex-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 active:scale-98 transition"
                  >
                    <FiDownload size={15} />
                    <span>Download File</span>
                  </a>

                  {/* Open in New Tab Button */}
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                  >
                    <FiExternalLink size={14} />
                    <span>Open in New Tab</span>
                  </a>
                </div>
              </div>

              {/* Text Preview Section */}
              {isTextType && (
                <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <FiEye size={15} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                          File Preview
                        </h2>
                        <span className="text-[11px] text-slate-400">
                          {msg.name} • {msg.mimetype}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {(msg.text || textContent) && (
                        <button
                          type="button"
                          onClick={() => copyText(msg.text || textContent, "raw")}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {copiedRaw ? (
                            <FiCheck size={12} className="text-emerald-500" />
                          ) : (
                            <FiCopy size={12} />
                          )}
                          <span>{copiedRaw ? "Copied" : "Copy Content"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="flex flex-col">
                    {(msg.text || textContent) ? (
                      /* High-fidelity Syntax & Text View when content is available */
                      <div className="relative rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-200 shadow-inner max-h-[500px] overflow-auto leading-relaxed select-text">
                        <pre className="whitespace-pre-wrap break-all">{msg.text || textContent}</pre>
                      </div>
                    ) : (
                      /* Clean styled file card without duplicate buttons */
                      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8 text-center dark:border-slate-800/80 dark:bg-slate-950/60">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 shadow-sm">
                          <FiFileText size={26} />
                        </div>

                        <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                          {msg.name}
                        </h3>

                        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{formatFileSize(msg.size)}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px]">{msg.mimetype}</span>
                        </div>

                        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
                          File is ready. Use the <strong>Download File</strong> button above to download or open this file.
                        </p>

                        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                          In-page browser preview is blocked because Gofile's servers send <code className="font-mono text-[10px] text-slate-500">X-Frame-Options: DENY</code>, which forbids iframe embedding.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShowById;
