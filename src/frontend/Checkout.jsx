import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../frontend/axios";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      await api.post("/checkout", { address, paymentMethod: "cash" });
      alert("✅ Order placed successfully!");
      navigate("/order-tracking");
    } catch {
      alert("❌ Checkout failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🚚 Checkout</h1>

      <input
        placeholder="Enter delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <br /><br />

      <button onClick={placeOrder}>
        ✅ Place Order
      </button>
    </div>
  );
}
