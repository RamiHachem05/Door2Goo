import React, { useEffect, useState } from "react";
import api from "../frontend/axios";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders")
      .then(res => setOrders(res.data))
      .catch(() => alert("❌ Failed to load orders"));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>📦 My Orders</h1>

      {orders.map(order => (
        <div key={order._id} style={{ marginBottom: 20 }}>
          <h3>Status: {order.status}</h3>
          <p>Address: {order.address}</p>
          <p>Total: ${order.totalPrice.toFixed(2)}</p>

          {order.items.map(i => (
            <div key={i.productId._id}>
              {i.productId.name} × {i.quantity}
            </div>
          ))}

          <hr />
        </div>
      ))}
    </div>
  );
}
