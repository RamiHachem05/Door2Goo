import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import api from "../frontend/axios";
import "./GooeyNav.css";

const GooeyNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartBump, setCartBump] = useState(false);

  // ✅ FETCH CART COUNT (AUTH + ROUTE SAFE)
  useEffect(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        const total =
          res.data?.items?.length || 0;
        setCartCount(total);
      } catch (err) {
        console.error("❌ Cart fetch failed:", err);
        setCartCount(0);
      }
    };

    fetchCart();
  }, [isAuthenticated, location.pathname]);

  // ✅ LISTEN TO LIVE CART UPDATES (NO REFRESH REQUIRED)
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.get("/cart");
        const total =
          res.data?.items?.length || 0;
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  // ✅ BADGE BUMP ANIMATION
  useEffect(() => {
    if (!cartCount) return;
    setCartBump(true);
    const t = setTimeout(() => setCartBump(false), 600);
    return () => clearTimeout(t);
  }, [cartCount]);

  const mainItems = [
    { label: "Home", href: "/home" },
    { label: "Catalog", href: "/catalog" },
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "About Us", href: "/about" },
  ];

  let authedExtra = [];

  if (isAuthenticated && user?.role === "customer") {
    authedExtra = [{ type: "cart", href: "/cart" }];
  }

  if (isAuthenticated && user?.role === "admin") {
    authedExtra = [
      { label: "Dashboard", href: "/dashboard" },
      { type: "cart", href: "/cart" },
      { label: "Driver Console", href: "/driver-console" },
    ];
  }

  if (isAuthenticated && user?.role === "driver") {
    authedExtra = [{ label: "Driver Console", href: "/driver-console" }];
  }

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

  useEffect(() => {
    if (!navRef.current) return;

    const active =
      navRef.current.querySelector('a[data-active="true"]') ||
      navRef.current.querySelector("a");

    if (active) moveEffectTo(active);
  }, [location.pathname, isAuthenticated, cartCount]);

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

  const renderLinkContent = (item) => {
    if (item.type === "cart") {
      return (
        <>
          <span className="cart-icon">🛒</span>
          <span className="cart-label">Cart</span>

          {cartCount > 0 && (
            <span
              className={`cart-badge ${
                cartBump ? "cart-badge-bump" : ""
              }`}
            >
              {cartCount}
            </span>
          )}
        </>
      );
    }

    return item.label;
  };

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav className="gooey-nav" ref={navRef}>
        <ul className="nav-list main">
          {[...mainItems, ...authedExtra].map((item) => {
            const href = item.href;
            const isActive = location.pathname.startsWith(href);
            const isCart = item.type === "cart";

            return (
              <li key={item.label || href} className="nav-item">
                <a
                  href={href}
                  data-active={isActive ? "true" : undefined}
                  className={`nav-link ${isCart ? "cart-link" : ""}`}
                  onClick={(e) => handleClick(item, e)}
                >
                  {renderLinkContent(item)}
                </a>
              </li>
            );
          })}
        </ul>

        <ul className="nav-list secondary">
          {secondaryItems.map((item) => {
            const isActive =
              item.type !== "logout" &&
              item.href !== "#logout" &&
              location.pathname.startsWith(item.href);

            return (
              <li key={item.label} className="nav-item secondary-item auth-link">
                <a
                  href={item.href}
                  data-active={isActive ? "true" : undefined}
                  className="nav-link"
                  onClick={(e) => handleClick(item, e)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
