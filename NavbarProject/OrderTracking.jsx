// src/OrderTracking.jsx
import React, { useMemo, useState } from "react";

const MOCK_ORDERS = [
  {
    id: "1",
    title: "Groceries Express",
    status: "Out for Delivery",
    steps: ["Draft", "Confirmed", "Picked Up", "Out for Delivery", "Delivered"],
    eta: "Today · 4:10 PM",
    updatedAt: "3:02 PM",
    addressFrom: "Maliks Library, Hamra street",
    addressTo: "Block C, Hawala Building, Marlies Street",
    driver: { name: "Ahmad Koubeisi", plate: "M 986513", phone: "+961 71 234 567" },
    notes: "Handle perishables with care.",
  },
  {
    id: "2",
    title: "Pharmacy Run",
    status: "Picked Up",
    steps: ["Draft", "Confirmed", "Picked Up", "Out for Delivery", "Delivered"],
    eta: "Today · 5:25 PM",
    updatedAt: "2:47 PM",
    addressFrom: "Mazen Pharmacy, Msharafiyeh",
    addressTo: "Block A, Zalfa building, Tayouneh",
    driver: { name: "Marco Alonso", plate: "M 213546", phone: "+961 81 000 001" },
    notes: "Leave at reception.",
  },
  {
    id: "3",
    title: "Local Eats",
    status: "Delivered",
    steps: ["Draft", "Confirmed", "Picked Up", "Out for Delivery", "Delivered"],
    eta: "Today · 1:05 PM",
    updatedAt: "1:07 PM",
    addressFrom: "Farouj Chahine, Cornish Al Mazraa",
    addressTo: "Lau Upper Gate , Kraytem",
    driver: { name: "Lamin Yamal", plate: "M 698552", phone: "+961 03 213789" },
    notes: "Delivered to doorstep.",
  },
];

export default function OrderTracking() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  // If list empty, start with null; else first item
  const [active, setActive] = useState(MOCK_ORDERS.length ? MOCK_ORDERS[0] : null);

  const suggestions = useMemo(() => MOCK_ORDERS.map(o => o.id), []);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    const typed = (query || "").trim();
    if (!typed) {
      setError("Please enter your tracking ID.");
      return;
    }
    const found = MOCK_ORDERS.find(o => o.id.toLowerCase() === typed.toLowerCase());
    if (!found) {
      setError("We couldn't find that tracking ID. Try one of the examples below.");
      return;
    }
    setActive(found);
  };

  const setFromRecent = (id) => {
    setQuery(id);
    const found = MOCK_ORDERS.find(o => o.id === id);
    if (found) {
      setActive(found);
      setError("");
    }
  };

  const stepIndex = useMemo(() => {
    if (!active) return 0;
    const idx = active.steps.findIndex(s => s === active.status);
    return Math.max(0, idx);
  }, [active]);

  const progressPct = active ? (stepIndex / (active.steps.length - 1)) * 100 : 0;

  return (
    <div className="page">
      <style>{`
        :root{
          --bg:#1a1a1f; --card:#20222a; --text:#e7e9ff; --muted:#a5afc3;
          --glass: rgba(255,255,255,0.06); --glass-border: rgba(255,255,255,0.16);
          --accent:#9f4ef8; --accent2:#39a0ff; --accent3:#ff5cf0;
        }
        *{ box-sizing:border-box }
        .page{ min-height:100vh; background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
        .content{ padding-top:78px; }
        .wrap{ max-width:1200px; margin:0 auto; padding:18px 16px 40px; display:grid; gap:16px; }
        @media (min-width:1050px){ .wrap{ grid-template-columns:1.1fr 0.9fr; } }
        .title{ font-size:28px; font-weight:900; letter-spacing:.3px; }

        .searchbox{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; background:var(--glass); border:1px solid var(--glass-border); padding:10px; border-radius:14px; }
        .searchbox input{ flex:1; min-width:220px; background:transparent; border:none; outline:none; color:var(--text); font-size:14px; }
        .btn{ appearance:none; border:none; cursor:pointer; font-weight:800; padding:10px 14px; border-radius:12px; }
        .btn-primary{ color:#fff; background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3)); background-size:200% 200%; animation:gradientMove 6s ease infinite; box-shadow:0 8px 26px rgba(57,160,255,.25); }
        .error{ color:#ffb3b3; font-size:13px; margin-top:6px; }
        @keyframes gradientMove{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .panel{ background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65)); border:1px solid var(--glass-border); border-radius:18px; padding:18px; box-shadow:0 12px 36px rgba(0,0,0,.32); }
        .row{ display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
        .muted{ color:var(--muted) }

        .progress{ margin-top:12px; background:rgba(255,255,255,.08); height:10px; border-radius:999px; overflow:hidden; border:1px solid var(--glass-border); }
        .bar{ height:100%; width:0%; background:linear-gradient(90deg,var(--accent),var(--accent2)); transition: width .3s ease; }

        .timeline{ display:grid; gap:10px; margin-top:14px; grid-template-columns:1fr; }
        .step{ display:grid; grid-template-columns:24px 1fr; gap:10px; align-items:start; opacity:.7; }
        .step.active{ opacity:1; }
        .dot{ width:14px; height:14px; border-radius:50%; background:rgba(255,255,255,.35); box-shadow:0 0 0 3px rgba(255,255,255,.08) inset; margin-top:2px; }
        .step.active .dot{ background:linear-gradient(135deg,var(--accent),var(--accent2)); box-shadow:none; }
        .step h4{ margin:0 0 4px 0; font-size:14px }
        .step small{ color:var(--muted) }

        .gridR{ display:grid; gap:16px; }
        .card{ background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65)); border:1px solid var(--glass-border); border-radius:18px; padding:16px; box-shadow:0 12px 36px rgba(0,0,0,.32); }
        .eta{ font-size:22px; font-weight:900; background:linear-gradient(90deg,rgba(159,78,248,.25),rgba(57,160,255,.25)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .recent{ display:grid; gap:8px; }
        .pill{ display:flex; align-items:center; justify-content:space-between; gap:10px; background:rgba(255,255,255,.06); border:1px solid var(--glass-border); border-radius:12px; padding:10px 12px; cursor:pointer; }
        .pill:hover{ background:rgba(255,255,255,.10); }
        .id{ font-weight:800; }
        .status{ color:#ffd36b; font-weight:700; }
      `}</style>

      <div className="content">
        <div className="wrap">
          {/* LEFT: Tracker */}
          <section className="panel">
            <div className="title">Order Tracking</div>

            <form className="searchbox" onSubmit={onSubmit}>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                placeholder={`Enter tracking ID${suggestions[0] ? ` (e.g. ${suggestions[0]})` : ""}`}
                aria-label="Tracking ID"
              />
              <button className="btn btn-primary" type="submit">Track</button>
            </form>
            {error && <div className="error">{error}</div>}

            {active && (
              <>
                <div className="row" style={{ marginTop: 14 }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{active.title}</div>
                    <div className="muted">Tracking ID: {active.id}</div>
                  </div>
                  <div className="status">{active.status}</div>
                </div>

                <div className="progress">
                  <div className="bar" style={{ width: `${progressPct}%` }} />
                </div>

                <div className="timeline">
                  {active.steps.map((s, i) => (
                    <div key={s} className={`step ${i <= stepIndex ? "active" : ""}`}>
                      <div className="dot" />
                      <div>
                        <h4>{s}</h4>
                        {i === stepIndex && <small>Last update: {active.updatedAt}</small>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row" style={{ marginTop: 16 }}>
                  <div>
                    <div className="muted" style={{ fontSize: 12 }}>From</div>
                    <div style={{ fontWeight: 700 }}>{active.addressFrom}</div>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: 12, textAlign: "right" }}>To</div>
                    <div style={{ fontWeight: 700, textAlign: "right" }}>{active.addressTo}</div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* RIGHT: Details */}
          <aside className="gridR">
            <div className="card">
              <div className="muted">Estimated arrival</div>
              <div className="eta">{active?.eta || "—"}</div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Driver</div>
              <div className="muted">Name</div>
              <div style={{ fontWeight: 700 }}>{active?.driver?.name || "—"}</div>
              <div className="muted" style={{ marginTop: 8 }}>Vehicle</div>
              <div style={{ fontWeight: 700 }}>{active?.driver?.plate || "—"}</div>
              <div className="muted" style={{ marginTop: 8 }}>Phone</div>
              <div style={{ fontWeight: 700 }}>{active?.driver?.phone || "—"}</div>
              {active?.notes && (
                <>
                  <div className="muted" style={{ marginTop: 8 }}>Notes</div>
                  <div>{active.notes}</div>
                </>
              )}
            </div>

            <div className="card">
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Recent</div>
              <div className="recent">
                {MOCK_ORDERS.map((o) => (
                  <button key={o.id} className="pill" onClick={() => setFromRecent(o.id)}>
                    <span className="id">{o.id}</span>
                    <span className="status">{o.status}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
