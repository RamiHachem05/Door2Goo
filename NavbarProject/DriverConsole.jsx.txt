// src/DriverConsole.jsx
import React, { useState, useEffect } from "react";

const MOCK_DELIVERIES = [
  { 
    id: "D2G-78421", 
    customer: "John Smith", 
    status: "Out for Delivery", 
    address: "221B Baker St, Beirut", 
    eta: "4:10 PM",
    distance: "2.3 km",
    phone: "+961 76 123 456",
    notes: "Leave at front desk if not home",
    value: "$45.99",
    items: 3
  },
  { 
    id: "D2G-55203", 
    customer: "Sarah Lee", 
    status: "Picked Up", 
    address: "10 Downing St, Hamra", 
    eta: "5:25 PM",
    distance: "5.1 km",
    phone: "+961 76 234 567",
    notes: "Fragile items - handle with care",
    value: "$89.50",
    items: 5
  },
  { 
    id: "D2G-33880", 
    customer: "Ahmed K.", 
    status: "Delivered", 
    address: "12 Fleet St, Verdun", 
    eta: "1:07 PM",
    distance: "0 km",
    phone: "+961 76 345 678",
    notes: "Building has elevator",
    value: "$32.25",
    items: 2
  },
];

export default function DriverConsole() {
  const [active, setActive] = useState(MOCK_DELIVERIES[0]);
  const [time, setTime] = useState(new Date());
  const [progress, setProgress] = useState(65);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = (newStatus) => {
    setActive(prev => ({ ...prev, status: newStatus }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Out for Delivery': return '#ffd36b';
      case 'Picked Up': return '#39a0ff';
      case 'Delivered': return '#4cd964';
      default: return '#a5afc3';
    }
  };

  return (
    <div className="page">
      <style>{`
        :root {
          --bg:#1a1a1f;
          --card:#20222a;
          --text:#e7e9ff;
          --muted:#a5afc3;
          --glass: rgba(255,255,255,0.06);
          --glass-border: rgba(255,255,255,0.16);
          --accent:#9f4ef8;
          --accent2:#39a0ff;
          --accent3:#ff5cf0;
        }
        *{ box-sizing:border-box }
        .page {
          min-height:100vh;
          background:var(--bg);
          color:var(--text);
          font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
        }
        .content {
          padding-top:78px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          min-height:calc(100vh - 78px);
        }

        .grid {
          width:100%;
          max-width:1400px;
          display:grid;
          grid-template-columns:1.1fr 0.9fr;
          gap:20px;
          padding:16px;
        }
        @media (max-width:1000px){
          .grid{ grid-template-columns:1fr; }
        }

        .card {
          background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65));
          border:1px solid var(--glass-border);
          border-radius:18px;
          box-shadow:0 12px 36px rgba(0,0,0,.32);
          padding:20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .title {
          font-size:24px;
          font-weight:900;
          margin:0;
        }

        .online-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(76, 217, 100, 0.1);
          border: 1px solid rgba(76, 217, 100, 0.3);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4cd964;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* left panel */
        .list {
          display:flex;
          flex-direction:column;
          gap:12px;
        }
        .item {
          background:var(--glass);
          border:1px solid var(--glass-border);
          padding:16px;
          border-radius:14px;
          cursor:pointer;
          transition:all .2s ease;
          position: relative;
        }
        .item:hover { 
          background:rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }
        .item.active {
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          border-color: rgba(159, 78, 248, 0.4);
        }
        .item.active .id,
        .item.active .customer,
        .item.active .status { color:#fff; }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .id {
          font-weight:900;
          font-size:14px;
        }
        .customer {
          font-size:16px;
          font-weight: 600;
          color:var(--text);
          margin-bottom: 4px;
        }
        .address {
          font-size:13px;
          color:var(--muted);
          margin-bottom: 8px;
        }
        .status {
          color:#ffd36b;
          font-weight:700;
          font-size: 12px;
          background: rgba(255, 211, 107, 0.1);
          padding: 4px 8px;
          border-radius: 8px;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--muted);
        }

        /* right panel */
        .delivery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .delivery-id {
          font-size: 18px;
          font-weight: 900;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .info-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px;
        }

        .info-label {
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
        }

        .route-visual {
          height: 120px;
          border-radius: 14px;
          border: 1px solid var(--glass-border);
          margin: 20px 0;
          background:
            radial-gradient(400px 250px at 20% 20%, rgba(159,78,248,.10), transparent 60%),
            radial-gradient(400px 250px at 80% 40%, rgba(57,160,255,.10), transparent 60%),
            radial-gradient(400px 250px at 50% 80%, rgba(255,92,240,.08), transparent 60%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .route-path {
          position: absolute;
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent2), transparent);
          top: 50%;
          transform: translateY(-50%);
        }

        .route-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          top: 50%;
          transform: translateY(-50%);
          animation: moveDot 3s ease-in-out infinite;
        }

        @keyframes moveDot {
          0% { left: 10%; background: var(--accent); }
          50% { left: 50%; background: var(--accent2); }
          100% { left: 90%; background: var(--accent3); }
        }

        .progress-section {
          margin: 20px 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .stats {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:12px;
          margin:20px 0;
        }
        .stat {
          background:rgba(255,255,255,0.06);
          border:1px solid var(--glass-border);
          border-radius:12px;
          padding:16px;
          text-align:center;
        }
        .stat h3 {
          margin:0;
          font-size:20px;
          font-weight:900;
          background:linear-gradient(90deg,var(--accent),var(--accent2));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .stat p {
          margin:0;
          color:var(--muted);
          font-size:12px;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 20px;
        }

        .btn {
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          color:#fff;
        }
        .btn-primary:hover {
          transform:translateY(-1px);
          box-shadow: 0 8px 25px rgba(159, 78, 248, 0.3);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.08);
          border: 1px solid var(--glass-border);
          color: var(--text);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.12);
          transform:translateY(-1px);
        }

        .time-display {
          text-align: center;
          color: var(--muted);
          font-size: 12px;
          margin-top: 10px;
        }
      `}</style>

      <div className="content">
        <div className="grid">
          {/* LEFT PANEL */}
          <section className="card">
            <div className="header">
              <div className="title">Active Deliveries</div>
              <div className="online-status">
                <div className="status-dot"></div>
                ONLINE
              </div>
            </div>
            <div className="list">
              {MOCK_DELIVERIES.map((d) => (
                <div
                  key={d.id}
                  className={`item ${active.id === d.id ? "active" : ""}`}
                  onClick={() => setActive(d)}
                >
                  <div className="item-header">
                    <div>
                      <div className="id">{d.id}</div>
                      <div className="customer">{d.customer}</div>
                      <div className="address">{d.address}</div>
                    </div>
                    <div className="status" style={{color: getStatusColor(d.status)}}>
                      {d.status}
                    </div>
                  </div>
                  <div className="item-footer">
                    <span>ETA: {d.eta}</span>
                    <span>{d.distance} • {d.items} items</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="card">
            <div className="delivery-header">
              <div className="title">Delivery Details</div>
              <div className="delivery-id">{active.id}</div>
            </div>
            
            {active ? (
              <div className="info">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Customer</div>
                    <div className="info-value">{active.customer}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Phone</div>
                    <div className="info-value">{active.phone}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Status</div>
                    <div className="info-value" style={{color: getStatusColor(active.status)}}>
                      {active.status}
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Order Value</div>
                    <div className="info-value">{active.value}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Delivery Address</div>
                  <div className="info-value">{active.address}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">Customer Notes</div>
                  <div className="info-value">{active.notes}</div>
                </div>

                

                <div className="progress-section">
                  <div className="progress-header">
                    <span>Route Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${progress}%`}}></div>
                  </div>
                </div>

                <div className="stats">
                  <div className="stat">
                    <h3>12</h3>
                    <p>Today's Deliveries</p>
                  </div>
                  <div className="stat">
                    <h3>96%</h3>
                    <p>On-Time Rate</p>
                  </div>
                  <div className="stat">
                    <h3>4.9★</h3>
                    <p>Rating</p>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn btn-secondary" onClick={() => updateStatus('Picked Up')}>
                    Mark Picked Up
                  </button>
                  <button className="btn btn-primary" onClick={() => updateStatus('Delivered')}>
                    Mark Delivered
                  </button>
                </div>

                <div className="time-display">
                  Current Time: {time.toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <p className="muted">Select a delivery from the left panel.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}