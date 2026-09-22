import React from "react";
import Header from "../Componnts/CommonComponent/Header";
import HeroSection from "../Componnts/HomeComponent/HeroSection";
import Footer from "../Componnts/CommonComponent/Footer";

const HomePage = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default HomePage;
