import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  return (
    <nav className="navbar">
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: rgba(22, 24, 34, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
        }

        .logo {
          font-size: 20px;
          font-weight: 900;
          color: #fff;
          text-decoration: none;
          margin-right: 20px;
        }

        /* Desktop Links */
        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-links a {
          color: #a5afc3;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: #fff;
        }

        .right-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .welcome {
          font-size: 13px;
          color: #fff;
        }

        .btn {
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }
        
        .btn.logout:hover { background: rgba(255, 100, 100, 0.2); }

        /* Hamburger Button (Mobile Only) */
        .hamburger {
          display: none;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
        }

        /* MOBILE STYLES */
        @media (max-width: 768px) {
          .nav-links {
            display: none; /* Hide normal links */
          }
          
          .hamburger {
            display: block; /* Show hamburger */
          }
          
          .welcome {
            display: none; /* Hide welcome text on tiny screens */
          }

          /* Mobile Dropdown */
          .mobile-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #161822;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            flex-direction: column;
            padding: 20px;
            gap: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }

          .mobile-menu a {
            color: #e7e9ff;
            text-decoration: none;
            font-size: 16px;
            font-weight: 600;
            padding: 10px;
            border-radius: 8px;
            background: rgba(255,255,255,0.03);
          }
        }
      `}</style>

      {/* LEFT SIDE: Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
        <Link to="/" className="logo" style={{marginLeft: 10}}>🚚 Door2Go</Link>
        
        {/* Desktop Links (Hidden on Mobile) */}
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/order-tracking">Tracking</Link>
          
          {isAuthenticated && user.role === "admin" && (
             <Link to="/driver-console">Driver Console</Link>
          )}
          {isAuthenticated && user.role === "driver" && (
             <Link to="/driver-console">Console</Link>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Auth Buttons */}
      <div className="right-section">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="welcome">Hi, {user?.name.split(' ')[0]}</span>
            <button className="btn logout" onClick={() => { logout(); navigate("/login"); }}>
              Logout
            </button>
          </>
        )}
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="mobile-menu" onClick={() => setIsOpen(false)}>
          <Link to="/home">Home</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/order-tracking">Order Tracking</Link>
          
          {isAuthenticated && (user.role === "admin" || user.role === "driver") && (
             <Link to="/driver-console">Driver Console</Link>
          )}
        </div>
      )}
    </nav>
  );
}