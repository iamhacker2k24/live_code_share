import React, { useState } from "react";
import {
  FiFileText,
  FiImage,
  FiVideo,
  FiCopy,
  FiMoreHorizontal,
  FiGrid,
  FiCheck,
} from "react-icons/fi";

const uploads = [
  {
    id: 1,
    name: "Project_Presentation.pdf",
    size: "12.4 MB",
    uploaded: "2 minutes ago",
    link: "https://linklab.in/f/7a9K3m",
    type: "pdf",
  },
  {
    id: 2,
    name: "diagram.png",
    size: "2.1 MB",
    uploaded: "1 hour ago",
    link: "https://linklab.in/f/Kp2L9q",
    type: "image",
  },
  {
    id: 3,
    name: "demo_video.mp4",
    size: "48.6 MB",
    uploaded: "3 hours ago",
    link: "https://linklab.in/f/Bn4D7e",
    type: "video",
  },
];

export default function RecentUploads() {
  const [copiedId, setCopiedId] = useState(null);

  const copyLink = async (link, id) => {
    try {
      await navigator.clipboard.writeText(link);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const getFileIcon = (type) => {
    if (type === "pdf") {
      return <FiFileText size={23} />;
    }

    if (type === "image") {
      return <FiImage size={23} />;
    }

    if (type === "video") {
      return <FiVideo size={23} />;
    }

    return <FiFileText size={23} />;
  };

  const getIconStyle = (type) => {
    if (type === "pdf") {
      return "bg-red-100 text-red-500";
    }

    if (type === "image") {
      return "bg-emerald-100 text-emerald-500";
    }

    if (type === "video") {
      return "bg-violet-100 text-violet-600";
    }

    return "bg-blue-100 text-blue-600";
  };

  return (
    <section className="w-full px-5 sm:px-8 lg:px-12 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[26px] sm:text-[30px] font-bold text-[#101c3c]">
          Recent Uploads
        </h2>

        <button
          type="button"
          className="
            flex items-center gap-2
            text-[#1769ff]
            text-base sm:text-lg
            font-semibold
            hover:gap-3
            transition-all duration-200
          "
        >
          View All
          <span className="text-2xl leading-none">→</span>
        </button>
      </div>

      {/* Table Container */}
      <div
        className="
          w-full
          overflow-x-auto
          rounded-2xl
          bg-white
          border border-[#e7eefb]
          shadow-[0_8px_30px_rgba(30,80,160,0.06)]
        "
      >
        <div className="min-w-[950px]">

          {/* Table Header */}
          <div
            className="
              grid
              grid-cols-[2.3fr_1fr_1.4fr_2.5fr_1.5fr]
              items-center
              px-7
              py-5
              bg-[#fbfdff]
              border-b border-[#e9eef7]
              text-[#53698e]
              text-sm
              font-semibold
            "
          >
            <div>File Name</div>
            <div>Size</div>
            <div>Uploaded</div>
            <div>Link</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Rows */}
          {uploads.map((file, index) => (
            <div
              key={file.id}
              className={`
                grid
                grid-cols-[2.3fr_1fr_1.4fr_2.5fr_1.5fr]
                items-center
                px-7
                py-4
                min-h-[88px]
                hover:bg-[#f9fbff]
                transition-colors duration-200
                ${
                  index !== uploads.length - 1
                    ? "border-b border-[#edf1f7]"
                    : ""
                }
              `}
            >
              {/* File Name */}
              <div className="flex items-center gap-4 min-w-0">
                
                <div
                  className={`
                    w-[48px]
                    h-[48px]
                    rounded-[13px]
                    flex
                    items-center
                    justify-center
                    shrink-0
                    ${getIconStyle(file.type)}
                  `}
                >
                  {getFileIcon(file.type)}
                </div>

                <p
                  className="
                    text-[16px]
                    font-medium
                    text-[#17223d]
                    truncate
                  "
                  title={file.name}
                >
                  {file.name}
                </p>
              </div>

              {/* Size */}
              <div className="text-[#52688d] text-[16px]">
                {file.size}
              </div>

              {/* Uploaded */}
              <div className="text-[#52688d] text-[16px]">
                {file.uploaded}
              </div>

              {/* Link */}
              <div className="flex items-center gap-4 min-w-0">
                <a
                  href={file.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-[#1769ff]
                    text-[16px]
                    font-medium
                    truncate
                    hover:underline
                  "
                  title={file.link}
                >
                  {file.link}
                </a>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => copyLink(file.link, file.id)}
                  className="
                    shrink-0
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    text-[#34486d]
                    hover:bg-[#edf4ff]
                    hover:text-[#1769ff]
                    transition
                  "
                  title="Copy link"
                >
                  {copiedId === file.id ? (
                    <FiCheck size={19} className="text-green-500" />
                  ) : (
                    <FiCopy size={19} />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">

                {/* QR Button */}
                <button
                  type="button"
                  className="
                    h-[44px]
                    px-5
                    rounded-xl
                    bg-[#edf5ff]
                    text-[#1769ff]
                    flex
                    items-center
                    gap-2.5
                    font-semibold
                    text-[15px]
                    hover:bg-[#e2efff]
                    transition
                  "
                >
                  <FiGrid size={19} />
                  <span>QR</span>
                </button>

                {/* More Button */}
                <button
                  type="button"
                  className="
                    w-[44px]
                    h-[44px]
                    rounded-xl
                    border
                    border-[#dce6f5]
                    bg-white
                    flex
                    items-center
                    justify-center
                    text-[#24385e]
                    hover:bg-[#f4f8ff]
                    hover:border-[#bcd3f8]
                    transition
                  "
                  title="More options"
                >
                  <FiMoreHorizontal size={21} />
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}