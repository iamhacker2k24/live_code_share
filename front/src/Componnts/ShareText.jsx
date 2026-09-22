import React from "react";
import Header from "./CommonComponent/Header";
import Footer from "./CommonComponent/Footer";
import HeroSection from "./ShareFilePdf/HeroSection"
import RecentUploads from "./CommonComponent/RecentUploads";
const ShareText = () => {
  return (
    <>
      <Header />
      <HeroSection/>
      <RecentUploads/>
      <Footer />
    </>
  );
};

export default ShareText;
