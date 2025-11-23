// src/Components/GooeyNav.jsx
import React, { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import "./GooeyNav.css";

const GooeyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();

  // Main navigation links (always visible, animated)
  const mainItems = [
    { label: "Home", href: "/home" },
    { label: "Catalog", href: "/catalog" },
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "About Us", href: "/about" },
  ];

  // Extra items that show ONLY when logged in
  let authedExtra = [];

if (isAuthenticated) {
  if (user.role === "admin") {
    authedExtra = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Driver Console", href: "/driver-console" },
    ];
  }
  if (user.role === "driver") {
    authedExtra = [
      { label: "Driver Console", href: "/driver-console" },
    ];
  }
  // customers = no extra links
}


  // Secondary items: auth controls
  const secondaryItems = !isAuthenticated
    ? [
        { label: "Login", href: "/login", type: "link" },
        { label: "Sign Up", href: "/signup", type: "link" },
      ]
    : [
        {
          label: user?.name ? `Hi, ${user.name.split(" ")[0]}` : "Account",
          href: "/dashboard",
          type: "link",
        },
        { label: "Logout", href: "#logout", type: "logout" },
      ];

  // Move gooey highlight to a given element
  const moveEffectTo = (el) => {
    if (!el || !containerRef.current || !filterRef.current || !textRef.current)
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    const styles = {
      left: `${rect.left - containerRect.left}px`,
      top: `${rect.top - containerRect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    };

    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = el.innerText;
  };

  // On route change or auth change, snap highlight to active item
  useEffect(() => {
    if (!navRef.current) return;

    const active =
      navRef.current.querySelector('a[data-active="true"]') ||
      navRef.current.querySelector("a");

    if (active) {
      moveEffectTo(active);
    }
  }, [location.pathname, isAuthenticated, user]);

  const handleClick = (item, e) => {
    e.preventDefault();

    if (item.type === "logout") {
      logout();
      navigate("/login");
      return;
    }

    if (item.href && item.href !== "#") {
      navigate(item.href);
    }
  };

  const handleMouseEnter = (e) => {
    moveEffectTo(e.currentTarget);
  };

  const handleFocus = (e) => {
    moveEffectTo(e.currentTarget);
  };

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav className="gooey-nav" ref={navRef}>
        {/* Main (public) + authed items share the same gooey row */}
        <ul className="nav-list main">
          {[...mainItems, ...authedExtra].map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.label} className="nav-item">
                <a
                  href={item.href}
                  data-active={isActive ? "true" : undefined}
                  className="nav-link"
                  onClick={(e) => handleClick(item, e)}
                  onMouseEnter={handleMouseEnter}
                  onFocus={handleFocus}
                  tabIndex={0}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Auth controls inside gooey bar (login/signup or welcome/logout) */}
        <ul className="nav-list secondary">
          {secondaryItems.map((item) => {
            const isActive =
              item.type !== "logout" &&
              item.href !== "#logout" &&
              location.pathname.startsWith(item.href);

            return (
              <li key={item.label} className="nav-item secondary-item">
                <a
                  href={item.href}
                  data-active={isActive ? "true" : undefined}
                  className="nav-link"
                  onClick={(e) => handleClick(item, e)}
                  onMouseEnter={handleMouseEnter}
                  onFocus={handleFocus}
                  tabIndex={0}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Gooey highlight & text overlay */}
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
