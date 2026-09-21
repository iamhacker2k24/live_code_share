
import { useState } from "react";

export default function HeroSection() {
  const [shareType, setShareType] = useState("");

  const handleContinue = () => {
    if (!shareType) return;

    console.log("Selected:", shareType);

    // Later:
    // if (shareType === "text") {
    //   navigate("/share/text");
    // }
    //
    // if (shareType === "file") {
    //   navigate("/share/file");
    // }
  };

  return (
    <main className="flex min-h-[calc(100vh-144px)] items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6">

      <div className="w-full max-w-xl text-center">

        {/* Heading */}
        <h2 className="text-5xl font-bold tracking-tight text-gray-900">
          Share{" "}
          <span className="text-blue-600">
            Instantly
          </span>
        </h2>

        {/* Description */}
        <p className="mt-4 text-lg text-gray-500">
          Share text or files between your phone and PC.
        </p>

        {/* Share Selection */}
        <div className="mt-10 text-left">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            What do you want to share?
          </label>

          <select
            value={shareType}
            onChange={(e) => setShareType(e.target.value)}
            className="h-14 w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-5 text-base text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select an option
            </option>

            <option value="text">
              📝 Text
            </option>

            <option value="file">
              📁 File
            </option>
          </select>

        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!shareType}
          className="mt-5 h-14 w-full rounded-xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
        >
          Continue
        </button>

        {/* Small Info */}
        <p className="mt-5 text-sm text-gray-400">
          Fast, simple and secure device-to-device sharing.
        </p>

      </div>

    </main>
  );
}