// src/ContactUs.jsx
import React, { useState } from "react";

export default function ContactUs() {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!form.subject.trim()) return "Please add a subject.";
    if (!form.message.trim() || form.message.trim().length < 10)
      return "Please write a message (at least 10 characters).";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ type: "error", message: err });
      return;
    }
    setLoading(true);
    setStatus({ type: "", message: "" });

    // Simulate request
    await new Promise((r) => setTimeout(r, 900));

    setLoading(false);
    setStatus({
      type: "success",
      message: "Thanks! We received your message and will reply shortly.",
    });
    setForm({ name: "", email: "", subject: "", phone: "", message: "" });
  };

  return (
    <div className="page">
      <style>{`
        :root{
          --bg:#1a1a1f;
          --card:#20222a;
          --text:#e7e9ff;
          --muted:#a5afc3;
          --glass: rgba(255,255,255,0.06);
          --glass-border: rgba(255,255,255,0.16);
          --nav-h: 64px; /* match GooeyNav height */
          --accent:#9f4ef8;   /* your brand gradient colors */
          --accent-2:#39a0ff;
          --accent-3:#ff5cf0;
        }
        *{ box-sizing:border-box }
        .page{
          min-height:100vh;
          background:var(--bg);
          color:var(--text);
          font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
          overflow-x:hidden;
        }
        .content{
          max-width:1200px;
          padding: calc(var(--nav-h) + 24px) 16px 40px;
          margin: 0 auto;
        }

        .title{
          margin:0 0 8px 0;
          font-size: clamp(26px, 4.5vw, 40px);
          font-weight: 900;
          letter-spacing:.3px;
          text-align:center;
        }
        .subtitle{
          margin:0 auto 28px;
          color:var(--muted);
          text-align:center;
          max-width: 780px;
        }

        .grid{
          display:grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 980px){
          .grid{ grid-template-columns: 1fr; }
        }

        .panel{
          background: linear-gradient(180deg, rgba(32,34,42,.85), rgba(32,34,42,.65));
          border: 1px solid var(--glass-border);
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 12px 36px rgba(0,0,0,.32);
        }
        /* Info column */
        .info-list{
          display:grid;
          gap:12px;
        }
        .info-item{
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 14px;
        }
        .info-item h4{
          margin:0 0 4px 0;
          font-size: 16px;
        }
        .muted{ color: var(--muted) }
        .links a{
          color: #e7e9ff;
        }
        .links a:hover{
          text-decoration: underline;
        }
        
        /* Map Styles */
        .map-container {
          margin-top: 12px;
          height: 220px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          position: relative;
        }
        
        .map-frame {
          width: 100%;
          height: 100%;
          border: none;
          filter: invert(0.9) hue-rotate(180deg) contrast(0.9) brightness(0.8);
        }
        
        .map-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background: 
            radial-gradient(circle at 20% 30%, rgba(159,78,248,.08), transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(57,160,255,.08), transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(255,92,240,.06), transparent 45%);
          border-radius: 14px;
        }
        
        .map-actions {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
        }
        
        .map-btn {
          background: rgba(32,34,42,0.9);
          border: 1px solid var(--glass-border);
          color: var(--text);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }
        
        .map-btn:hover {
          background: rgba(32,34,42,0.95);
          border-color: rgba(255,255,255,0.3);
        }

        /* Form */
        form{
          display:grid; gap: 12px;
        }
        .row{
          display:grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        @media (max-width: 600px){
          .row{ grid-template-columns: 1fr; }
        }
        label{
          display:block; font-weight:700; font-size: 13px; margin-bottom:6px;
        }
        input, textarea{
          width:100%;
          color:var(--text);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px 14px;
          outline: none;
        }
        textarea{ min-height: 140px; resize: vertical; }
        input::placeholder, textarea::placeholder{ color: #b7bed0; opacity:.75; }

        input:focus, textarea:focus{
          border-color: rgba(255,255,255,.28);
          box-shadow: 0 0 0 3px rgba(255,255,255,.06);
        }

        .actions{
          display:flex; gap:10px; justify-content:flex-end; margin-top:8px;
          flex-wrap: wrap;
        }
        .btn{
          appearance:none; border:none; cursor:pointer; font-weight:800; letter-spacing:.2px;
          padding:12px 18px; border-radius: 999px;
        }
        .btn-ghost{
          background: transparent;
          border:1px solid var(--glass-border);
          color: var(--text);
        }
        .btn-ghost:hover{ background: rgba(255,255,255,.06); }

        .btn-primary{
          color:#fff;
          background: linear-gradient(135deg, var(--accent), var(--accent-2), var(--accent-3));
          background-size: 200% 200%;
          animation: gradientMove 6s ease infinite;
          box-shadow: 0 8px 26px rgba(57,160,255,.25);
        }
        .btn-primary:disabled{ opacity:.6; cursor:not-allowed; }

        @keyframes gradientMove{
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }

        .alert{
          margin-bottom: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--glass-border;
        }
        .alert.success{
          background: rgba(64, 180, 120, .12);
          border-color: rgba(64, 180, 120, .35);
          color: #dfffe9;
        }
        .alert.error{
          background: rgba(255, 82, 82, .12);
          border-color: rgba(255, 82, 82, .35);
          color: #ffd7d7;
        }
      `}</style>

      <div className="content">
        <h1 className="title">Contact Us</h1>
        <p className="subtitle">
          Questions, partnerships, or support? Send us a note and we'll get back within one business day.
        </p>

        <div className="grid">
          {/* INFO SIDE */}
          <aside className="panel">
            <div className="info-list">
              <div className="info-item">
                <h4>Support</h4>
                <p className="muted">
                  We're here to help with orders, drivers, and accounts.
                </p>
                <p className="links">
                  <a href="mailto:support@door2go.com">support@door2go.com</a><br/>
                  <a href="tel:+96176123456">+961 76 123 456</a>
                </p>
              </div>

              <div className="info-item">
                <h4>Headquarters</h4>
                <p className="muted">Leon Street, Hamra, Beirut, Lebanon</p>
                <p className="muted">Mon–Fri · 9:00am–6:00pm</p>
              </div>

              <div className="map-container">
                <iframe
                  className="map-frame"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3314.347676148888!2d35.501108315208!3d33.895161280661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17215880aadf%3A0x1f2a8a2b8a7d8b2e!2sHamra%20Street%2C%20Beirut%2C%20Lebanon!5e0!3m2!1sen!2slb!4v1640000000000!5m2!1sen!2slb"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Door2Go Headquarters Location"
                />
                <div className="map-overlay"></div>
                <div className="map-actions">
                  <a 
                    href="https://maps.google.com/?q=Leon+Street,Hamra,Beirut,Lebanon" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-btn"
                  >
                    Open Maps
                  </a>
                  <a 
                    href="https://www.google.com/maps/dir//Leon+Street,Hamra,Beirut,Lebanon" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-btn"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* FORM SIDE */}
          <section className="panel" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" style={{marginTop:0, fontSize:18}}>Send a message</h2>

            {status.type && (
              <div
                className={`alert ${status.type === "success" ? "success" : "error"}`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </div>
            )}

            <form onSubmit={onSubmit} noValidate>
              <div className="row">
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="jane@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div>
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={onChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+961 76 123 456"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Write your message…"
                  required
                />
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    setForm({ name: "", email: "", subject: "", phone: "", message: "" })
                  }
                >
                  Clear
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}