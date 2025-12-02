import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../frontend/axios";
import ElectricBorder from "./ElectricBorder";
import PlaceOrderButton from "../Components/PlaceOrderButton";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);

  // Called when the truck animation finishes (approx 10s)
  const handleAnimationComplete = async () => {
    try {
      setIsPlacing(true);
      await api.post("/checkout", { address, paymentMethod: "cash" });
      // Short delay to let the user see the "Placed" state
      setTimeout(() => {
        alert("✅ Order placed successfully!");
        navigate("/order-tracking");
      }, 500);
    } catch (err) {
      console.error(err);
      alert("❌ Checkout failed");
      setIsPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <style>{`
        :root {
          --bg: #0f0f15;
          --panel: #161822;
          --text: #e7e9ff;
          --muted: #a5afc3;
          --line: rgba(255,255,255,0.12);
          --accent: #7df9ff; 
        }

        * { box-sizing: border-box; }

        .checkout-page {
          min-height: 100vh;
          color: var(--text);
          font-family: system-ui, -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(1200px 600px at 50% -20%, rgba(125, 249, 255, 0.15), transparent 60%),
            var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .checkout-card {
          width: 100%;
          max-width: 500px;
          background: linear-gradient(180deg, rgba(22,24,34,0.95), rgba(22,24,34,0.85));
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .checkout-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(to right, #fff, #a5afc3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .checkout-subtitle {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 30px;
        }

        .input-group {
          text-align: left;
          margin-bottom: 30px;
        }

        .input-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          margin-bottom: 8px;
          display: block;
        }

        .styled-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 16px;
          color: var(--text);
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .styled-input:focus {
          border-color: var(--accent);
          background: rgba(125, 249, 255, 0.05);
        }

        .button-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ElectricBorder color="#7df9ff" speed={2} thickness={2}>
          <div className="checkout-card">
            <div className="checkout-title">Checkout</div>
            <div className="checkout-subtitle">
              Enter your details to complete the delivery.
            </div>

            <div className="input-group">
              <label className="input-label">Delivery Address</label>
              <input
                className="styled-input"
                placeholder="e.g. Beirut, Hamra St, Bldg 4..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="button-wrapper">
              <PlaceOrderButton onComplete={handleAnimationComplete} />
            </div>
          </div>
        </ElectricBorder>
      </motion.div>
    </div>
  );
}