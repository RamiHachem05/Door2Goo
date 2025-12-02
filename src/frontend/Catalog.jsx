import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../frontend/axios";

const CATEGORIES = [
  "All", "Groceries", "Pharmacy", "Electronics", "Food", 
  "Gifts", "Pets", "Office", "Home",
];

export default function Catalog() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        setProductsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        toast.error("Failed to load products");
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("d2g_token");
    if (!token) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const products = useMemo(() => {
    let items = productsData.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (category !== "All") items = items.filter((p) => p.category === category);
    
    if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
    else if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    
    return items;
  }, [query, category, sort, productsData]);

  return (
    <div className="page">
      <style>{`
        :root{ --bg:#1a1a1f; --card:#20222a; --text:#e7e9ff; --muted:#a5afc3; --accent:#9f4ef8; --accent2:#39a0ff; --glass-border: rgba(255,255,255,0.16); }
        *{ box-sizing:border-box }

        .page{ min-height:100vh; background:var(--bg); color:var(--text); font-family:system-ui; }
        .content{ padding-top:78px; }
        .container{ max-width:1200px; margin:0 auto; padding:18px 16px 32px; }

        .header{ display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
        .title{ font-size:28px; font-weight:900; }
        .tools{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex: 1; justify-content: flex-end; }

        .search{ display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.06); border:1px solid var(--glass-border); padding:8px 12px; border-radius:12px; min-width:240px; }
        .search input{ background:transparent; border:none; outline:none; color:var(--text); width:100%; font-size:14px; }

        .select{ background-color: #20222a; color: #fff; border:1px solid var(--glass-border); border-radius:12px; padding:10px 12px; }

        .chips{ display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 16px; overflow-x: auto; padding-bottom: 5px; }
        .chip{ border:1px solid var(--glass-border); padding:8px 12px; border-radius:999px; background:rgba(255,255,255,0.04); color:var(--text); cursor:pointer; font-weight:700; font-size:13px; white-space: nowrap; }
        .chip.active{ background:linear-gradient(135deg,var(--accent),var(--accent2)); border-color:transparent; }

        /* ✅ RESPONSIVE GRID: 2 columns on mobile, more on desktop */
        .grid{ 
          display:grid; 
          gap:16px; 
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); 
        }
        @media (min-width: 600px) {
           .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        }

        .card{ border:1px solid var(--glass-border); border-radius:16px; overflow:hidden; background:#20222a; display:flex; flex-direction:column; }
        .thumb{ width:100%; height:140px; background:#000; }
        .thumb img{ width:100%; height:100%; object-fit:cover; }

        .body{ padding:12px 10px; display:flex; flex-direction:column; flex:1; }
        .p-title{ font-weight:800; font-size:14px; line-height: 1.2; margin-bottom: 4px; }
        .muted{ color:var(--muted); font-size:12px; }
        .row{ display:flex; align-items:center; justify-content:space-between; margin-top: 8px; }
        .price{ font-weight:900; font-size: 16px; }
        .rating{ color:#ffd36b; font-weight:700; font-size: 12px; }

        .actions{ display:flex; gap:8px; margin-top:12px; flex-direction: column; }
        @media (min-width: 500px) { .actions { flex-direction: row; } }
        
        .btn{ border:none; border-radius:10px; padding:10px; font-weight:800; cursor:pointer; font-size: 13px; flex: 1; }
        .btn-primary{ background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; }
        .btn-ghost{ background:transparent; border:1px solid var(--glass-border); color:var(--text); }

        /* Mobile specific adjustments */
        @media (max-width: 600px) {
          .header { flex-direction: column; align-items: flex-start; }
          .tools, .search { width: 100%; }
        }
      `}</style>

      <div className="content">
        <div className="container">
          <div className="header">
            <div className="title">Catalog</div>
            <div className="tools">
              <div className="search">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                />
              </div>
              <select
                className="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="chips">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <h3 style={{textAlign:'center', color:'var(--muted)'}}>Loading products...</h3>
          ) : (
            <div className="grid">
              {products.map((p) => (
                <article className="card" key={p._id}>
                  <div className="thumb">
                    <img
                      src={p.image || "https://via.placeholder.com/400"}
                      alt={p.name}
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400")}
                    />
                  </div>
                  <div className="body">
                    <div className="p-title">{p.name}</div>
                    <div className="muted">{p.category}</div>
                    <div className="row">
                      <div className="price">${p.price.toFixed(2)}</div>
                      <div className="rating">★ {p.rating || 4.5}</div>
                    </div>
                    <div className="actions">
                      <button className="btn btn-ghost" onClick={() => navigate("/Details/" + p._id)}>
                        Details
                      </button>
                      <button className="btn btn-primary" onClick={() => addToCart(p._id)}>
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}