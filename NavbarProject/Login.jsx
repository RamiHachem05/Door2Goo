import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ElectricBorder from "./ElectricBorder";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const canSubmit = 
    form.email.length > 0 && 
    form.password.length > 0 && 
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast("Welcome back! Redirecting to your dashboard…");
      setTimeout(() => {
        setToast("");
        navigate("/dashboard");
      }, 1200);
    }, 900);
  };

  return (
    <div className="login-page">
      <style>{`
        :root{
          --bg:#0f0f15;
          --panel:#161822;
          --text:#e7e9ff;
          --muted:#a5afc3;
          --line:rgba(255,255,255,0.12);
          --accent:#9f4ef8;   /* purple */
          --accent2:#39a0ff;  /* blue   */
          --accent3:#ff5cf0;  /* pink   */
        }
        *{ box-sizing:border-box }
        .login-page{
          min-height:100vh;
          color:var(--text);
          font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
          position:relative;
          overflow:hidden;
          background:
            radial-gradient(1200px 600px at 10% -20%, rgba(159,78,248,.22), transparent 60%),
            radial-gradient(900px 500px at 110% 10%, rgba(57,160,255,.18), transparent 60%),
            radial-gradient(600px 500px at 50% 120%, rgba(255,92,240,.13), transparent 60%),
            var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        /* animated aurora veil */
        .veil{
          position:absolute; inset:-40% -20%;
          background:conic-gradient(from 90deg,
            rgba(159,78,248,.10),
            rgba(57,160,255,.10),
            rgba(255,92,240,.08),
            rgba(159,78,248,.10));
          filter: blur(60px) saturate(130%);
          animation: drift 16s linear infinite;
          pointer-events:none;
        }
        @keyframes drift{
          0%{ transform:rotate(0deg) scale(1) }
          50%{ transform:rotate(180deg) scale(1.03) }
          100%{ transform:rotate(360deg) scale(1) }
        }

        /* MUCH WIDER CARD */
        .login-card {
          width: 100%;
          max-width: 600px; /* Much wider - increased from 480px to 600px */
          background: linear-gradient(180deg, rgba(22,24,34,.88), rgba(22,24,34,.7));
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 50px 50px; /* Increased horizontal padding */
          position: relative;
          z-index: 2;
        }

        .logo-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 36px;
        }

        .logo-text {
          font-size: 32px;
          font-weight: 700;
        }

        .blue { color: #39a0ff; }
        .purple { color: #9f4ef8; }

        .title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-align: center;
        }

        .subtitle {
          color: var(--muted);
          text-align: center;
          margin: 0 0 32px 0;
          font-size: 16px;
        }

        /* form */
        .login-form { 
          display: grid; 
          gap: 20px; 
          max-width: 400px; /* Limit form width for better readability */
          margin: 0 auto; /* Center the form */
        }

        .field{
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 18px 16px 12px;
          transition: border-color .15s ease, box-shadow .15s ease;
        }

        .field:has(input:focus) {
          border-color: rgba(159,78,248,.55);
          box-shadow: 0 0 0 3px rgba(159,78,248,.12);
        }

        .label{
          position: absolute;
          left: 16px;
          top: 16px;
          font-size: 13px;
          color: var(--muted);
          opacity: .9;
        }

        input{
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: var(--text);
          font-size: 17px;
          margin-top: 16px;
        }

        .pwd-toggle{
          position: absolute;
          right: 14px;
          top: 14px;
          background: rgba(255,255,255,.06);
          border: 1px solid var(--line);
          color: var(--text);
          font-size: 13px;
          padding: 7px 10px;
          border-radius: 10px;
          cursor: pointer;
        }

        .options{
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          color: var(--muted);
        }

        .remember{
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .remember input { margin: 0; width: auto; }

        .forgot{
          color: #b8c1ff;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
        }

        .forgot:hover { color: var(--accent2); }

        .btn{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 18px 24px;
          border-radius: 14px;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 17px;
          background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
          background-size: 200% 200%;
          animation: shift 6s ease infinite;
          box-shadow: 0 8px 24px rgba(159,78,248,.24);
          transition: transform .15s ease, filter .15s ease;
          width: 100%;
        }

        .btn:hover:not(:disabled) { 
          transform: translateY(-2px); 
          filter: brightness(1.06); 
        }

        .btn:disabled { 
          opacity: .4; 
          cursor: not-allowed; 
          transform: none; 
        }

        @keyframes shift{
          0%{ background-position: 0% 50% }
          50%{ background-position: 100% 50% }
          100%{ background-position: 0% 50% }
        }

        .signup-link{
          text-align: center;
          color: var(--muted);
          font-size: 15px;
          margin-top: 28px;
        }

        .signup-link a{
          color: #b8c1ff;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
        }

        .signup-link a:hover { color: var(--accent2); }

        /* toast */
        .toast{
          position: fixed;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          background: rgba(22,24,34,.9);
          border: 1px solid var(--line);
          color: var(--text);
          padding: 12px 16px;
          border-radius: 12px;
          box-shadow: 0 14px 40px rgba(0,0,0,.4);
          backdrop-filter: blur(8px);
          z-index: 1000;
        }
      `}</style>

      <div className="veil" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ElectricBorder
          color="#7df9ff"
          speed={1.5}
          chaos={0.7}
          thickness={2}
          style={{ borderRadius: 24 }}
          className="login-card-wrapper"
        >
          <div className="login-card">
            <div className="logo-section">
              <div className="logo">
                <span>🚚</span>
                <div className="logo-text">
                  <span className="blue">Door</span>
                  <span className="purple">2Go</span>
                </div>
              </div>
              <h1 className="title">Welcome Back</h1>
              <p className="subtitle">Sign in to your account</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <span className="label">Email</span>
                <input
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <span className="label">Password</span>
                <input
                  name="password"
                  placeholder="Enter your password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>

              <div className="options">
                <label className="remember">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={onChange}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot">
                  Forgot password?
                </Link>
              </div>

              <button className="btn" disabled={!canSubmit} type="submit">
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="signup-link">
                Don't have an account?{" "}
                <Link to="/signup">Sign up now</Link>
              </div>
            </form>
          </div>
        </ElectricBorder>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.22 } }}
            exit={{ y: 16, opacity: 0, transition: { duration: 0.18 } }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}