import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { Navigate } from "react-router-dom";
import api from "../frontend/axios";

export default function DriverConsole() {
  const { user } = useAuth();
  
  // Two modes: 'mine' (active deliveries) or 'pool' (available to pick up)
  const [tab, setTab] = useState("mine"); 
  
  const [myOrders, setMyOrders] = useState([]);
  const [poolOrders, setPoolOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Data
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load my active tasks
      const mineRes = await api.get("/orders/driver-active");
      setMyOrders(mineRes.data || []);

      // 2. Load available pool
      const poolRes = await api.get("/orders/pool");
      setPoolOrders(poolRes.data || []);

      // If we have an active order selected, refresh it from the new list
      if (activeOrder) {
        const found = mineRes.data.find(o => o._id === activeOrder._id) || 
                      poolRes.data.find(o => o._id === activeOrder._id);
        if (found) setActiveOrder(found);
      }
    } catch (err) {
      console.error("Failed to load driver data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "driver") {
      loadData();
      const interval = setInterval(loadData, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  // Actions
  const handleAcceptOrder = async (orderId) => {
    if (!confirm("Accept this order and start delivery?")) return;
    try {
      await api.patch(`/orders/${orderId}/status`, { status: "on_the_way" });
      setTab("mine"); // Switch to my tab
      loadData();
    } catch (err) {
      alert("Failed to accept order");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      loadData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (user.role !== "driver" && user.role !== "admin")
    return <Navigate to="/home" replace />;

  // Decide which list to show
  const listToShow = tab === "mine" ? myOrders : poolOrders;

  return (
    <div className="page">
      <style>{`
        :root {
          --bg:#1a1a1f; --card:#20222a; --text:#e7e9ff; --muted:#a5afc3;
          --glass: rgba(255,255,255,0.06); --glass-border: rgba(255,255,255,0.16);
          --accent:#9f4ef8; --accent2:#39a0ff; --accent3:#ff5cf0;
        }
        *{ box-sizing:border-box }
        .page { min-height:100vh; background:var(--bg); color:var(--text); font-family:system-ui; }
        .content { padding-top:78px; display:flex; flex-direction:column; align-items:center; min-height:100vh; }
        .grid { width:100%; max-width:1400px; display:grid; grid-template-columns:1.1fr 0.9fr; gap:20px; padding:16px; }
        @media (max-width:1000px){ .grid{ grid-template-columns:1fr; } }
        
        .card { background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65)); border:1px solid var(--glass-border); border-radius:18px; padding:20px; box-shadow:0 12px 36px rgba(0,0,0,.32); min-height: 500px; }
        
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .title { font-size:24px; font-weight:900; }
        
        /* Tabs */
        .tabs { display:flex; gap:10px; background:rgba(0,0,0,0.2); padding:4px; border-radius:12px; margin-bottom:16px; }
        .tab { flex:1; border:none; background:transparent; color:var(--muted); padding:10px; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s; }
        .tab.active { background:var(--glass-border); color:white; shadow:0 2px 10px rgba(0,0,0,0.2); }

        .list { display:flex; flex-direction:column; gap:12px; max-height:600px; overflow-y:auto; }
        .item { background:var(--glass); border:1px solid var(--glass-border); padding:16px; border-radius:14px; cursor:pointer; transition:all .2s; }
        .item:hover { background:rgba(255,255,255,0.1); }
        .item.active { background:linear-gradient(135deg,var(--accent),var(--accent2)); border-color:transparent; }
        .item.active * { color: white !important; }

        .item-header { display:flex; justify-content:space-between; margin-bottom:6px; }
        .id { font-weight:800; font-size:14px; }
        .status-badge { font-size:11px; font-weight:700; padding:4px 8px; border-radius:6px; background:rgba(0,0,0,0.3); color:#ffd36b; text-transform:uppercase; }

        .detail-row { display:flex; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px; }
        .label { font-size:11px; color:var(--muted); text-transform:uppercase; margin-bottom:4px; }
        .val { font-size:15px; font-weight:600; }
        
        .btn { width:100%; padding:14px; border:none; border-radius:12px; font-weight:700; cursor:pointer; margin-top:10px; font-size:14px; }
        .btn-primary { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:white; }
        .btn-success { background:linear-gradient(135deg, #16BF78, #34D399); color:white; }

        .empty { padding:40px; text-align:center; color:var(--muted); font-style:italic; }
      `}</style>

      <div className="content">
        <div className="grid">
          
          {/* LEFT PANEL: LIST */}
          <section className="card">
            <div className="header">
              <div className="title">Driver Console</div>
              <div style={{fontSize:12, color:'var(--muted)'}}>
                {currentTime.toLocaleTimeString()}
              </div>
            </div>

            <div className="tabs">
              <button 
                className={`tab ${tab === 'mine' ? 'active' : ''}`}
                onClick={() => setTab('mine')}
              >
                My Tasks ({myOrders.length})
              </button>
              <button 
                className={`tab ${tab === 'pool' ? 'active' : ''}`}
                onClick={() => setTab('pool')}
              >
                Find Orders ({poolOrders.length})
              </button>
            </div>

            <div className="list">
              {listToShow.length === 0 && (
                <div className="empty">No orders found in this category.</div>
              )}
              {listToShow.map((o) => (
                <div 
                  key={o._id} 
                  className={`item ${activeOrder?._id === o._id ? 'active' : ''}`}
                  onClick={() => setActiveOrder(o)}
                >
                  <div className="item-header">
                    <div className="id">#{o._id.slice(-6).toUpperCase()}</div>
                    <div className="status-badge">{o.status.replace(/_/g, " ")}</div>
                  </div>
                  <div style={{fontSize:13, marginBottom:4}}>
                    {o.items?.length} Item(s) • Total: ${o.totalPrice}
                  </div>
                  <div style={{fontSize:13, opacity:0.7}}>
                    {o.address || "No Address"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT PANEL: DETAILS */}
          <section className="card">
            <div className="header">
              <div className="title">Order Details</div>
            </div>

            {activeOrder ? (
              <div>
                <div className="detail-row">
                  <div>
                    <div className="label">Customer Name</div>
                    <div className="val">{activeOrder.userId?.name || "Guest"}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="label">Phone</div>
                    <div className="val">{activeOrder.userId?.phone || "—"}</div>
                  </div>
                </div>

                <div className="detail-row">
                  <div>
                    <div className="label">Delivery Address</div>
                    <div className="val">{activeOrder.address}</div>
                  </div>
                </div>

                <div className="detail-row">
                  <div>
                    <div className="label">Items</div>
                    <div className="val">
                      {activeOrder.items?.map((i, idx) => (
                        <div key={idx}>
                          {i.quantity} x {i.productId?.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="label">Total Value</div>
                    <div className="val">${activeOrder.totalPrice.toFixed(2)}</div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div style={{marginTop:30}}>
                  {tab === 'pool' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAcceptOrder(activeOrder._id)}
                    >
                      🚀 Accept & Pick Up Order
                    </button>
                  )}

                  {tab === 'mine' && (
                    <>
                       {activeOrder.status !== 'delivered' && (
                          <button 
                            className="btn btn-success"
                            onClick={() => handleUpdateStatus(activeOrder._id, 'delivered')}
                          >
                            ✅ Mark as Delivered
                          </button>
                       )}
                       {activeOrder.status === 'delivered' && (
                         <div style={{textAlign:'center', color:'#4cd964', fontWeight:700, marginTop:10}}>
                           Order Completed!
                         </div>
                       )}
                    </>
                  )}
                </div>

              </div>
            ) : (
               <div className="empty">Select an order from the list to view details.</div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}