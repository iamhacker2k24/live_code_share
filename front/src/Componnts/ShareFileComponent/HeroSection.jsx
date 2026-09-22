import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUploadCloud,
  FiFile,
  FiX,
  FiSend,
  FiCheck,
  FiCopy,
  FiCheckCircle,
  FiExternalLink,
  FiInfo,
} from "react-icons/fi";
import axios from "axios";
import { useShare } from "../../App";

export default function HeroSection({ onBack }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setActiveSpaceId, addRecentUpload } = useShare();

  const UplaodFile = async (fileToUpload) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    try {
      const response = await axios.post("https://upload.gofile.io/uploadfile", formData);
      return response.data;
    } catch (error) {
      console.warn("Gofile upload direct failed, fallback to local meta:", error);
      return null;
    }
  };

  const uploadFileMetaTobackend = async (data) => {
    const response = await axios.post("http://localhost:3000/uploadanything", {
      data: data,
    });
    return response.data;
  };

  const backPage = () => {
    navigate("/");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadSuccess(null);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
  };

  const getFileType = (fileName) => {
    const ext = fileName?.split(".")?.pop()?.toLowerCase();
    if (["pdf"].includes(ext)) return "pdf";
    if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return "image";
    if (["mp4", "webm", "mov", "mkv"].includes(ext)) return "video";
    return "file";
  };

  const handleSendFile = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      // 1. Upload to gofile
      const gofileData = await UplaodFile(file);
      const downloadPage =
        gofileData?.data?.downloadPage ||
        `https://gofile.io/d/${gofileData?.data?.fileId || "share"}`;

      // 2. Upload metadata to backend route: /uploadanything
      const metaPayload = {
        name: file.name,
        fileName: file.name,
        size: formatFileSize(file.size),
        fileSize: formatFileSize(file.size),
        type: getFileType(file.name),
        downloadPage: downloadPage,
        link: downloadPage,
        gofileData: gofileData?.data || null,
        uploaded: "Just now",
        uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const backendResponse = await uploadFileMetaTobackend(metaPayload);

      if (backendResponse?.sucess) {
        const genId = backendResponse.id;
        const origin =
          typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "http://localhost:5173";
        const shareLink = `${origin}/${genId}`;

        // Update Navbar active Space ID
        setActiveSpaceId(genId);

        const successInfo = {
          id: genId,
          fileName: file.name,
          size: formatFileSize(file.size),
          link: shareLink,
          downloadPage: downloadPage,
        };

        setUploadSuccess(successInfo);

        // Add to Recent Uploads list in real-time
        addRecentUpload({
          id: genId,
          name: file.name,
          size: formatFileSize(file.size),
          uploaded: "Just now",
          link: shareLink,
          downloadPage: downloadPage,
          type: getFileType(file.name),
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
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

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

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
            File Transfer
          </span>
        </div>

        {/* Title */}
        <div className="mt-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Share <span className="text-blue-600 dark:text-blue-500">File</span>
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Upload and receive a 5-digit Space ID to retrieve on any device.
          </p>
        </div>

        {/* Upload State or Dropzone */}
        {uploadSuccess ? (
          /* Prominent ID card displayed UNDER upload area as requested */
          <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <FiCheckCircle size={17} />
              <span>File Uploaded Successfully!</span>
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

            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="truncate max-w-[200px] font-medium">{uploadSuccess.fileName}</span>
              <span className="text-slate-400">{uploadSuccess.size}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <a
                href={uploadSuccess.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-200 dark:hover:bg-slate-800 transition"
              >
                <FiExternalLink size={13} />
                <span>Open File</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setUploadSuccess(null);
                  setFile(null);
                }}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                Upload Another
              </button>
            </div>
          </div>
        ) : (
          /* File Dropzone */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
            className={`mt-3 flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
              isDragging
                ? "border-blue-600 bg-blue-50/80 dark:border-blue-500 dark:bg-blue-950/40"
                : "border-slate-300 bg-slate-50/50 hover:border-blue-500 hover:bg-blue-50/30 dark:border-slate-700 dark:bg-slate-850/50 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <FiUploadCloud size={20} />
            </div>

            <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              Drag & drop file here or <span className="text-blue-600 dark:text-blue-400">browse</span>
            </p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Supports images, documents, videos up to 2GB
            </span>
          </div>
        )}

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Selected File Card */}
        {file && !uploadSuccess && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-850/80">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <FiFile size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {file.name}
                </p>
                <p className="text-[10px] text-slate-400">{formatFileSize(file.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-red-500 dark:hover:bg-slate-700 transition"
              title="Remove file"
            >
              <FiX size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Action CTA & Info */}
      <div className="mt-3">
        {!uploadSuccess && (
          <button
            type="button"
            onClick={handleSendFile}
            disabled={!file || isUploading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:from-blue-700 hover:to-indigo-700 active:scale-98 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none dark:disabled:from-slate-800 dark:disabled:to-slate-800 dark:disabled:text-slate-600"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Uploading & Generating ID...</span>
              </>
            ) : (
              <>
                <FiSend size={14} />
                <span>Send File & Generate ID</span>
              </>
            )}
          </button>
        )}

        <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-850 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
          <FiInfo size={13} className="shrink-0 text-blue-500" />
          <span>Upload will return a unique Space ID for instant retrieval.</span>
        </div>
      </div>
    </div>
  );
}
