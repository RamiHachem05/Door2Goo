// src/frontend/Profile.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ElectricBorder from "./ElectricBorder";
import api from "../frontend/axios";
import { useAuth } from "../AuthContext.jsx";

const STATUS_TO_LABEL = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
};

function toTrackingCode(order) {
  return order._id.slice(-6).toUpperCase();
}

function formatDate(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Profile() {
  const { user, token, login, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingName, setSavingName] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);

  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  // Sync local state when auth user changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Load orders for counts + details
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoadingOrders(true);
        const res = await api.get("/orders");
        if (!isMounted) return;

        const all = res.data || [];
        const pending = all.filter((o) => o.status !== "delivered");
        const delivered = all.filter((o) => o.status === "delivered");

        setPendingOrders(pending);
        setDeliveredOrders(delivered);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle avatar preview (frontend only)
  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  // Save name
  const handleSaveName = async (e) => {
    e.preventDefault();
    setError("");
    setToast("");

    if (!name || name.trim().length < 2) {
      setError("Name is too short.");
      return;
    }

    try {
      setSavingName(true);
      const res = await api.patch("/auth/update-profile", { name: name.trim() });

      // Update AuthContext user so navbar etc shows new name
      if (res.data?.user) {
        login(res.data.user, token);
      }

      setToast("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingName(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwdError("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }

    try {
      setPwdLoading(true);
      await api.patch("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setPwdSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPwdModal(false);
        setPwdSuccess("");
      }, 1000);
    } catch (err) {
      console.error(err);
      setPwdError(
        err.response?.data?.message || "Failed to update password."
      );
    } finally {
      setPwdLoading(false);
    }
  };

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="profile-page">
      <style>{`
        :root{
          --bg:#0f0f15;
          --panel:#161822;
          --text:#e7e9ff;
          --muted:#a5afc3;
          --line:rgba(255,255,255,0.12);
          --accent:#9f4ef8;
          --accent2:#39a0ff;
          --accent3:#ff5cf0;
        }

        *{ box-sizing:border-box }

        .profile-page{
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
          display:flex;
          align-items:center;
          justify-content:center;
          padding:20px;
        }

        .profile-veil{
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

        .profile-card{
          width:100%;
          max-width:900px;
          background:linear-gradient(180deg,rgba(22,24,34,.92),rgba(22,24,34,.75));
          backdrop-filter:blur(10px);
          border-radius:24px;
          padding:28px 30px 30px;
        }

        .profile-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
          gap:10px;
          flex-wrap:wrap;
        }

        .profile-title{
          font-size:24px;
          font-weight:700;
        }

        .profile-subtitle{
          color:var(--muted);
          font-size:14px;
        }

        .profile-grid{
          display:grid;
          gap:20px;
        }
        @media (min-width:900px){
          .profile-grid{
            grid-template-columns:0.95fr 1.05fr;
          }
        }

        .panel-box{
          background:rgba(0,0,0,.16);
          border-radius:18px;
          border:1px solid var(--line);
          padding:18px 16px 16px;
        }

        .panel-title{
          font-size:16px;
          font-weight:600;
          margin-bottom:12px;
        }

        .profile-main-flex{
          display:flex;
          gap:16px;
          align-items:flex-start;
        }

        .avatar-box{
          width:96px;
          height:96px;
          border-radius:22px;
          border:1px dashed rgba(255,255,255,0.35);
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          background:rgba(255,255,255,0.02);
          flex-shrink:0;
          position:relative;
        }
        .avatar-box img{
          width:100%;
          height:100%;
          object-fit:cover;
        }
        .avatar-initial{
          font-size:34px;
        }
        .avatar-upload{
          margin-top:8px;
          font-size:12px;
          color:var(--muted);
          cursor:pointer;
          text-decoration:underline;
        }

        .profile-fields{
          flex:1;
          display:grid;
          gap:14px;
        }

        .field{
          position:relative;
          background:rgba(255,255,255,0.04);
          border:1px solid var(--line);
          border-radius:14px;
          padding:16px 14px 10px;
        }

        .field-label{
          font-size:11px;
          text-transform:uppercase;
          letter-spacing:.04em;
          color:var(--muted);
          opacity:.9;
        }

        .field-value{
          margin-top:6px;
          font-size:16px;
          font-weight:500;
        }

        .field input{
          width:100%;
          border:none;
          outline:none;
          background:transparent;
          color:var(--text);
          font-size:16px;
          font-weight:500;
        }

        .field-inline{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
        }

        .small-btn{
          border:none;
          border-radius:10px;
          padding:7px 11px;
          font-size:12px;
          cursor:pointer;
          background:rgba(159,78,248,.16);
          color:var(--text);
        }
        .small-btn:hover{
          background:rgba(159,78,248,.3);
        }

        .primary-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:10px 18px;
          border-radius:999px;
          border:none;
          cursor:pointer;
          font-size:14px;
          font-weight:600;
          background:linear-gradient(135deg,var(--accent),var(--accent2));
          color:white;
          box-shadow:0 8px 24px rgba(0,0,0,.32);
        }
        .primary-btn:disabled{
          opacity:.5;
          cursor:not-allowed;
          box-shadow:none;
        }

        .error-text{
          color:#ffb3b3;
          font-size:13px;
          margin-top:6px;
        }

        .orders-summary{
          display:flex;
          gap:10px;
          margin-bottom:10px;
          flex-wrap:wrap;
        }

        .pill-stat{
          flex:1;
          min-width:120px;
          background:rgba(255,255,255,0.04);
          border-radius:999px;
          padding:8px 10px;
          font-size:13px;
          display:flex;
          align-items:center;
          justify-content:space-between;
        }

        .orders-list{
          margin-top:8px;
          max-height:260px;
          overflow:auto;
          padding-right:4px;
        }

        .order-item{
          border-radius:12px;
          padding:10px 10px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          margin-bottom:8px;
          font-size:13px;
        }

        .order-item-header{
          display:flex;
          justify-content:space-between;
          gap:8px;
          margin-bottom:4px;
        }

        .order-status{
          font-weight:600;
          font-size:12px;
          color:#ffd36b;
        }

        .order-meta{
          color:var(--muted);
          font-size:12px;
        }

        .order-total{
          font-weight:700;
          font-size:13px;
          margin-top:4px;
        }

        .pwd-mask{
          letter-spacing:0.2em;
          font-size:18px;
        }

        /* MODAL */
        .modal-backdrop{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,0.65);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:50;
        }

        .modal-card{
          background:linear-gradient(180deg,rgba(22,24,34,.97),rgba(22,24,34,.9));
          border-radius:18px;
          border:1px solid var(--line);
          padding:18px 18px 16px;
          width:100%;
          max-width:380px;
        }

        .modal-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:10px;
        }

        .modal-title{
          font-size:16px;
          font-weight:600;
        }

        .modal-close{
          border:none;
          background:transparent;
          color:var(--muted);
          font-size:18px;
          cursor:pointer;
        }

        .modal-field{
          margin-top:10px;
        }
        .modal-field label{
          font-size:12px;
          color:var(--muted);
        }
        .modal-field input{
          margin-top:6px;
          width:100%;
          border-radius:10px;
          border:1px solid var(--line);
          padding:8px 10px;
          background:rgba(255,255,255,0.02);
          color:var(--text);
          outline:none;
        }
        .modal-actions{
          margin-top:14px;
          display:flex;
          justify-content:flex-end;
          gap:8px;
        }
        .link-btn{
          border:none;
          background:transparent;
          color:var(--muted);
          font-size:13px;
          cursor:pointer;
        }
        .modal-success{
          color:#86efac;
          font-size:12px;
          margin-top:6px;
        }
      `}</style>

      <div className="profile-veil" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ElectricBorder
          color="#7df9ff"
          speed={1.5}
          chaos={0.7}
          thickness={2}
          style={{ borderRadius: 24 }}
        >
          <div className="profile-card">
            <div className="profile-header">
              <div>
                <div className="profile-title">My Profile</div>
                <div className="profile-subtitle">
                  Manage your account information and track your orders.
                </div>
              </div>
              <button className="small-btn" onClick={logout}>
                Log out
              </button>
            </div>

            <div className="profile-grid">
              {/* LEFT: Profile info */}
              <div className="panel-box">
                <div className="panel-title">Account details</div>

                <div className="profile-main-flex">
                  {/* Avatar */}
                  <div>
                    <div className="avatar-box">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" />
                      ) : (
                        <span className="avatar-initial">
                          {name?.[0]?.toUpperCase() || "😀"}
                        </span>
                      )}
                    </div>
                    <label className="avatar-upload">
                      Change photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={onAvatarChange}
                      />
                    </label>
                  </div>

                  {/* Fields */}
                  <form className="profile-fields" onSubmit={handleSaveName}>
                    <div className="field">
                      <div className="field-label">Full name</div>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="field">
                      <div className="field-label">Email</div>
                      <div className="field-value">{email}</div>
                    </div>

                    <div className="field">
                      <div className="field-label">Password</div>
                      <div className="field-inline" style={{ marginTop: 6 }}>
                        <span className="pwd-mask">••••••••</span>
                        <button
                          type="button"
                          className="small-btn"
                          onClick={() => {
                            setShowPwdModal(true);
                            setPwdError("");
                            setPwdSuccess("");
                          }}
                        >
                          Change
                        </button>
                      </div>
                    </div>

                    {error && <div className="error-text">{error}</div>}

                    <div>
                      <button
                        type="submit"
                        className="primary-btn"
                        disabled={savingName || !name.trim()}
                      >
                        {savingName ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* RIGHT: Orders info */}
              <div className="panel-box">
                <div className="panel-title">My orders</div>

                <div className="orders-summary">
                  <div className="pill-stat">
                    <span>Pending / active</span>
                    <strong>{pendingOrders.length}</strong>
                  </div>
                  <div className="pill-stat">
                    <span>Delivered</span>
                    <strong>{deliveredOrders.length}</strong>
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="order-meta">Loading your orders...</div>
                ) : pendingOrders.length + deliveredOrders.length === 0 ? (
                  <div className="order-meta">
                    You don’t have any orders yet.
                  </div>
                ) : (
                  <>
                    <div className="order-meta">Pending / Active</div>
                    <div className="orders-list">
                      {pendingOrders.map((o) => (
                        <div key={o._id} className="order-item">
                          <div className="order-item-header">
                            <div>
                              <div>
                                #{toTrackingCode(o)} ·{" "}
                                {o.items?.[0]?.productId?.name ||
                                  "Door2Go Order"}
                              </div>
                              <div className="order-meta">
                                {o.items?.length || 0} item(s) ·{" "}
                                {formatDate(o.createdAt)}
                              </div>
                            </div>
                            <div className="order-status">
                              {STATUS_TO_LABEL[o.status] || o.status}
                            </div>
                          </div>
                          <div className="order-total">
                            Total: ${o.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      ))}

                      {pendingOrders.length === 0 && (
                        <div className="order-meta">
                          No active orders at the moment.
                        </div>
                      )}

                      {deliveredOrders.length > 0 && (
                        <>
                          <div
                            style={{
                              marginTop: 10,
                              marginBottom: 4,
                              fontSize: 12,
                              color: "var(--muted)",
                            }}
                          >
                            Delivered
                          </div>
                          {deliveredOrders.map((o) => (
                            <div key={o._id} className="order-item">
                              <div className="order-item-header">
                                <div>
                                  <div>
                                    #{toTrackingCode(o)} ·{" "}
                                    {o.items?.[0]?.productId?.name ||
                                      "Door2Go Order"}
                                  </div>
                                  <div className="order-meta">
                                    {o.items?.length || 0} item(s) ·{" "}
                                    {formatDate(o.createdAt)}
                                  </div>
                                </div>
                                <div className="order-status">
                                  {STATUS_TO_LABEL[o.status] || o.status}
                                </div>
                              </div>
                              <div className="order-total">
                                Total: ${o.totalPrice.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </ElectricBorder>
      </motion.div>

      {/* ✅ Change password modal */}
      <AnimatePresence>
        {showPwdModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <div className="modal-header">
                <div className="modal-title">Change password</div>
                <button
                  className="modal-close"
                  onClick={() => setShowPwdModal(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="modal-field">
                  <label>Current password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label>New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label>Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {pwdError && <div className="error-text">{pwdError}</div>}
                {pwdSuccess && (
                  <div className="modal-success">{pwdSuccess}</div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setShowPwdModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={pwdLoading}
                  >
                    {pwdLoading ? "Updating..." : "Update password"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small bottom toast */}
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
