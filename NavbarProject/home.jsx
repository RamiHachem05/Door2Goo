// src/home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const go = (path) => navigate(path);

  return (
    <div className="page">
      <style>{`
        :root{
          --bg:#1a1a1f;
          --card:#20222a;
          --text:#e7e9ff;
          --muted:#a5afc3;
          --accent:#9f4ef8;     /* purple */
          --accent2:#39a0ff;    /* blue   */
          --accent3:#ff5cf0;    /* pink   */
          --glass-border: rgba(255,255,255,0.16);
        }

        *{ box-sizing:border-box; }
        .page{
          min-height:100vh;
          background:var(--bg);
          color:var(--text);
          font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
          position:relative;
          overflow-x:hidden;
        }

        /* subtle background glow */
        .bg-glow{
          position:absolute; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(900px 400px at 15% 15%, rgba(159,78,248,.12), transparent 60%),
            radial-gradient(900px 500px at 85% 40%, rgba(57,160,255,.12), transparent 60%),
            radial-gradient(700px 380px at 50% 90%, rgba(255,92,240,.10), transparent 60%);
          filter:saturate(120%);
        }

        /* leave space for sticky GooeyNav in Layout */
        .content{
          position:relative; z-index:1;
          padding-top: 78px;
        }

        /* HERO */
        .hero{
          max-width:1200px; margin:0 auto; padding:60px 16px 32px;
          display:flex; flex-direction:column; align-items:center; text-align:center; gap:14px;
        }
        .hero h1{
          margin:0; font-weight:900; letter-spacing:.4px; line-height:1.15;
          font-size: clamp(30px, 6vw, 56px);
          text-shadow:0 10px 35px rgba(0,0,0,.45);
        }
        .hero p{
          margin:0; opacity:.9; font-size: clamp(14px, 2.4vw, 18px)
        }

        .hero-buttons{
          display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:10px
        }

        .btn{
          appearance:none; border:none; cursor:pointer; font-weight:800;
          border-radius:999px; padding:12px 22px; transition:transform .15s ease, box-shadow .15s ease, filter .15s ease;
        }
        .btn:active{ transform:translateY(0); filter:brightness(.98); }

        .btn-white{
          background:#fff; color:#111;
          box-shadow:0 8px 26px rgba(0,0,0,.28);
        }
        .btn-white:hover{ transform:translateY(-1px); }

        .btn-glass{
          background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.95);
          border:1px solid var(--glass-border);
          backdrop-filter:blur(6px);
          box-shadow:0 10px 30px rgba(0,0,0,.25);
        }
        .btn-glass:hover{ transform:translateY(-1px); background:rgba(255,255,255,0.10); }

        /* FEATURES */
        .features{
          max-width:1200px; margin:28px auto; padding:0 16px;
          display:grid; gap:16px; grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
        }
        .card{
          background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65));
          border:1px solid var(--glass-border); border-radius:18px; padding:18px;
          box-shadow:0 12px 36px rgba(0,0,0,.32);
        }
        .card h3{ margin:0 0 8px 0; font-size:18px }
        .muted{ color:var(--muted) }

        /* CTA banner (optional) */
        .cta{
          max-width:1200px; margin:36px auto 8px; padding:16px;
        }
        .cta-box{
          border:1px solid var(--glass-border); border-radius:18px; padding:18px 20px;
          background:linear-gradient(90deg, rgba(159,78,248,.09), rgba(57,160,255,.09));
          display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
        }
        .cta-title{ font-weight:800; font-size:18px; }
        .cta-action{
          background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));
          color:#fff; border:none; border-radius:999px; padding:10px 18px; font-weight:800;
          box-shadow:0 0 20px rgba(159,78,248,.35);
        }
        .cta-action:hover{ transform:translateY(-1px); filter:brightness(1.05); }
      `}</style>

      {/* background glows */}
      <div className="bg-glow" />

      <div className="content">
        {/* HERO */}
        <header className="hero">
          <h1>DOOR2GO — TO YOUR SERVICE</h1>
          <p>Where Quality Meets Speed</p>
          <div className="hero-buttons">
            <button className="btn btn-white" onClick={() => go("/catalog")}>
              Shop Now
            </button>
            <button className="btn btn-glass" onClick={() => go("/order-tracking")}>
              Track an Order
            </button>
          </div>
        </header>

        {/* FEATURES */}
        <section className="features">
          <article className="card">
            <h3>Fast Delivery</h3>
            <p className="muted">Same-day and VIP (2–3 hours) options with live ETAs.</p>
          </article>
          <article className="card">
            <h3>Nationwide Coverage</h3>
            <p className="muted">From local stores to international shipping.</p>
          </article>
          <article className="card">
            <h3>Driver Console</h3>
            <p className="muted">Dedicated app for drivers with optimized routing.</p>
          </article>
          <article className="card">
            <h3>Secure Checkout</h3>
            <p className="muted">Encrypted payments and buyer protection.</p>
          </article>
        </section>

        {/* CTA banner */}
        <div className="cta">
          <div className="cta-box">
            <div className="cta-title">Ready to get started?</div>
            <button className="cta-action" onClick={() => go("/signup")}>
              Create Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          maxWidth: "1200px",
          margin: "24px auto 40px",
          padding: "0 16px",
          color: "var(--muted)",
          textAlign: "center",
          borderTop: "1px solid var(--glass-border)"
        }}>
          © {new Date().getFullYear()} Door2Go · All rights reserved.
        </footer>
      </div>
    </div>
  );
}
