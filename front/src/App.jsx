import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ShareText from "./Componnts/ShareText";
import ShareFile from "./Componnts/ShareFile";
import HomePage from "./Componnts/HomePage";

export const ShareContext = createContext(null);

export const useShare = () => {
  const context = useContext(ShareContext);
  if (!context) {
    throw new Error("useShare must be used within ShareProvider");
  }
  return context;
};

const App = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("linklab-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [activeSpaceId, setActiveSpaceId] = useState("");

  // Remove mock data: Load from localStorage or start empty
  const [recentUploads, setRecentUploads] = useState(() => {
    try {
      const saved = localStorage.getItem("linklab-recent-uploads");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [retrievedItem, setRetrievedItem] = useState(null);
  const [isRetrieveModalOpen, setIsRetrieveModalOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("linklab-theme", theme);
  }, [theme]);

  // Persist recent uploads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("linklab-recent-uploads", JSON.stringify(recentUploads));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }, [recentUploads]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const addRecentUpload = (item) => {
    setRecentUploads((prev) => [item, ...prev]);
  };

  const clearRecentUploads = () => {
    setRecentUploads([]);
    localStorage.removeItem("linklab-recent-uploads");
  };

  return (
    <ShareContext.Provider
      value={{
        theme,
        toggleTheme,
        activeSpaceId,
        setActiveSpaceId,
        recentUploads,
        addRecentUpload,
        clearRecentUploads,
        retrievedItem,
        setRetrievedItem,
        isRetrieveModalOpen,
        setIsRetrieveModalOpen,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ShareText" element={<ShareText />} />
          <Route path="/ShareFile" element={<ShareFile />} />
        </Routes>
      </BrowserRouter>
    </ShareContext.Provider>
  );
};

export default App;
