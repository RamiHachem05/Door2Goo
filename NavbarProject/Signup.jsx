import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    accept: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const passwordScore = () => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  };

  const strengthLabel = ["Very Weak", "Weak", "Okay", "Good", "Strong"][passwordScore()];
  const strengthColors = ["#ff6b6b", "#ffa500", "#ffd93d", "#6bcf7f", "#4ecdc4"];

  const canSubmit = 
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.password.length >= 8 &&
    form.password === form.confirm &&
    form.accept &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    // Animated step progression
    for (let step = 2; step <= 4; step++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(step);
    }

    setTimeout(() => {
      setLoading(false);
      setToast("Welcome to Door2Go! Your account has been created.");
      setTimeout(() => {
        setToast("");
        navigate("/dashboard");
      }, 2000);
    }, 1200);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="signup-page">
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
        .signup-page{
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

        .signup-card {
          width: 100%;
          max-width: 480px;
          border: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(22,24,34,.88), rgba(22,24,34,.7));
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 40px;
          position: relative;
          z-index: 2;
          overflow: hidden;
        }

        /* Floating particles */
        .floating-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: linear-gradient(45deg, var(--accent), var(--accent2));
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .logo-section {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          font-size: 32px;
        }

        .logo-text {
          font-size: 28px;
          font-weight: 700;
        }

        .blue { color: #39a0ff; }
        .purple { color: #9f4ef8; }

        .title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-align: center;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: var(--muted);
          text-align: center;
          margin: 0 0 32px 0;
          font-size: 14px;
        }

        /* Progress Steps */
        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
          position: relative;
        }

        .progress-steps::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--line);
          z-index: 1;
        }

        .progress-bar {
          position: absolute;
          top: 15px;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transition: width 0.6s ease;
          z-index: 2;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 3;
        }

        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .step.active .step-circle {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          box-shadow: 0 0 20px rgba(159, 78, 248, 0.4);
        }

        .step.completed .step-circle {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
        }

        .step-label {
          font-size: 12px;
          color: var(--muted);
          transition: color 0.3s ease;
        }

        .step.active .step-label {
          color: var(--text);
          font-weight: 600;
        }

        /* Form */
        .signup-form { display: grid; gap: 20px; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 520px) {
          .form-row { grid-template-columns: 1fr; }
        }

        .field{
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px 14px 10px;
          transition: all 0.3s ease;
        }

        .field:has(input:focus) {
          border-color: rgba(159,78,248,.55);
          box-shadow: 0 0 0 3px rgba(159,78,248,.12);
          transform: translateY(-2px);
        }

        .label{
          position: absolute;
          left: 14px;
          top: 14px;
          font-size: 12px;
          color: var(--muted);
          opacity: .9;
          transition: all 0.3s ease;
        }

        input{
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: var(--text);
          font-size: 16px;
          margin-top: 16px;
        }

        .pwd-toggle{
          position: absolute;
          right: 12px;
          top: 12px;
          background: rgba(255,255,255,.06);
          border: 1px solid var(--line);
          color: var(--text);
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pwd-toggle:hover {
          background: rgba(255,255,255,.1);
        }

        /* Password Strength */
        .strength-container {
          margin-top: 12px;
        }

        .strength-bar {
          height: 6px;
          border-radius: 3px;
          background: var(--line);
          overflow: hidden;
          margin-bottom: 6px;
        }

        .strength-fill {
          height: 100%;
          border-radius: 3px;
          transition: all 0.4s ease;
        }

        .strength-text {
          font-size: 12px;
          color: var(--muted);
        }

        /* Terms */
        .terms {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.4;
        }

        .terms input {
          margin: 2px 0 0 0;
          width: auto;
        }

        .terms a {
          color: #b8c1ff;
          text-decoration: none;
        }

        .terms a:hover {
          color: var(--accent2);
        }

        /* Buttons */
        .btn{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          border-radius: 14px;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 16px;
          background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
          background-size: 200% 200%;
          animation: shift 6s ease infinite;
          box-shadow: 0 8px 32px rgba(159,78,248,.3);
          transition: all 0.3s ease;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover:not(:disabled) { 
          transform: translateY(-2px); 
          box-shadow: 0 12px 40px rgba(159,78,248,.4);
        }

        .btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .btn:disabled { 
          opacity: .5; 
          cursor: not-allowed; 
          transform: none; 
        }

        @keyframes shift{
          0%{ background-position: 0% 50% }
          50%{ background-position: 100% 50% }
          100%{ background-position: 0% 50% }
        }

        .login-link{
          text-align: center;
          color: var(--muted);
          font-size: 14px;
          margin-top: 24px;
        }

        .login-link a{
          color: #b8c1ff;
          text-decoration: none;
          font-weight: 700;
        }

        .login-link a:hover { color: var(--accent2); }

        /* Success Animation */
        .success-check {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          position: relative;
        }

        .check-circle {
          width: 100%;
          height: 100%;
          border: 3px solid var(--accent);
          border-radius: 50%;
          position: relative;
          animation: circle-anim 0.6s ease;
        }

        .check-mark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: check-anim 0.4s ease 0.6s forwards;
          color: var(--accent);
          font-size: 40px;
        }

        @keyframes circle-anim {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes check-anim {
          0% { transform: translate(-50%, -50%) scale(0); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }

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

      {/* Floating Particles */}
      <div className="floating-particles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="signup-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="logo-section">
          <div className="logo">
            <span>🚚</span>
            <div className="logo-text">
              <span className="blue">Door</span>
              <span className="purple">2Go</span>
            </div>
          </div>
          <p className="subtitle">Create your account and start delivering happiness</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className="progress-bar" style={{ width: `${(currentStep - 1) * 33.33}%` }} />
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {currentStep > step ? '✓' : step}
              </div>
              <div className="step-label">
                {['Info', 'Security', 'Review', 'Complete'][step - 1]}
              </div>
            </div>
          ))}
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="field">
              <span className="label">Full Name</span>
              <input
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={onChange}
                autoComplete="name"
                required
              />
            </div>
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
          </div>

          <div className="field">
            <span className="label">Password</span>
            <input
              name="password"
              placeholder="Create a strong password"
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button
              type="button"
              className="pwd-toggle"
              onClick={() => setShowPwd((s) => !s)}
              aria-label="Toggle password visibility"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
            
            <div className="strength-container">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${(passwordScore() / 4) * 100}%`,
                    background: strengthColors[passwordScore()],
                  }}
                />
              </div>
              <div className="strength-text">
                Password strength: <strong>{strengthLabel}</strong>
              </div>
            </div>
          </div>

          <div className="field">
            <span className="label">Confirm Password</span>
            <input
              name="confirm"
              placeholder="Confirm your password"
              type={showPwd ? "text" : "password"}
              value={form.confirm}
              onChange={onChange}
              autoComplete="new-password"
              required
            />
          </div>

          <label className="terms">
            <input
              type="checkbox"
              name="accept"
              checked={form.accept}
              onChange={onChange}
            />
            I agree to the{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
          </label>

          <button className="btn" disabled={!canSubmit} type="submit">
            {loading ? (
              <>
                <span>Creating Account...</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '6px',
                        height: '6px',
                        background: 'white',
                        borderRadius: '50%',
                        animation: `bounce 1.4s infinite ease-in-out ${i * 0.16}s`
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="login-link">
            Already have an account?{" "}
            <Link to="/login">Log in here</Link>
          </div>
        </form>
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