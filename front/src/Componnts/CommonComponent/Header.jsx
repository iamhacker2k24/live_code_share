import React from "react";

const Header = () => {
 return (
  <>
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">


        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white">
            L
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Link<span className="text-blue-600">Lab</span>
          </h1>
        </div>

      
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Enter your ID"
            className="h-11 w-56 rounded-xl border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />

          <button
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-95"
          >
            Enter Space
          </button>
        </div>

      </div>
    </header>
  </>
);
};

export default Header;
