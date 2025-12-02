// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import GetStarted from "./GetStarted.jsx";
import Home from "./frontend/home.jsx";
import Catalog from "./frontend/Catalog.jsx";
import OrderTracking from "./frontend/OrderTracking.jsx";
import Details from "./frontend/Details.jsx";
import About from "./about.jsx";

import ContactUs from "./frontend/ContactUs.jsx";
import Dashboard from "./frontend/Dashboard.jsx";
import DriverConsole from "./frontend/DriverConsole.jsx";
import Login from "./frontend/Login.jsx";
import Signup from "./frontend/Signup.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import Profile from "./frontend/Profile.jsx";

import Cart from "./frontend/Cart.jsx";
import Checkout from "./frontend/Checkout.jsx";

export default function App() {
  return (
    <AuthProvider>
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

          {/* Protected routes */}
          {/* Protected routes with roles */}
         <Route
          path="/dashboard"
            element={
           <ProtectedRoute roles={['admin']}>
           <Dashboard />
           </ProtectedRoute>
                         }
                          />
             <Route
  path="/cart"
  element={
    <ProtectedRoute roles={["customer"]}>
      <Cart />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute roles={["customer", "admin", "driver"]}>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/checkout"
  element={
    <ProtectedRoute roles={["customer"]}>
      <Checkout />
    </ProtectedRoute>
  }
/>
             

             <Route
             path="/driver-console"
            element={
            <ProtectedRoute roles={['driver', 'admin']}>
            <DriverConsole />
              </ProtectedRoute>
                }
                    />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Details page */}
          <Route path="/details/:id" element={<Details />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/get-started" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
