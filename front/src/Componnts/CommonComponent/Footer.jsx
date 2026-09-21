import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="w-full border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
       
          <div>
            <p className="text-sm text-gray-500">
              © 2026{" "}
              <span className="font-semibold text-gray-700">LinkLab</span>. All
              rights reserved.
            </p>
          </div>

     
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="transition hover:text-blue-600">
              Privacy
            </a>

            <a href="#" className="transition hover:text-blue-600">
              Terms
            </a>

            <span className="text-gray-300">|</span>

            <p>
              Made for better collaboration
              <span className="ml-1 text-blue-600">♥</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
