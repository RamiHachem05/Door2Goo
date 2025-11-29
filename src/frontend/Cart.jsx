// Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../frontend/axios";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const emitCartUpdate = () => {
    window.dispatchEvent(new Event("cart-updated")); // ✅ LIVE NAV UPDATE
  };

  useEffect(() => {
    api.get("/cart")
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeItem = async (productId) => {
    await api.post("/cart/remove", { productId });
    const res = await api.get("/cart");
    setCart(res.data);
    emitCartUpdate(); // ✅
  };

  const decreaseQty = async (productId) => {
    await api.post("/cart/decrease", { productId });
    const res = await api.get("/cart");
    setCart(res.data);
    emitCartUpdate(); // ✅
  };

  const increaseQty = async (productId) => {
    await api.post("/cart/add", { productId });
    const res = await api.get("/cart");
    setCart(res.data);
    emitCartUpdate(); // ✅
  };

  const total = cart?.items?.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );

  if (loading) return <h2 style={{ padding: 40 }}>Loading cart...</h2>;
  if (!cart || cart.items.length === 0)
    return <h2 style={{ padding: 40 }}>🛒 Cart is empty</h2>;

  return (
    <div className="page">
      <style>{`
        .page{min-height:100vh;background:#1a1a1f;color:#fff;padding:40px;}
        .grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fill,280px);}
        .card{width:280px;background:#20222a;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.15);}
        .thumb{height:170px;background:black;}
        .thumb img{width:100%;height:100%;object-fit:cover;}
        .body{padding:14px;}
        .title{font-size:16px;font-weight:800;}
        .row{display:flex;justify-content:space-between;margin-top:6px;}
        .btns{display:flex;gap:8px;margin-top:10px;}
        .btn{padding:8px 14px;border-radius:10px;font-weight:800;border:none;cursor:pointer;}
        .remove{background:#ff5c5c;color:white;}
        .minus{background:#ffb703;color:black;}
        .add{background:#4fa3ff;color:white;}
        .checkout{margin-top:30px;font-size:20px;}
      `}</style>

      <h1>🛒 Your Cart</h1>

      <div className="grid">
        {cart.items.map(i => (
          <div className="card" key={i.productId._id}>
            <div className="thumb">
              <img src={i.productId.image} alt={i.productId.name} />
            </div>

            <div className="body">
              <div className="title">{i.productId.name}</div>
              <div>{i.productId.category}</div>

              <div className="row">
                <b>${i.productId.price.toFixed(2)}</b>
                <b>Qty: {i.quantity}</b>
              </div>

              <div className="btns">
                <button className="btn remove" onClick={() => removeItem(i.productId._id)}>❌ Remove</button>
                <button className="btn minus" onClick={() => decreaseQty(i.productId._id)}>➖</button>
                <button className="btn add" onClick={() => increaseQty(i.productId._id)}>➕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout">
        <h2>Total: ${total.toFixed(2)}</h2>
        <button className="btn add" onClick={() => navigate("/checkout")}>
          ✅ Proceed To Checkout
        </button>
      </div>
    </div>
  );
}
