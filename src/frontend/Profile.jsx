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
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function Profile() {
  const { user, token, login, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [vehicle, setVehicle] = useState(user?.vehicle || ""); 

  const [savingName, setSavingName] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Modals state
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [editingPhone, setEditingPhone] = useState("");
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setVehicle(user.vehicle || ""); 
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoadingOrders(true);
        const endpoint = user?.role === 'driver' ? "/orders/driver/all" : "/orders";
        const res = await api.get(endpoint);
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
    if (user) load();
    return () => { isMounted = false; };
  }, [user]);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || name.trim().length < 2) return setError("Name too short.");
    try {
      setSavingName(true);
      const res = await api.patch("/auth/update-profile", { name: name.trim() });
      if (res.data?.user) login(res.data.user, token);
      setToast("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally {
      setSavingName(false);
    }
  };

  const handleModalSubmit = async (e, type) => {
    e.preventDefault();
    setModalError(""); setModalSuccess(""); setModalLoading(true);
    try {
      let res;
      if (type === 'phone') res = await api.patch("/auth/update-phone", { phone: editingPhone });
      else if (type === 'vehicle') res = await api.patch("/auth/update-vehicle", { vehicle: editingVehicle });
      else if (type === 'password') {
         if (newPassword !== confirmPassword) throw new Error("Passwords mismatch");
         await api.patch("/auth/change-password", { oldPassword, newPassword });
      }
      if (res?.data?.user) login(res.data.user, token);
      setModalSuccess("Updated successfully!");
      setTimeout(() => {
        if(type==='phone') setShowPhoneModal(false);
        if(type==='vehicle') setShowVehicleModal(false);
        if(type==='password') setShowPwdModal(false);
        setModalSuccess("");
      }, 1000);
    } catch (err) {
      setModalError(err.response?.data?.message || err.message || "Failed");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <style>{`
        :root{ --bg:#0f0f15; --panel:#161822; --text:#e7e9ff; --muted:#a5afc3; --line:rgba(255,255,255,0.12); --accent:#9f4ef8; --accent2:#39a0ff; }
        *{ box-sizing:border-box }
        
        .profile-page{ 
          min-height:100vh; 
          color:var(--text); 
          font-family:system-ui; 
          background: radial-gradient(1200px 600px at 10% -20%, rgba(159,78,248,.22), transparent 60%), radial-gradient(900px 500px at 110% 10%, rgba(57,160,255,.18), transparent 60%), var(--bg); 
          display:flex; 
          align-items:center; 
          justify-content:center; 
          padding:20px; 
        }

        .profile-card{ 
          width:100%; 
          max-width:900px; 
          background:linear-gradient(180deg,rgba(22,24,34,.92),rgba(22,24,34,.75)); 
          backdrop-filter:blur(10px); 
          border-radius:24px; 
          padding:28px 30px 30px; 
        }

        .profile-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap: 10px; flex-wrap: wrap; }
        .profile-title{ font-size:24px; font-weight:700; }
        .profile-subtitle{ color:var(--muted); font-size:14px; }
        
        /* ✅ RESPONSIVE GRID: Stack on mobile */
        .profile-grid{ 
          display:grid; 
          gap:20px; 
          grid-template-columns: 1fr; 
        }
        @media (min-width:900px){ 
          .profile-grid{ grid-template-columns:0.95fr 1.05fr; } 
        }

        .panel-box{ background:rgba(0,0,0,.16); border-radius:18px; border:1px solid var(--line); padding:18px 16px 16px; }
        .panel-title{ font-size:16px; font-weight:600; margin-bottom:12px; }
        
        /* ✅ RESPONSIVE FLEX: Stack avatar and form on mobile */
        .profile-main-flex{ 
          display:flex; 
          gap:16px; 
          align-items:flex-start; 
          flex-direction: column; 
        }
        @media (min-width: 600px) {
           .profile-main-flex{ flex-direction: row; }
        }

        .avatar-box{ width:96px; height:96px; border-radius:22px; border:1px dashed rgba(255,255,255,0.35); display:flex; align-items:center; justify-content:center; overflow:hidden; background:rgba(255,255,255,0.02); flex-shrink:0; align-self: center; }
        @media(min-width:600px){ .avatar-box{ align-self: flex-start; } }
        
        .avatar-box img{ width:100%; height:100%; object-fit:cover; }
        .avatar-initial{ font-size:34px; }
        .avatar-upload{ margin-top:8px; font-size:12px; color:var(--muted); cursor:pointer; text-decoration:underline; display:block; text-align:center; }
        
        .profile-fields{ flex:1; display:grid; gap:14px; width: 100%; }
        .field{ background:rgba(255,255,255,0.04); border:1px solid var(--line); border-radius:14px; padding:16px 14px 10px; }
        .field-label{ font-size:11px; text-transform:uppercase; color:var(--muted); opacity:.9; }
        .field-value{ margin-top:6px; font-size:16px; font-weight:500; }
        .field input{ width:100%; border:none; outline:none; background:transparent; color:var(--text); font-size:16px; font-weight:500; }
        .field-inline{ display:flex; align-items:center; justify-content:space-between; gap:10px; }
        .small-btn{ border:none; border-radius:10px; padding:7px 11px; font-size:12px; cursor:pointer; background:rgba(159,78,248,.16); color:var(--text); }
        .primary-btn{ display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:999px; border:none; cursor:pointer; font-size:14px; font-weight:600; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:white; box-shadow:0 8px 24px rgba(0,0,0,.32); width:100%; }
        @media(min-width:600px){ .primary-btn{ width: auto; } }

        .orders-summary{ display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
        .pill-stat{ flex:1; min-width: 120px; background:rgba(255,255,255,0.04); border-radius:999px; padding:8px 10px; font-size:13px; display:flex; align-items:center; justify-content:space-between; }
        .orders-list{ margin-top:8px; max-height:260px; overflow:auto; padding-right:4px; }
        .order-item{ border-radius:12px; padding:10px 10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); margin-bottom:8px; font-size:13px; }
        .order-status{ font-weight:600; font-size:12px; color:#ffd36b; }
        .pwd-mask{ letter-spacing:0.2em; font-size:18px; }
        
        .modal-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,0.65); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px; }
        .modal-card{ background:linear-gradient(180deg,rgba(22,24,34,.97),rgba(22,24,34,.9)); border-radius:18px; border:1px solid var(--line); padding:18px; width:100%; max-width:380px; }
        .modal-field input{ margin-top:6px; width:100%; border-radius:10px; border:1px solid var(--line); padding:8px 10px; background:rgba(255,255,255,0.02); color:var(--text); outline:none; }
      `}</style>

      <ElectricBorder color="#7df9ff" speed={1.5} chaos={0.7} thickness={2} style={{ borderRadius: 24, width: '100%', maxWidth: '900px' }}>
        <div className="profile-card">
          <div className="profile-header">
            <div>
              <div className="profile-title">My Profile</div>
              <div className="profile-subtitle">Manage your account information and track your orders.</div>
            </div>
            <button className="small-btn" onClick={logout}>Log out</button>
          </div>

          <div className="profile-grid">
            {/* LEFT: Info */}
            <div className="panel-box">
              <div className="panel-title">Account details</div>
              <div className="profile-main-flex">
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <div className="avatar-box">
                    {avatarPreview ? <img src={avatarPreview} /> : <span className="avatar-initial">{name?.[0]?.toUpperCase()}</span>}
                  </div>
                  <label className="avatar-upload">Change photo<input type="file" hidden onChange={onAvatarChange} /></label>
                </div>
                <form className="profile-fields" onSubmit={handleSaveName}>
                  <div className="field">
                    <div className="field-label">Full name</div>
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="field"><div className="field-label">Email</div><div className="field-value">{email}</div></div>
                  
                  <div className="field">
                    <div className="field-label">Phone Number</div>
                    <div className="field-inline">
                      <div className="field-value">{phone || "No phone"}</div>
                      <button type="button" className="small-btn" onClick={() => { setEditingPhone(phone); setShowPhoneModal(true); }}>Change</button>
                    </div>
                  </div>

                  {user?.role === "driver" && (
                    <div className="field">
                      <div className="field-label">Vehicle</div>
                      <div className="field-inline">
                        <div className="field-value">{vehicle || "No vehicle"}</div>
                        <button type="button" className="small-btn" onClick={() => { setEditingVehicle(vehicle); setShowVehicleModal(true); }}>Change</button>
                      </div>
                    </div>
                  )}

                  <div className="field">
                    <div className="field-label">Password</div>
                    <div className="field-inline">
                      <span className="pwd-mask">••••••</span>
                      <button type="button" className="small-btn" onClick={() => setShowPwdModal(true)}>Change</button>
                    </div>
                  </div>
                  
                  {error && <div className="error-text" style={{color:'#f87171', fontSize:12}}>{error}</div>}
                  <button type="submit" className="primary-btn" disabled={savingName}>{savingName ? "Saving..." : "Save changes"}</button>
                </form>
              </div>
            </div>

            {/* RIGHT: Orders */}
            <div className="panel-box">
              <div className="panel-title">My {user?.role === 'driver' ? 'Deliveries' : 'Orders'}</div>
              <div className="orders-summary">
                <div className="pill-stat"><span>Pending / active</span><strong>{pendingOrders.length}</strong></div>
                <div className="pill-stat"><span>Delivered</span><strong>{deliveredOrders.length}</strong></div>
              </div>

              {loadingOrders ? <div className="order-meta">Loading...</div> : (
                <div className="orders-list">
                   <div style={{color:'var(--muted)', fontSize:12, marginBottom:4}}>Pending / Active</div>
                   {pendingOrders.map(o => (
                     <div key={o._id} className="order-item">
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                           <div style={{fontWeight:600}}>#{toTrackingCode(o)} · {o.items?.[0]?.productId?.name}</div>
                           <div className="order-status">{STATUS_TO_LABEL[o.status]}</div>
                        </div>
                        <div className="order-meta">{o.items?.length} item(s) · {formatDate(o.createdAt)}</div>
                        <div style={{fontWeight:700, marginTop:4}}>Total: ${o.totalPrice.toFixed(2)}</div>
                     </div>
                   ))}
                   {pendingOrders.length === 0 && <div className="order-meta" style={{marginBottom:10}}>No active orders.</div>}

                   {deliveredOrders.length > 0 && (
                     <>
                       <div style={{color:'var(--muted)', fontSize:12, marginTop:12, marginBottom:4}}>Delivered / Past</div>
                       {deliveredOrders.map(o => (
                        <div key={o._id} className="order-item" style={{opacity:0.7}}>
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                              <div style={{fontWeight:600}}>#{toTrackingCode(o)} · {o.items?.[0]?.productId?.name}</div>
                              <div className="order-status" style={{color:'#86efac'}}>Delivered</div>
                            </div>
                            <div className="order-meta">{formatDate(o.createdAt)}</div>
                        </div>
                       ))}
                     </>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ElectricBorder>

      {/* Modals remain the same, just keeping for completeness */}
      <AnimatePresence>
        {showPhoneModal && (
          <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
             <div className="modal-card">
               <h3>Change Phone</h3>
               <form onSubmit={(e)=>handleModalSubmit(e, 'phone')}>
                 <div className="modal-field"><input value={editingPhone} onChange={e=>setEditingPhone(e.target.value)} placeholder="+961..." /></div>
                 <div style={{marginTop:10, display:'flex', gap:10, justifyContent:'flex-end'}}>
                   <button type="button" className="small-btn" onClick={()=>setShowPhoneModal(false)}>Cancel</button>
                   <button type="submit" className="primary-btn" disabled={modalLoading}>Save</button>
                 </div>
               </form>
             </div>
          </motion.div>
        )}
        {showVehicleModal && (
          <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
             <div className="modal-card">
               <h3>Change Vehicle</h3>
               <form onSubmit={(e)=>handleModalSubmit(e, 'vehicle')}>
                 <div className="modal-field"><input value={editingVehicle} onChange={e=>setEditingVehicle(e.target.value)} placeholder="Toyota..." /></div>
                 <div style={{marginTop:10, display:'flex', gap:10, justifyContent:'flex-end'}}>
                   <button type="button" className="small-btn" onClick={()=>setShowVehicleModal(false)}>Cancel</button>
                   <button type="submit" className="primary-btn" disabled={modalLoading}>Save</button>
                 </div>
               </form>
             </div>
          </motion.div>
        )}
        {showPwdModal && (
          <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
             <div className="modal-card">
               <h3>Change Password</h3>
               <form onSubmit={(e)=>handleModalSubmit(e, 'password')}>
                 <div className="modal-field"><label>Current</label><input type="password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} /></div>
                 <div className="modal-field"><label>New</label><input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} /></div>
                 <div className="modal-field"><label>Confirm</label><input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} /></div>
                 {modalError && <div style={{color:'red', fontSize:12}}>{modalError}</div>}
                 <div style={{marginTop:10, display:'flex', gap:10, justifyContent:'flex-end'}}>
                   <button type="button" className="small-btn" onClick={()=>setShowPwdModal(false)}>Cancel</button>
                   <button type="submit" className="primary-btn" disabled={modalLoading}>Update</button>
                 </div>
               </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      {toast && <motion.div className="toast" initial={{y:20,opacity:0}} animate={{y:0,opacity:1}}>{toast}</motion.div>}
    </div>
  );
}