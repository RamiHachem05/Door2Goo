// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import GooeyNav from "./Components/GooeyNav.jsx";

export default function Layout() {
  return (
    <>
      {/* Sticky/blur navbar */}
      <div className="nav">
        <div className="container nav__inner">
          {/* Logo and Brand Name */}
          <div className="brand-container">
            <div className="logo">🚚</div> {/* You can replace this with your actual logo */}
            <div className="brand">
              <span className="blue">Door</span>
              <span className="purple">2Go</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <GooeyNav />
        </div>
      </div>

      {/* Page content under navbar */}
      <main style={{ minHeight: "calc(100vh - 64px)", paddingTop: 0 }}>
        <Outlet />
      </main>
    </>
  );
}