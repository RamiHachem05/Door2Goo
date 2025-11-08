// src/Dashboard.jsx
import React, { useMemo, useState } from "react";
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, Users, Clock, TrendingUp, Edit2, Eye } from 'lucide-react';

export default function Dashboard() {
  const [range, setRange] = useState("week"); // 'today' | 'week' | 'month'
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [editedVendor, setEditedVendor] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // Mock data by range
  const data = useMemo(() => {
    const base = {
      today: {
        orders: 128,
        revenue: "$4,256",
        newUsers: 23,
        pendingDeliveries: 12,
        ontime: 0.94,
        avgEta: "38m",
        drivers: 23,
        trend: [16, 18, 15, 20, 17, 22, 20],
        onTimeCount: 120,
        lateCount: 8,
      },
      week: {
        orders: 862,
        revenue: "$12,458",
        newUsers: 89,
        pendingDeliveries: 34,
        ontime: 0.92,
        avgEta: "42m",
        drivers: 46,
        trend: [102, 120, 80, 140, 110, 160, 150],
        onTimeCount: 793,
        lateCount: 69,
      },
      month: {
        orders: 3580,
        revenue: "$48,920",
        newUsers: 342,
        pendingDeliveries: 45,
        ontime: 0.915,
        avgEta: "44m",
        drivers: 61,
        trend: [510, 780, 650, 880, 720, 970, 1050],
        onTimeCount: 3277,
        lateCount: 303,
      },
    };
    return base[range];
  }, [range]);

  // Vendors data
  const [vendorList, setVendorList] = useState([
    { id: 1, name: 'Fresh Mart', products: 156, status: 'Active', rating: 4.8 },
    { id: 2, name: 'Tech Hub', products: 89, status: 'Active', rating: 4.6 },
    { id: 3, name: 'Quick Bites', products: 234, status: 'Active', rating: 4.9 },
    { id: 4, name: 'Health Plus', products: 67, status: 'Pending', rating: 4.5 },
    { id: 5, name: 'Home Essentials', products: 123, status: 'Active', rating: 4.7 }
  ]);

  // Category data for pie chart
  const categoryData = [
    { name: 'Food', value: 35 },
    { name: 'Groceries', value: 28 },
    { name: 'Pharmacy', value: 18 },
    { name: 'Electronics', value: 12 },
    { name: 'Other', value: 7 }
  ];

  const COLORS = ['#39a0ff', '#9f4ef8', '#ff5cf0', '#06B6D4', '#A78BFA'];

  // AI Insights
  const aiInsights = [
    { title: 'Peak Hours', value: '6 PM - 9 PM' },
    { title: 'Top Seller', value: 'Fresh Mart' },
    { title: 'Avg. Delivery', value: data.avgEta }
  ];

  const donutAngle = (pct) => Math.max(0, Math.min(100, Math.round(pct * 100)));

  // Sparkline points generator for SVG
  const spark = useMemo(() => {
    const w = 320;
    const h = 80;
    const pad = 6;
    const xs = data.trend.map((_, i) =>
      pad + (i * (w - pad * 2)) / (data.trend.length - 1)
    );
    const min = Math.min(...data.trend);
    const max = Math.max(...data.trend);
    const ys = data.trend.map((v) => {
      const t = (v - min) / (max - min || 1);
      return h - pad - t * (h - pad * 2);
    });
    const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
    return { w, h, pad, xs, ys, points, min, max };
  }, [data.trend]);

  // Card click handlers
  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
  };

  const closeCardModal = () => {
    setSelectedCard(null);
  };

  // Vendor handlers
  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setModalType("view");
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setEditedVendor({ ...vendor });
    setModalType("edit");
  };

  const handleSaveChanges = () => {
    setVendorList(vendorList.map(v => 
      v.id === editedVendor.id ? editedVendor : v
    ));
    closeModal();
  };

  const closeModal = () => {
    setSelectedVendor(null);
    setEditedVendor(null);
    setModalType(null);
  };

  // Action handlers for card modals
  const handleOrderView = (orderNumber) => {
    closeCardModal();
    setTimeout(() => {
      alert(`Opening detailed view for ${orderNumber}\n\nOrder Details:\n- Status: In Progress\n- Vendor: Fresh Mart\n- Delivery Time: 25 mins\n- Customer: John Doe`);
    }, 300);
  };

  const handleViewAllOrders = () => {
    closeCardModal();
    setTimeout(() => {
      alert('Navigating to All Orders page...\n\nThis would typically:\n- Show a complete list of all orders\n- Allow filtering by date, status, vendor\n- Export orders to CSV/PDF');
    }, 300);
  };

  const handleDownloadReport = () => {
    closeCardModal();
    setTimeout(() => {
      const reportData = 'Revenue Report - Door2go\n\nFood Delivery: $5,234\nGroceries: $4,112\nOther: $3,112\n\nTotal: ' + data.revenue;
      const blob = new Blob([reportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'revenue-report.txt';
      a.click();
      window.URL.revokeObjectURL(url);
      alert('Revenue report downloaded successfully!');
    }, 300);
  };

  const handleViewProfile = (userName) => {
    closeCardModal();
    setTimeout(() => {
      alert(`Opening profile for ${userName}\n\nUser Details:\n- Email: ${userName.toLowerCase().replace(' ', '.')}@email.com\n- Registration: Today\n- Orders: 0\n- Status: Active`);
    }, 300);
  };

  const handleViewAllUsers = () => {
    closeCardModal();
    setTimeout(() => {
      alert('Navigating to All Users page...\n\nThis would typically:\n- Display complete user list\n- Show user statistics\n- Allow user management (ban, verify, etc.)');
    }, 300);
  };

  const handleTrackDelivery = (orderNumber) => {
    closeCardModal();
    setTimeout(() => {
      alert(`Tracking ${orderNumber}\n\nCurrent Status: In Transit\nDriver: Mike Johnson\nEstimated Arrival: 15 mins\nLocation: 2.3 km away`);
    }, 300);
  };

  const handleManageDeliveries = () => {
    closeCardModal();
    setTimeout(() => {
      alert('Opening Delivery Management Panel...\n\nFeatures:\n- View all pending deliveries\n- Assign drivers\n- Update delivery status\n- Contact customers/drivers');
    }, 300);
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
          --accent:#9f4ef8;   /* purple */
          --accent2:#39a0ff;  /* blue */
          --accent3:#ff5cf0;  /* pink */
        }
        *{ box-sizing:border-box }
        .page{
          min-height:100vh; background:var(--bg); color:var(--text);
          font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
          overflow-x:hidden;
        }
        .content{
          padding-top:24px;
          max-width:1400px; margin:0 auto; padding-bottom:36px; padding-left:16px; padding-right:16px;
        }

        /* Header */
        .header{
          display:flex; align-items:center; justify-content:space-between; gap:12px;
          padding:18px 0 24px;
          flex-wrap:wrap;
        }
        .title{
          font-size:32px; font-weight:900; letter-spacing:.3px;
          background: linear-gradient(135deg, var(--accent2), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .seg{
          display:flex; gap:8px; background:rgba(255,255,255,.06); border:1px solid var(--glass-border);
          border-radius:12px; padding:6px;
        }
        .seg button{
          appearance:none; border:none; cursor:pointer; padding:8px 16px; border-radius:10px;
          color:var(--text); font-weight:800; background:transparent; transition:all 0.3s;
        }
        .seg button.active{
          background:#fff; color:#0e0e12; box-shadow:0 6px 22px rgba(0,0,0,.25);
        }

        /* Top KPI Cards */
        .top-kpis{
          display:grid; gap:14px; margin-bottom:24px;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
        .top-kpi{
          background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65));
          border:1px solid var(--glass-border); border-radius:16px; padding:18px;
          box-shadow:0 12px 36px rgba(0,0,0,.32);
          cursor:pointer;
          transition: all 0.3s ease;
        }
        .top-kpi:hover{
          transform: translateY(-4px);
          box-shadow:0 16px 48px rgba(0,0,0,.4);
        }
        .top-kpi-header{
          display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;
        }
        .top-kpi-icon{
          width:48px; height:48px; border-radius:12px; display:grid; place-items:center;
          box-shadow:0 4px 12px rgba(0,0,0,.2);
        }
        .top-kpi-change{
          font-size:12px; font-weight:800; padding:4px 10px; border-radius:20px;
        }
        .top-kpi-change.positive{
          background:rgba(52,211,153,0.2); color:#34d399;
        }
        .top-kpi-change.negative{
          background:rgba(248,113,113,0.2); color:#f87171;
        }
        .top-kpi-label{
          color:var(--muted); font-size:13px; margin-bottom:4px;
        }
        .top-kpi-value{
          font-size:28px; font-weight:900;
        }

        /* AI Insights Banner */
        .ai-insights{
          background:linear-gradient(135deg, var(--accent), var(--accent2));
          border-radius:18px; padding:24px; margin-bottom:24px;
          box-shadow:0 12px 36px rgba(159,78,248,.3);
        }
        .ai-insights-title{
          font-size:20px; font-weight:900; margin-bottom:16px; display:flex; align-items:center; gap:10px;
        }
        .ai-insights-grid{
          display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }
        .ai-insight-card{
          background:rgba(255,255,255,0.15); backdrop-filter:blur(10px);
          border:1px solid rgba(255,255,255,0.25); border-radius:12px; padding:14px;
        }
        .ai-insight-label{
          color:rgba(255,255,255,0.85); font-size:12px; margin-bottom:6px;
        }
        .ai-insight-value{
          font-size:20px; font-weight:900; color:#fff;
        }

        /* Grid */
        .grid{
          display:grid; gap:20px;
          grid-template-columns: 1.5fr 1fr;
        }
        @media (max-width: 1100px){
          .grid{ grid-template-columns:1fr; }
        }

        .card{
          background:linear-gradient(180deg,rgba(32,34,42,.85),rgba(32,34,42,.65));
          border:1px solid var(--glass-border); border-radius:18px; padding:20px;
          box-shadow:0 12px 36px rgba(0,0,0,.32);
        }

        /* KPI Row */
        .kpis{
          display:grid; gap:12px; grid-template-columns: repeat(4, 1fr);
          margin-bottom:20px;
        }
        @media (max-width: 900px){
          .kpis{ grid-template-columns: repeat(2, 1fr); }
        }
        .kpi{
          background:rgba(255,255,255,.06);
          border:1px solid var(--glass-border);
          border-radius:14px; padding:12px 14px;
        }
        .kpi .label{ color:var(--muted); font-size:12px }
        .kpi .value{ font-size:22px; font-weight:900; margin-top:2px }

        /* Sparkline Area */
        .spark-wrap{
          display:flex; gap:16px; align-items:center; justify-content:space-between; flex-wrap:wrap;
          margin-bottom:20px;
        }
        .spark-meta{
          min-width:180px;
        }
        .spark-title{ font-weight:900; margin-bottom:6px; font-size:18px; }
        .muted{ color:var(--muted) }
        .legend{
          display:flex; gap:10px; align-items:center; margin-top:8px;
        }
        .dot{ width:10px; height:10px; border-radius:50% }
        .dot.p{ background:var(--accent2) }

        /* Donuts */
        .donuts{
          display:grid; gap:12px; grid-template-columns: repeat(2, 1fr);
        }
        .donut{
          display:grid; grid-template-columns:60px 1fr; gap:12px; align-items:center;
          background:rgba(255,255,255,.06); border:1px solid var(--glass-border); border-radius:14px; padding:10px 12px;
        }
        .ring{
          width:60px; height:60px; border-radius:50%;
          display:grid; place-items:center; color:#0e0e12; font-weight:900;
          background:
            conic-gradient(var(--accent2) 0deg  var(--angle), rgba(255,255,255,.12) var(--angle) 360deg),
            #0e0e12;
          border:1px solid var(--glass-border);
        }
        .ring-inner{
          width:42px; height:42px; border-radius:50%; background:#fff; display:grid; place-items:center; color:#0e0e12; font-weight:900;
        }
        .donut .label{ font-size:13px; color:var(--muted) }
        .donut .value{ font-weight:900; }

        /* Charts Section */
        .charts-grid{
          display:grid; gap:20px; grid-template-columns: repeat(2, 1fr);
          margin-bottom:20px;
        }
        @media (max-width: 900px){
          .charts-grid{ grid-template-columns:1fr; }
        }
        .chart-card{
          background:rgba(255,255,255,.06);
          border:1px solid var(--glass-border);
          border-radius:14px; padding:16px;
        }
        .chart-title{
          font-weight:900; margin-bottom:16px; font-size:16px;
        }

        /* Right column cards */
        .activity{
          display:grid; gap:14px;
        }
        .row{
          display:flex; align-items:center; justify-content:space-between; gap:10px;
        }
        .feed{
          display:grid; gap:8px; margin-top:8px;
        }
        .pill{
          background:rgba(255,255,255,.06); border:1px solid var(--glass-border);
          border-radius:12px; padding:10px 12px; display:flex; align-items:center; justify-content:space-between;
        }
        .id{ font-weight:800 }
        .status{ color:#ffd36b; font-weight:800 }

        table{
          width:100%; border-collapse:collapse; font-size:14px; margin-top:12px;
        }
        th, td{
          text-align:left; padding:10px 8px; border-bottom:1px dashed var(--glass-border);
        }
        th{ color:var(--muted); font-weight:700; font-size:12px; text-transform:uppercase; }
        
        /* Vendor Management */
        .vendor-section{
          margin-top:24px;
        }
        .vendor-title{
          font-size:20px; font-weight:900; margin-bottom:16px;
        }
        .vendor-table-wrap{
          overflow-x:auto; -webkit-overflow-scrolling:touch;
        }
        .vendor-table{
          min-width:600px;
        }
        .vendor-table tbody tr{
          transition: background 0.2s;
        }
        .vendor-table tbody tr:hover{
          background:rgba(57,160,255,0.08);
        }
        .vendor-rating{
          display:flex; align-items:center; gap:6px;
        }
        .vendor-star{
          color:#fbbf24;
        }
        .vendor-status{
          display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:800;
        }
        .vendor-status.active{
          background:rgba(52,211,153,0.2); color:#34d399;
        }
        .vendor-status.pending{
          background:rgba(251,191,36,0.2); color:#fbbf24;
        }
        .vendor-actions{
          display:flex; gap:8px;
        }
        .vendor-btn{
          padding:8px; border-radius:10px; border:none; cursor:pointer; transition:all 0.2s;
          background:rgba(255,255,255,.06); border:1px solid var(--glass-border);
        }
        .vendor-btn:hover{
          background:rgba(255,255,255,.12);
          transform:scale(1.05);
        }
        .vendor-btn svg{
          width:16px; height:16px; color:var(--text);
        }

        /* Modal Styles */
        .modal-overlay{
          position:fixed; inset:0; background:rgba(0,0,0,0.6); 
          display:grid; place-items:center; z-index:1000; padding:20px;
          backdrop-filter:blur(4px);
        }
        .modal{
          background:var(--card); border:1px solid var(--glass-border);
          border-radius:20px; padding:24px; width:100%; max-width:500px;
          box-shadow:0 24px 48px rgba(0,0,0,.5);
          max-height:90vh; overflow-y:auto;
        }
        .modal-header{
          font-size:22px; font-weight:900; margin-bottom:20px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .modal-close{
          background:rgba(255,255,255,.06); border:1px solid var(--glass-border);
          width:32px; height:32px; border-radius:50%; cursor:pointer;
          display:grid; place-items:center; transition:all 0.2s;
        }
        .modal-close:hover{
          background:rgba(255,255,255,.12);
        }
        .modal-content{
          margin-bottom:20px;
        }
        .modal-field{
          margin-bottom:16px;
        }
        .modal-label{
          color:var(--muted); font-size:13px; margin-bottom:6px; display:block;
        }
        .modal-value{
          font-weight:700; font-size:15px;
        }
        .modal-input, .modal-select{
          width:100%; padding:12px; border-radius:12px;
          background:rgba(255,255,255,.06); border:1px solid var(--glass-border);
          color:var(--text); font-size:14px;
        }
        .modal-input:focus, .modal-select:focus{
          outline:none; border-color:var(--accent2);
        }
        .modal-btn{
          width:100%; padding:12px; border-radius:12px; border:none;
          font-weight:800; font-size:14px; cursor:pointer; transition:all 0.3s;
        }
        .modal-btn-primary{
          background:var(--accent); color:#fff; margin-bottom:10px;
        }
        .modal-btn-primary:hover{
          background:var(--accent2);
        }
        .modal-btn-secondary{
          background:rgba(255,255,255,.06); color:var(--text);
        }
        .modal-btn-secondary:hover{
          background:rgba(255,255,255,.12);
        }

        /* Card Detail Modal */
        .card-modal{
          max-width:600px;
        }
        .card-modal-header{
          display:flex; align-items:center; gap:16px; margin-bottom:24px;
        }
        .card-modal-icon{
          width:64px; height:64px; border-radius:16px; display:grid; place-items:center;
          box-shadow:0 8px 24px rgba(0,0,0,.3);
        }
        .card-modal-icon svg{
          width:32px; height:32px; color:#fff;
        }
        .card-modal-info{
          flex:1;
        }
        .card-modal-title{
          font-size:24px; font-weight:900; margin-bottom:4px;
        }
        .card-modal-subtitle{
          color:var(--muted); font-size:14px;
        }
        .card-stats{
          background:rgba(255,255,255,.06); border:1px solid var(--glass-border);
          border-radius:14px; padding:16px; margin-bottom:20px;
        }
        .card-stat-row{
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:12px;
        }
        .card-stat-row:last-child{
          margin-bottom:0;
        }
        .card-stat-label{
          color:var(--muted); font-weight:600;
        }
        .card-stat-value{
          font-size:24px; font-weight:900;
        }
        .card-stat-change{
          font-size:16px; font-weight:800;
        }
        .card-stat-change.positive{
          color:#34d399;
        }
        .card-stat-change.negative{
          color:#f87171;
        }
        .card-section-title{
          font-weight:800; margin-bottom:12px; font-size:16px;
        }
        .card-list{
          display:grid; gap:8px; margin-bottom:20px;
        }
        .card-list-item{
          display:flex; justify-content:space-between; align-items:center;
          padding:12px; background:rgba(57,160,255,0.1); border-radius:12px;
          transition:background 0.2s;
        }
        .card-list-item:hover{
          background:rgba(57,160,255,0.15);
        }
        .card-list-item-text{
          color:var(--text);
        }
        .card-list-item-btn{
          background:none; border:none; color:var(--accent2);
          font-weight:800; cursor:pointer; font-size:13px;
        }
        .card-list-item-btn:hover{
          color:var(--accent);
        }
        .revenue-breakdown{
          display:grid; gap:12px; margin-bottom:20px;
        }
        .revenue-item{
          padding:12px; background:rgba(159,78,248,0.1); border-radius:12px;
        }
        .revenue-item-header{
          display:flex; justify-content:space-between; margin-bottom:8px;
        }
        .revenue-item-label{
          color:var(--text);
        }
        .revenue-item-value{
          font-weight:800;
        }
        .revenue-bar-bg{
          width:100%; height:8px; background:rgba(159,78,248,0.2); border-radius:4px;
          overflow:hidden;
        }
        .revenue-bar-fill{
          height:100%; background:var(--accent); border-radius:4px;
          transition:width 0.5s ease;
        }

        /* Responsive tweaks */
        @media (max-width: 640px){
          .title{ font-size:24px; }
          .top-kpi-value{ font-size:24px; }
          .ai-insights-title{ font-size:18px; }
        }
      `}</style>

      <div className="content">
        {/* HEADER */}
        <div className="header">
          <div className="title">Dashboard</div>
          <div className="seg" role="tablist" aria-label="Time range">
            {["today","week","month"].map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={range===r}
                className={range===r ? "active" : ""}
                onClick={()=>setRange(r)}
              >
                {r[0].toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* TOP KPI CARDS */}
        <div className="top-kpis">
          <div className="top-kpi" onClick={() => handleCardClick('orders')}>
            <div className="top-kpi-header">
              <div className="top-kpi-icon" style={{background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)'}}>
                <Package style={{width:24, height:24, color:'#fff'}} />
              </div>
              <div className="top-kpi-change positive">+12%</div>
            </div>
            <div className="top-kpi-label">Orders {range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}</div>
            <div className="top-kpi-value">{data.orders.toLocaleString()}</div>
          </div>

          <div className="top-kpi" onClick={() => handleCardClick('revenue')}>
            <div className="top-kpi-header">
              <div className="top-kpi-icon" style={{background: 'linear-gradient(135deg, #8B5CF6, #EC4899)'}}>
                <DollarSign style={{width:24, height:24, color:'#fff'}} />
              </div>
              <div className="top-kpi-change positive">+23%</div>
            </div>
            <div className="top-kpi-label">Revenue</div>
            <div className="top-kpi-value">{data.revenue}</div>
          </div>

          <div className="top-kpi" onClick={() => handleCardClick('users')}>
            <div className="top-kpi-header">
              <div className="top-kpi-icon" style={{background: 'linear-gradient(135deg, #06B6D4, #3B82F6)'}}>
                <Users style={{width:24, height:24, color:'#fff'}} />
              </div>
              <div className="top-kpi-change positive">+8%</div>
            </div>
            <div className="top-kpi-label">New Users</div>
            <div className="top-kpi-value">{data.newUsers}</div>
          </div>

          <div className="top-kpi" onClick={() => handleCardClick('deliveries')}>
            <div className="top-kpi-header">
              <div className="top-kpi-icon" style={{background: 'linear-gradient(135deg, #A78BFA, #8B5CF6)'}}>
                <Clock style={{width:24, height:24, color:'#fff'}} />
              </div>
              <div className="top-kpi-change negative">-5%</div>
            </div>
            <div className="top-kpi-label">Pending Deliveries</div>
            <div className="top-kpi-value">{data.pendingDeliveries}</div>
          </div>
        </div>

        {/* AI INSIGHTS BANNER */}
        <div className="ai-insights">
          <div className="ai-insights-title">
            <TrendingUp style={{width:24, height:24}} />
            <span>AI Insights</span>
          </div>
          <div className="ai-insights-grid">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="ai-insight-card">
                <div className="ai-insight-label">{insight.title}</div>
                <div className="ai-insight-value">{insight.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid">
          {/* LEFT: KPIs + Charts */}
          <section className="card">
            {/* KPI CARDS */}
            <div className="kpis">
              <div className="kpi">
                <div className="label">Orders</div>
                <div className="value">{data.orders.toLocaleString()}</div>
              </div>
              <div className="kpi">
                <div className="label">On-Time Rate</div>
                <div className="value">{Math.round(data.ontime * 100)}%</div>
              </div>
              <div className="kpi">
                <div className="label">Avg ETA</div>
                <div className="value">{data.avgEta}</div>
              </div>
              <div className="kpi">
                <div className="label">Active Drivers</div>
                <div className="value">{data.drivers}</div>
              </div>
            </div>

            {/* SPARKLINE */}
            <div className="spark-wrap">
              <div className="spark-meta">
                <div className="spark-title">Orders Trend</div>
                <div className="muted">
                  Showing {range === "today" ? "today's hours" : range === "week" ? "last 7 days" : "last 7 weeks"}
                </div>
                <div className="legend">
                  <span className="dot p" /> <span className="muted">Orders</span>
                </div>
              </div>

              <svg width={spark.w} height={spark.h} viewBox={`0 0 ${spark.w} ${spark.h}`} style={{ display: "block" }}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(57,160,255,.7)" />
                    <stop offset="100%" stopColor="rgba(57,160,255,.05)" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${spark.xs[0]},${spark.ys[0]} L ${spark.points} L ${spark.xs.at(-1)},${spark.h - spark.pad} L ${spark.xs[0]},${spark.h - spark.pad} Z`}
                  fill="url(#g1)"
                  stroke="none"
                />
                <polyline
                  points={spark.points}
                  fill="none"
                  stroke="var(--accent2)"
                  strokeWidth="2.2"
                />
              </svg>
            </div>

            {/* DONUTS */}
            <div className="donuts">
              <div
                className="donut"
                style={{ ["--angle"]: `${(donutAngle(data.ontime) / 100) * 360}deg` }}
              >
                <div className="ring" style={{ ["--angle"]: `${(donutAngle(data.ontime) / 100) * 360}deg` }}>
                  <div className="ring-inner">{Math.round(data.ontime * 100)}%</div>
                </div>
                <div>
                  <div className="value">On-Time</div>
                  <div className="label">{data.onTimeCount.toLocaleString()} deliveries</div>
                </div>
              </div>

              <div
                className="donut"
                style={{ ["--angle"]: `${(donutAngle(1 - data.ontime) / 100) * 360}deg` }}
              >
                <div className="ring" style={{
                  ["--angle"]: `${(donutAngle(1 - data.ontime) / 100) * 360}deg`,
                  background: `
                    conic-gradient(#ff6b6b 0deg ${(donutAngle(1 - data.ontime) / 100) * 360}deg, rgba(255,255,255,.12) ${(donutAngle(1 - data.ontime) / 100) * 360}deg 360deg),
                    #0e0e12`
                }}>
                  <div className="ring-inner">{Math.round((1 - data.ontime) * 100)}%</div>
                </div>
                <div>
                  <div className="value">Late</div>
                  <div className="label">{data.lateCount.toLocaleString()} deliveries</div>
                </div>
              </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-title">Orders This Week</div>
                <div style={{width: '100%', height: 200}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.trend.map((val, idx) => ({ 
                      day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][idx] || `Day ${idx+1}`, 
                      orders: val 
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="day" stroke="var(--muted)" style={{ fontSize: '11px' }} />
                      <YAxis stroke="var(--muted)" style={{ fontSize: '11px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(32,34,42,0.95)', 
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.16)',
                          color: '#e7e9ff'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#39a0ff" 
                        strokeWidth={2}
                        dot={{ fill: '#39a0ff', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-title">Category Distribution</div>
                <div style={{width: '100%', height: 200}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(32,34,42,0.95)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.16)',
                          color: '#e7e9ff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: Recent + Top Locations */}
          <aside className="card">
            <div className="activity">
              <div className="row">
                <div style={{ fontWeight: 900, fontSize: 18 }}>Recent Activity</div>
                <div className="muted">{range === "today" ? "Today" : range === "week" ? "Past 7 days" : "Past 30 days"}</div>
              </div>
              <div className="feed">
                <div className="pill">
                  <span className="id">D2G-78421</span>
                  <span className="status">Out for Delivery</span>
                </div>
                <div className="pill">
                  <span className="id">D2G-55203</span>
                  <span className="status">Picked Up</span>
                </div>
                <div className="pill">
                  <span className="id">D2G-33880</span>
                  <span className="status" style={{ color: "#a0ffc9" }}>Delivered</span>
                </div>
              </div>

              <div style={{ fontWeight: 900, marginTop: 20, fontSize: 18 }}>Top Locations</div>
              <table>
                <thead>
                  <tr>
                    <th>Area</th>
                    <th>Orders</th>
                    <th>On-Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Central London</td>
                    <td>1,120</td>
                    <td>95%</td>
                  </tr>
                  <tr>
                    <td>Westminster</td>
                    <td>860</td>
                    <td>92%</td>
                  </tr>
                  <tr>
                    <td>Camden Town</td>
                    <td>640</td>
                    <td>90%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside>
        </div>

        {/* VENDOR MANAGEMENT SECTION */}
        <div className="vendor-section">
          <div className="card">
            <div className="vendor-title">Vendor Management</div>
            <div className="vendor-table-wrap">
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Products</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorList.map((vendor) => (
                    <tr key={vendor.id}>
                      <td style={{fontWeight: 700}}>{vendor.name}</td>
                      <td>{vendor.products}</td>
                      <td>
                        <div className="vendor-rating">
                          <span className="vendor-star">★</span>
                          <span style={{fontWeight: 600}}>{vendor.rating}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`vendor-status ${vendor.status.toLowerCase()}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td>
                        <div className="vendor-actions">
                          <button className="vendor-btn" onClick={() => handleView(vendor)}>
                            <Eye />
                          </button>
                          <button className="vendor-btn" onClick={() => handleEdit(vendor)}>
                            <Edit2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* VENDOR MODAL */}
      {selectedVendor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span>{modalType === "view" ? "View Vendor Details" : "Edit Vendor"}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {modalType === "view" ? (
              <div className="modal-content">
                <div className="modal-field">
                  <div className="modal-label">Name</div>
                  <div className="modal-value">{selectedVendor.name}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Products</div>
                  <div className="modal-value">{selectedVendor.products}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Status</div>
                  <div className="modal-value">{selectedVendor.status}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Rating</div>
                  <div className="modal-value">{selectedVendor.rating} ★</div>
                </div>
              </div>
            ) : (
              <div className="modal-content">
                <div className="modal-field">
                  <label className="modal-label">Vendor Name</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={editedVendor.name}
                    onChange={(e) => setEditedVendor({...editedVendor, name: e.target.value})}
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Products</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={editedVendor.products}
                    onChange={(e) => setEditedVendor({...editedVendor, products: parseInt(e.target.value)})}
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Status</label>
                  <select
                    className="modal-select"
                    value={editedVendor.status}
                    onChange={(e) => setEditedVendor({...editedVendor, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label className="modal-label">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="modal-input"
                    value={editedVendor.rating}
                    onChange={(e) => setEditedVendor({...editedVendor, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <button className="modal-btn modal-btn-primary" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            )}

            <button className="modal-btn modal-btn-secondary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* CARD DETAIL MODAL */}
      {selectedCard && (
        <div className="modal-overlay" onClick={closeCardModal}>
          <div className="modal card-modal" onClick={(e) => e.stopPropagation()}>
            <div className="card-modal-header">
              <div className="card-modal-icon" style={{
                background: selectedCard === 'orders' ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' :
                           selectedCard === 'revenue' ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' :
                           selectedCard === 'users' ? 'linear-gradient(135deg, #06B6D4, #3B82F6)' :
                           'linear-gradient(135deg, #A78BFA, #8B5CF6)'
              }}>
                {selectedCard === 'orders' && <Package />}
                {selectedCard === 'revenue' && <DollarSign />}
                {selectedCard === 'users' && <Users />}
                {selectedCard === 'deliveries' && <Clock />}
              </div>
              <div className="card-modal-info">
                <div className="card-modal-title">
                  {selectedCard === 'orders' && `Orders ${range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}`}
                  {selectedCard === 'revenue' && 'Revenue'}
                  {selectedCard === 'users' && 'New Users'}
                  {selectedCard === 'deliveries' && 'Pending Deliveries'}
                </div>
                <div className="card-modal-subtitle">Detailed information and actions</div>
              </div>
              <button className="modal-close" onClick={closeCardModal}>✕</button>
            </div>

            <div className="card-stats">
              <div className="card-stat-row">
                <span className="card-stat-label">Current Value</span>
                <span className="card-stat-value">
                  {selectedCard === 'orders' && data.orders.toLocaleString()}
                  {selectedCard === 'revenue' && data.revenue}
                  {selectedCard === 'users' && data.newUsers}
                  {selectedCard === 'deliveries' && data.pendingDeliveries}
                </span>
              </div>
              <div className="card-stat-row">
                <span className="card-stat-label">Change</span>
                <span className={`card-stat-change ${
                  (selectedCard === 'orders' || selectedCard === 'revenue' || selectedCard === 'users') ? 'positive' : 'negative'
                }`}>
                  {selectedCard === 'orders' && '+12%'}
                  {selectedCard === 'revenue' && '+23%'}
                  {selectedCard === 'users' && '+8%'}
                  {selectedCard === 'deliveries' && '-5%'}
                </span>
              </div>
            </div>

            {/* Orders Modal Content */}
            {selectedCard === 'orders' && (
              <>
                <div className="card-section-title">Recent Orders</div>
                <div className="card-list">
                  {[
                    { id: '#1247', vendor: 'Fresh Mart' },
                    { id: '#1246', vendor: 'Tech Hub' },
                    { id: '#1245', vendor: 'Quick Bites' },
                    { id: '#1244', vendor: 'Health Plus' }
                  ].map((order, idx) => (
                    <div key={idx} className="card-list-item">
                      <span className="card-list-item-text">Order {order.id} - {order.vendor}</span>
                      <button className="card-list-item-btn" onClick={() => handleOrderView(`Order ${order.id}`)}>
                        View
                      </button>
                    </div>
                  ))}
                </div>
                <button className="modal-btn modal-btn-primary" onClick={handleViewAllOrders}>
                  View All Orders
                </button>
              </>
            )}

            {/* Revenue Modal Content */}
            {selectedCard === 'revenue' && (
              <>
                <div className="card-section-title">Revenue Breakdown</div>
                <div className="revenue-breakdown">
                  {[
                    { name: 'Food Delivery', value: '$5,234', percent: 42 },
                    { name: 'Groceries', value: '$4,112', percent: 33 },
                    { name: 'Other', value: '$3,112', percent: 25 }
                  ].map((item, idx) => (
                    <div key={idx} className="revenue-item">
                      <div className="revenue-item-header">
                        <span className="revenue-item-label">{item.name}</span>
                        <span className="revenue-item-value">{item.value}</span>
                      </div>
                      <div className="revenue-bar-bg">
                        <div className="revenue-bar-fill" style={{width: `${item.percent}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="modal-btn modal-btn-primary" onClick={handleDownloadReport}>
                  Download Report
                </button>
              </>
            )}

            {/* Users Modal Content */}
            {selectedCard === 'users' && (
              <>
                <div className="card-section-title">Recent Registrations</div>
                <div className="card-list">
                  {[
                    { name: 'John Doe', time: '2 min ago' },
                    { name: 'Sarah Smith', time: '15 min ago' },
                    { name: 'Mike Johnson', time: '1 hour ago' },
                    { name: 'Emma Wilson', time: '2 hours ago' }
                  ].map((user, idx) => (
                    <div key={idx} className="card-list-item">
                      <span className="card-list-item-text">{user.name} - {user.time}</span>
                      <button className="card-list-item-btn" onClick={() => handleViewProfile(user.name)}>
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
                <button className="modal-btn modal-btn-primary" onClick={handleViewAllUsers}>
                  View All Users
                </button>
              </>
            )}

            {/* Deliveries Modal Content */}
            {selectedCard === 'deliveries' && (
              <>
                <div className="card-section-title">Pending Orders</div>
                <div className="card-list">
                  {[
                    { id: '#1250', status: 'In Transit' },
                    { id: '#1249', status: 'Preparing' },
                    { id: '#1248', status: 'Out for Delivery' },
                    { id: '#1247', status: 'Preparing' }
                  ].map((delivery, idx) => (
                    <div key={idx} className="card-list-item">
                      <span className="card-list-item-text">Order {delivery.id} - {delivery.status}</span>
                      <button className="card-list-item-btn" onClick={() => handleTrackDelivery(`Order ${delivery.id}`)}>
                        Track
                      </button>
                    </div>
                  ))}
                </div>
                <button className="modal-btn modal-btn-primary" onClick={handleManageDeliveries}>
                  Manage Deliveries
                </button>
              </>
            )}

            <button className="modal-btn modal-btn-secondary" onClick={closeCardModal}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
