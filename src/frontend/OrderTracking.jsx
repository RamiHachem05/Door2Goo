import React, { useEffect, useMemo, useState } from "react";
import api from "../frontend/axios";

// Map backend status to the pretty step labels
const STEP_LABELS = [
  "Draft",
  "Confirmed",
  "Picked Up",
  "Out for Delivery",
  "Delivered",
];

const STATUS_TO_STEP = {
  pending: "Draft",
  accepted: "Confirmed",
  preparing: "Picked Up",
  on_the_way: "Out for Delivery",
  delivered: "Delivered",
};

function formatTime(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatEta(eta, createdAt) {
  const base = eta || createdAt;
  if (!base) return "—";
  const d = new Date(base);
  const dayLabel = "Today";
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dayLabel} · ${time}`;
}

function toTrackingCode(order) {
  // short human-friendly ID like "AB12CD"
  return order._id.slice(-6).toUpperCase();
}

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  // 🔁 fetch orders (and poll every 15s)
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await api.get("/orders");
        if (!isMounted) return;
        setOrders(res.data || []);

        // If no active order yet, pick first
        if (!activeId && res.data && res.data.length > 0) {
          setActiveId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };

    load();

    const id = setInterval(load, 15000); // 15s polling
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [activeId]);

  // Convert raw order to the shape the UI expects
  const active = useMemo(() => {
    if (!orders.length || !activeId) return null;
    const order = orders.find((o) => o._id === activeId) || orders[0];

    const statusLabel = STATUS_TO_STEP[order.status] || "Draft";
    const stepIndex = Math.max(
      0,
      STEP_LABELS.findIndex((s) => s === statusLabel)
    );

    const trackingCode = toTrackingCode(order);

    // ✅ DRIVER INFO (Now populated from backend)
    const driver = order.driverId || {};
    const driverName = driver.name || "—";
    const driverPhone = driver.phone || "—";
    const driverVehicle = driver.vehicle || "—";

    const title =
      order.items && order.items.length
        ? `${order.items[0].productId?.name || "Door2Go Order"}`
        : "Door2Go Order";

    return {
      raw: order,
      id: order._id,
      trackingCode,
      title,
      statusLabel,
      stepIndex,
      steps: STEP_LABELS,
      etaText: formatEta(order.eta, order.createdAt),
      updatedAtText: formatTime(order.updatedAt),
      addressFrom: order.addressFrom || "Door2Go Fulfillment Hub",
      addressTo: order.address || "—",
      driver: {
        name: driverName,
        phone: driverPhone,
        vehicle: driverVehicle,
      },
      notes: `Total items: ${order.items?.length || 0} · Total: $${order.totalPrice.toFixed(
        2
      )}`,
    };
  }, [orders, activeId]);

  const suggestions = useMemo(
    () => orders.map((o) => toTrackingCode(o)),
    [orders]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    const typed = (query || "").trim().toUpperCase();
    if (!typed) {
      setError("Please enter your tracking ID.");
      return;
    }

    // Match on short tracking code OR full _id
    const found = orders.find(
      (o) =>
        toTrackingCode(o) === typed ||
        o._id.toUpperCase().endsWith(typed) ||
        o._id.toUpperCase() === typed
    );

    if (!found) {
      setError(
        "We couldn't find that tracking ID. Try one of the recent ones below."
      );
      return;
    }

    setActiveId(found._id);
  };

  const setFromRecent = (orderId) => {
    const ord = orders.find((o) => o._id === orderId);
    if (!ord) return;
    setActiveId(orderId);
    setQuery(toTrackingCode(ord));
    setError("");
  };

  const progressPct = active
    ? (active.stepIndex / (active.steps.length - 1)) * 100
    : 0;

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
        .bar{ height:100%; background:linear-gradient(90deg,var(--accent),var(--accent2)); transition: width .3s ease; }

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
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                }}
                placeholder={
                  suggestions[0]
                    ? `Enter tracking ID (e.g. ${suggestions[0]})`
                    : "Enter tracking ID"
                }
                aria-label="Tracking ID"
              />
              <button className="btn btn-primary" type="submit">
                Track
              </button>
            </form>
            {error && <div className="error">{error}</div>}

            {active && (
              <>
                <div className="row" style={{ marginTop: 14 }}>
                  <div style={{ width: "100%" }}>
                    <div className="muted" style={{ marginBottom: 8 }}>
                      Tracking ID: {active.trackingCode}
                    </div>

                    {/* ITEMS LIST */}
                    <div style={{ marginTop: 6 }}>
                      {active.raw.items?.map((item) => (
                        <div
                          key={item.productId?._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: 14,
                            marginBottom: 6,
                            opacity: 0.95
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {item.productId?.image && (
                                <img
                                src={item.productId?.image}
                                alt={item.productId?.name}
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    objectFit: "cover",
                                    border: "1px solid rgba(255,255,255,0.15)"
                                }}
                                />
                            )}
                            <span>
                              {item.productId?.name} × {item.quantity}
                            </span>
                          </div>
                          <span>
                            ${(item.productId?.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="status" style={{color:'#ffd36b'}}>{active.statusLabel}</div>
                </div>

                <div className="progress">
                  <div
                    className="bar"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="timeline">
                  {active.steps.map((s, i) => (
                    <div
                      key={s}
                      className={`step ${i <= active.stepIndex ? "active" : ""}`}
                    >
                      <div className="dot" />
                      <div>
                        <h4>{s}</h4>
                        {i === active.stepIndex && (
                          <small>Last update: {active.updatedAtText}</small>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row" style={{ marginTop: 16 }}>
                  <div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      From
                    </div>
                    <div style={{ fontWeight: 700 }}>{active.addressFrom}</div>
                  </div>
                  <div>
                    <div
                      className="muted"
                      style={{ fontSize: 12, textAlign: "right" }}
                    >
                      To
                    </div>
                    <div
                      style={{ fontWeight: 700, textAlign: "right" }}
                    >
                      {active.addressTo}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* RIGHT: Details */}
          <aside className="gridR">
            <div className="card">
              <div className="muted">Estimated arrival</div>
              <div className="eta">{active?.etaText || "—"}</div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Driver</div>
              <div className="muted">Name</div>
              <div style={{ fontWeight: 700 }}>
                {active?.driver?.name || "—"}
              </div>
              <div className="muted" style={{ marginTop: 8 }}>
                Vehicle
              </div>
              <div style={{ fontWeight: 700 }}>
                {active?.driver?.vehicle || "—"}
              </div>
              <div className="muted" style={{ marginTop: 8 }}>
                Phone
              </div>
              <div style={{ fontWeight: 700 }}>
                {active?.driver?.phone || "—"}
              </div>
              {active?.notes && (
                <>
                  <div className="muted" style={{ marginTop: 8 }}>
                    Notes
                  </div>
                  <div>{active.notes}</div>
                </>
              )}
            </div>

            <div className="card">
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Recent</div>
              <div className="recent">
                {orders.map((o) => {
                  const code = toTrackingCode(o);
                  const label = STATUS_TO_STEP[o.status] || "Draft";
                  return (
                    <button
                      key={o._id}
                      className="pill"
                      onClick={() => setFromRecent(o._id)}
                    >
                      <span className="id">{code}</span>
                      <span className="status">{label}</span>
                    </button>
                  );
                })}
                {orders.length === 0 && (
                  <div className="muted">No orders yet.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}