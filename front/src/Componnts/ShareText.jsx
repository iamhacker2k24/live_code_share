import React from "react";
import Header from "./CommonComponent/Header";
import Footer from "./CommonComponent/Footer";
import HeroSection from "./ShareFilePdf/HeroSection";
import RecentUploads from "./CommonComponent/RecentUploads";

const ShareText = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />
      <main className="flex-1 min-h-0 flex items-center justify-center p-3 sm:p-5 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg z-10 flex flex-col gap-2">
          <div className="flex items-center justify-end px-1">
            <RecentUploads />
          </div>
          <HeroSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShareText;
