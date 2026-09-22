import React from "react";

const Footer = () => {
  return (
    <footer className="w-full shrink-0 border-t border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>© 2026</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">LinkLab</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden sm:inline flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Peer-to-peer active
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="transition hover:text-blue-600 dark:hover:text-blue-400">
            Privacy
          </a>
          <a href="#" className="transition hover:text-blue-600 dark:hover:text-blue-400">
            Terms
          </a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <p className="flex items-center">
            Made with <span className="mx-1 text-red-500">♥</span> for seamless sharing
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
