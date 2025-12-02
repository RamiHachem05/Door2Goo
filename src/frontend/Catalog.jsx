import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../frontend/axios";

const CATEGORIES = [
  "All",
  "Groceries",
  "Pharmacy",
  "Electronics",
  "Food",
  "Gifts",
  "Pets",
  "Office",
  "Home",
];

export default function Catalog() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Use 'api.get' instead of 'fetch(localhost)'
  useEffect(() => {
    api.get("/products")
      .then((res) => {
        setProductsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        // Only show toast if it's not a 404 (empty catalog)
        if (err.response && err.response.status !== 404) {
            toast.error("Failed to load products");
        }
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("d2g_token");

    if (!token) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart/add", {
        productId,
        quantity: 1,
      });

      toast.success("Item added to cart ✅");
      window.dispatchEvent(new Event("cart-updated"));

    } catch (err) {
      console.error(err);
      toast.error("Failed to add item to cart");
    }
  };

  const products = useMemo(() => {
    let items = productsData.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (category !== "All") items = items.filter((p) => p.category === category);

    switch (sort) {
      case "price-asc":
        items = items.slice().sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items = items.slice().sort((a, b) => b.price - a.price);
        break;
      case "rating":
        items = items.slice().sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return items;
  }, [query, category, sort, productsData]);

  return (
    <div className="page">
      <style>{`
        :root{
          --bg:#1a1a1f; --card:#20222a; --text:#e7e9ff; --muted:#a5afc3;
          --accent:#9f4ef8; --accent2:#39a0ff; --glass-border: rgba(255,255,255,0.16);
        }
        *{ box-sizing:border-box }

        .page{ min-height:100vh; background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
        .content{ padding-top:78px; }
        .container{ max-width:1200px; margin:0 auto; padding:18px 16px 32px; }

        .header{ display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
        .title{ font-size:28px; font-weight:900; letter-spacing:.3px; }
        .tools{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1; justify-content:flex-end; }

        .search{ display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.06); border:1px solid var(--glass-border); padding:8px 12px; border-radius:12px; min-width:240px; }
        .search input{ background:transparent; border:none; outline:none; color:var(--text); width:100%; font-size:14px; }

        .select{
          background-color: #20222a !important;
          color: #ffffff !important;
          border:1px solid var(--glass-border);
          border-radius:12px;
          padding:10px 12px;
        }

        .chips{ display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 16px; overflow-x: auto; padding-bottom: 4px; }
        .chip{ border:1px solid var(--glass-border); padding:8px 12px; border-radius:999px; background:rgba(255,255,255,0.04); color:var(--text); cursor:pointer; font-weight:700; font-size:13px; white-space:nowrap; }
        .chip.active{ background:linear-gradient(135deg,var(--accent),var(--accent2)); border-color:transparent; }

        /* Responsive Grid */
        .grid{ display:grid; gap:16px; grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); }
        @media (min-width: 600px) {
           .grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        }

        .card{ border:1px solid var(--glass-border); border-radius:16px; overflow:hidden; background:#20222a; display:flex; flex-direction:column; }

        .thumb{ width:100%; height:160px; background:#000; }
        .thumb img{ width:100%; height:100%; object-fit:cover; }

        .body{ padding:12px 14px; display:flex; flex-direction:column; flex:1; }
        .p-title{ font-weight:800; font-size:15px; margin-bottom:4px; }
        .muted{ color:var(--muted); font-size:13px; }
        .row{ display:flex; align-items:center; justify-content:space-between; margin-top: auto; padding-top: 10px; }
        .price{ font-weight:900; }
        .rating{ color:#ffd36b; font-weight:700; }

        .actions{ display:flex; gap:8px; margin-top:8px }
        .btn{ border:none; border-radius:10px; padding:10px 12px; font-weight:800; cursor:pointer; flex:1; }
        .btn-primary{ background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; }
        .btn-ghost{ background:transparent; border:1px solid var(--glass-border); color:var(--text); }
        
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
                  placeholder="Search services…"
                />
              </div>
              <select
                className="select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price Low → High</option>
                <option value="price-desc">Price High → Low</option>
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
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/400")
                      }
                    />
                  </div>
                  <div className="body">
                    <div className="p-title">{p.name}</div>
                    <div className="muted">{p.category}</div>
                    <div className="row">
                      <div className="price">${p.price.toFixed(2)}</div>
                      <div className="rating">★ {p.rating || 0}</div>
                    </div>
                    <div className="actions">
                      <button
                        className="btn btn-ghost"
                        onClick={() => navigate("/Details/" + p._id)}
                      >
                        Details
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(p._id)}
                      >
                        Add Item
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