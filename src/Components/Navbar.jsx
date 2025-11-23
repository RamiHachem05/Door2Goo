import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/" className="logo">🚚 Door2Go</Link>

        <Link to="/home">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/order-tracking">Order Tracking</Link>

        {/* Role-based navigation */}
{isAuthenticated && (
  <>
    {user.role === "admin" && (
      <>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/driver-console">Driver Console</Link>
      </>
    )}

    {user.role === "driver" && (
      <Link to="/driver-console">Driver Console</Link>
    )}

    {/* customers → no extra links */}
  </>
)}

      </div>

      <div className="right">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="welcome">Welcome, {user?.name}</span>
            <button
              className="btn logout"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}