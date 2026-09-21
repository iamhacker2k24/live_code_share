import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function HeroSection({ onBack }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const UplaodFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      "https://upload.gofile.io/uploadfile",
      formData,
    );
    return response.data;
  };

  const uploadFileMetaTobackend = async (data) => {
    const response = await axios.post(
      "http://localhost:3000/uploadanything",
      data,
    );
    console.log("sending to backend");
    return response.data;
  };

  const backPage = () => {
    navigate("/");
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Drag Over

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Drag Leave

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Drop File

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  // Open File Picker

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Remove File

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format File Size

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
  };

  // Send File

  const handleSendFile = async () => {
    console.log(file);
    if (!file) return;
    else {
      const data = await UplaodFile(file);
      console.log(data);
      const uploaddata = await uploadFileMetaTobackend(data);
      console.log(uploaddata);
    }

    // console.log("Sending file:", file);

    // Your backend / WebSocket code will come here
  };

  return (
    <main className="min-h-[calc(100vh-144px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={backPage}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>

        <div className="mx-auto mt-8 max-w-2xl">
          {/* Folder Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-center text-4xl font-bold tracking-tight text-slate-900">
            Share <span className="text-blue-600">File</span>
          </h1>

          <p className="mt-3 text-center text-base text-slate-500">
            Select a file from your device and send it to your connected device.
          </p>

          {/* UPLOAD AREA */}

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
            className={`mt-8 flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white transition ${
              isDragging
                ? "border-blue-600 bg-blue-50"
                : "border-blue-300 hover:border-blue-500 hover:bg-blue-50/30"
            }`}
          >
            {/* Upload Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M5 20h14" />
              </svg>
            </div>

            {/* Upload Text */}
            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              Drag & drop your file here
            </h3>

            <p className="mt-1 text-sm text-slate-400">or click to browse</p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
              className="mt-5 flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-6 py-3 font-medium text-blue-600 transition hover:bg-blue-50 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              </svg>
              Choose File
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* SELECTED FILE */}

          {file && (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              {/* File Information */}
              <div className="flex min-w-0 items-center gap-4">
                {/* File Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8" />
                    <path d="M8 17h5" />
                  </svg>
                </div>

                {/* Name + Size */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={removeFile}
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                ×
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleSendFile}
            disabled={!file}
            className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            Send File
          </button>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-50 px-5 py-4">
            {/* Info Icon */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              i
            </div>

            <p className="text-sm text-slate-600">
              You can share any type of file (images, videos, documents, etc.).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
