import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSend,
  FiRotateCcw,
  FiCheck,
  FiCopy,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import axios from "axios";
import { useShare } from "../../App";

export default function HeroSection({ onBack }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const navigate = useNavigate();
  const { setActiveSpaceId, addRecentUpload } = useShare();

  const backPage = () => {
    navigate("/");
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
  };

  const uploadToGofile = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    try {
      const response = await axios.post("https://upload.gofile.io/uploadfile", formData);
      return response.data?.data || response.data;
    } catch (err) {
      console.warn("Gofile text upload failed:", err);
      return null;
    }
  };

  const handleSend = async () => {
    if (!text.trim() || isSending) return;
    setIsSending(true);

    try {
      const textTitle = `Note_${Date.now().toString().slice(-4)}.txt`;
      const textBlob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const textFile = new File([textBlob], textTitle, { type: "text/plain" });

      // 1. Upload to gofile first (same as file upload)
      const gofileData = await uploadToGofile(textFile);
      const downloadPage =
        gofileData?.downloadPage ||
        `https://gofile.io/d/${gofileData?.fileId || ""}`;

      // 2. Send EXACT same JSON structure to backend /uploadanything
      const metaPayload = {
        name: textTitle,
        fileName: textTitle,
        size: formatFileSize(textFile.size),
        fileSize: formatFileSize(textFile.size),
        type: "file",
        downloadPage: downloadPage,
        link: downloadPage,
        gofileData: gofileData,
        text: text,
        uploaded: "Just now",
        uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const response = await axios.post("http://localhost:3000/uploadanything", {
        data: metaPayload,
      });

      if (response.data?.sucess) {
        const genId = response.data.id;

        // Update active Space ID in header
        setActiveSpaceId(genId);

        setUploadSuccess({
          id: genId,
          text: text,
          title: textTitle,
          link: downloadPage,
          size: formatFileSize(textFile.size),
        });

        // Add to Recent Uploads
        addRecentUpload({
          id: genId,
          name: textTitle,
          size: formatFileSize(textFile.size),
          uploaded: "Just now",
          link: downloadPage,
          type: "file",
        });
      }
    } catch (err) {
      console.error("Error sending text:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setText("");
    setUploadSuccess(null);
  };

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(String(id));
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="h-full flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div>
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={backPage}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
          >
            <FiArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Text Transfer
          </span>
        </div>

        {/* Title */}
        <div className="mt-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Share <span className="text-blue-600 dark:text-blue-500">Text</span>
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Type or paste your code snippet, link, or note to share instantly.
          </p>
        </div>

        {/* Upload Success Card or Textarea */}
        {uploadSuccess ? (
          /* Prominent ID card displayed UNDER editor as requested */
          <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <FiCheckCircle size={17} />
              <span>Text Shared Successfully!</span>
            </div>

            <div className="mt-3 rounded-xl border border-emerald-200/80 bg-white/90 p-3.5 dark:border-emerald-900/60 dark:bg-slate-900/90 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Generated Space ID
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-3xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
                  {uploadSuccess.id}
                </span>
                <button
                  type="button"
                  onClick={() => copyId(uploadSuccess.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
                >
                  {copiedId ? <FiCheck size={13} /> : <FiCopy size={13} />}
                  <span>{copiedId ? "Copied!" : "Copy ID"}</span>
                </button>
              </div>
            </div>

            <div className="mt-3 min-h-[44px] max-h-36 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap rounded-xl border border-slate-200/70 bg-white/70 p-3 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 leading-relaxed">
              {uploadSuccess.text}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  setUploadSuccess(null);
                  setText("");
                }}
                className="w-full rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                Share Another Note
              </button>
            </div>
          </div>
        ) : (
          /* Textarea editor */
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-850/50 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-colors">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type text, code, or links here..."
              className="h-32 sm:h-36 w-full resize-none border-none bg-transparent p-1 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 font-sans"
            />

            <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-2 px-1 text-[11px] text-slate-400">
              <span>{wordCount} words</span>
              <span>{text.length} characters</span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons & Info */}
      <div className="mt-3">
        {!uploadSuccess && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || isSending}
              className="flex-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 active:scale-98 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none dark:disabled:from-slate-800 dark:disabled:to-slate-800 dark:disabled:text-slate-600"
            >
              {isSending ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Sharing Text...</span>
                </>
              ) : (
                <>
                  <FiSend size={14} />
                  <span>Send Text & Generate ID</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-750 dark:hover:text-slate-200 transition disabled:opacity-40"
              title="Clear text"
            >
              <FiRotateCcw size={14} />
            </button>
          </div>
        )}

        <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-850 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
          <FiInfo size={13} className="shrink-0 text-blue-500" />
          <span>Shared text is assigned a unique Space ID for instant access.</span>
        </div>
      </div>
    </div>
  );
}