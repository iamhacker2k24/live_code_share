import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection({ onBack }) {
  const [text, setText] = useState("");
 const navigate = useNavigate();

  const backPage = () => {
    navigate("/");
  };

  const handleSend = () => {
    if (!text.trim()) return;

    console.log("Sending text:", text);

    // Your backend / socket code will come here
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <main className="min-h-[calc(100vh-144px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-8">

      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <button
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

         
        <div className="mx-auto mt-8 max-w-2xl text-center">

          {/* Text Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <span className="font-serif text-4xl font-bold text-blue-600">
              T
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
            Share{" "}
            <span className="text-blue-600">
              Text
            </span>
          </h1>

            
          <p className="mt-3 text-base text-slate-500">
            Type or paste your text below and send it to your connected device.
          </p>

          {/* Text Area Card */}
          <div className="mt-8 overflow-hidden rounded-xl border border-blue-100 bg-white text-left shadow-sm">

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="h-56 w-full resize-none border-none bg-transparent px-5 py-5 text-base text-slate-800 outline-none placeholder:text-slate-400"
            />

            {/* Character Count */}
            <div className="flex justify-end px-5 pb-4">
              <span className="text-sm text-slate-500">
                {text.length} characters
              </span>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-4">

              
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-blue-600 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {/* Send Icon */}
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
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>

              Send Text
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
            >
              {/* Refresh Icon */}
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
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>

              Clear
            </button>

          </div>

          {/* Information Box */}
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-50 px-5 py-4 text-left">

            {/* Info Icon */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              i
            </div>

            <p className="text-sm text-slate-600">
              Your text will be securely shared with the connected device.
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}