import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ShareText from "./Componnts/ShareText";
import ShareFile from "./Componnts/ShareFile";
import HomePage from "./Componnts/HomePage";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ShareText" element={<ShareText />} />
          <Route path="/ShareFile" element={<ShareFile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
