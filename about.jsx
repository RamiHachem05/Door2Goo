// src/learn-more.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LearnMore() {
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

        /* DETAIL SECTIONS */
        .detail-section{
          max-width:1200px; margin:40px auto; padding:0 16px;
        }
        .detail-card{
          background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65));
          border:1px solid var(--glass-border); border-radius:18px; padding:28px;
          box-shadow:0 12px 36px rgba(0,0,0,.32);
          margin-bottom:24px;
        }
        .detail-card h2{
          margin:0 0 16px 0; font-size:24px; color:var(--accent2);
        }
        .detail-card p{
          margin:0 0 16px 0; line-height:1.6;
        }
        .feature-list{
          list-style:none; padding:0; margin:16px 0;
        }
        .feature-list li{
          padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.1);
        }
        .feature-list li:last-child{ border-bottom:none; }

        /* CTA banner */
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
          <h1>LEARN MORE ABOUT DOOR2GO</h1>
          <p>Discover how we're revolutionizing delivery services</p>
          <div className="hero-buttons">
            <button className="btn btn-white" onClick={() => go("/how-it-works")}>
              How It Works
            </button>
            <button className="btn btn-glass" onClick={() => go("/signup")}>
              Create Account
            </button>
          </div>
        </header>

        {/* DETAIL SECTIONS */}
        <section className="detail-section">
          <div className="detail-card">
            <h2>Our Technology</h2>
            <p>Door2Go leverages cutting-edge technology to ensure fast, reliable, and secure deliveries:</p>
            <ul className="feature-list">
              <li>Real-time GPS tracking and route optimization</li>
              <li>End-to-end encrypted payment processing</li>
              <li>AI-powered delivery time predictions</li>
              <li>Dedicated driver and customer mobile apps</li>
              <li>Cloud-based infrastructure for 99.9% uptime</li>
            </ul>
          </div>

          <div className="detail-card">
            <h2>Delivery Options</h2>
            <p>Choose the delivery speed that fits your needs:</p>
            <ul className="feature-list">
              <li>VIP Delivery (2-3 hours) - Premium priority service</li>
              <li>Same-Day Delivery - Order by 2PM, receive by 8PM</li>
              <li>Next-Day Delivery - Standard overnight service</li>
              <li>International Shipping - Global delivery network</li>
              <li>Local Store Pickup - Free pickup from partner stores</li>
            </ul>
          </div>

          <div className="detail-card">
            <h2>For Businesses</h2>
            <p>Grow your business with our enterprise solutions:</p>
            <ul className="feature-list">
              <li>API Integration for seamless order management</li>
              <li>Analytics Dashboard for delivery insights</li>
              <li>Dedicated Account Manager</li>
              <li>Custom Delivery Zones and Pricing</li>
              <li>Business Insurance Coverage</li>
            </ul>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="features">
          <article className="card">
            <h3>24/7 Support</h3>
            <p className="muted">Round-the-clock customer service via chat, phone, and email.</p>
          </article>
          <article className="card">
            <h3>Eco-Friendly</h3>
            <p className="muted">Carbon-neutral delivery options and electric vehicle fleet.</p>
          </article>
          <article className="card">
            <h3>Insurance</h3>
            <p className="muted">All deliveries include up to $500 protection coverage.</p>
          </article>
          <article className="card">
            <h3>Partner Network</h3>
            <p className="muted">Integrated with 500+ retail stores and restaurants.</p>
          </article>
        </section>

        {/* CTA banner */}
        <div className="cta">
          <div className="cta-box">
            <div className="cta-title">Ready to experience Door2Go?</div>
            <button className="cta-action" onClick={() => go("/signup")}>
              Get Started Today
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