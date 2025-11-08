// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout.jsx";
import Checkout from "./NavbarProject/Checkout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";


import GetStarted from "./GetStarted.jsx";
import Home from "./NavbarProject/home.jsx";
import Catalog from "./NavbarProject/Catalog.jsx";
import OrderTracking from "./NavbarProject/OrderTracking.jsx";
import Details from "./NavbarProject/Details.jsx"; 
import About from "./about.jsx";

// App pages
import ContactUs from "./NavbarProject/ContactUs.jsx";
import Dashboard from "./NavbarProject/Dashboard.jsx";
import DriverConsole from "./NavbarProject/DriverConsole.jsx";
import Login from "./NavbarProject/Login.jsx";
import Signup from "./NavbarProject/Signup.jsx";
import { AuthProvider } from "./AuthContext.jsx";


export default function App() {
  return (
    <Routes>
      {/* Landing (no navbar) */}
      <Route path="/" element={<GetStarted />} />
      <Route path="/about" element={<About />} />

      {/* App pages with navbar */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver-console" element={<DriverConsole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Details page (must be inside Layout) */}
        <Route path="/details/:id" element={<Details />} />
      </Route>

      {/* Fallbacks */}
      <Route path="/get-started" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
