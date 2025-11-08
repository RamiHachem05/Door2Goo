// src/NavbarProject/Catalog.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------- your data (unchanged) ----------
const SAMPLE_PRODUCTS = [
  // Groceries
  { id: 1,  title: "Organic Apples",       category: "Groceries",  rating: 4.6, price: 3.49,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ2LwbdCOjslTCA5dgk1hmRlut-n6RUOeFRQ&s" },
  { id: 2,  title: "Whole Wheat Bread",    category: "Groceries",  rating: 4.5, price: 2.19,  img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop" },
  { id: 3,  title: "Milk Carton",          category: "Groceries",  rating: 4.7, price: 1.59,  img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&auto=format&fit=crop"},
  { id: 4,  title: "Pure Cane Sugar",      category: "Groceries",  rating: 4.8, price: 2.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_5j4yq3c3XYsmNmo2UtMEzMXx_t0kpHraw&s"},
  { id: 5,  title: "Bottled Mineral Water",category: "Groceries",  rating: 4.4, price: 0.89,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF6YwomaigQR7cccr3kSpFtylldoktyeTXbw&s" },

  // Pharmacy
  { id: 6,  title: "Aspirin",              category: "Pharmacy",   rating: 4.8, price: 4.50,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIv_JFHCfjdrVE9QgfHpmlRnylKgL9IqWNpw&s"},
  { id: 7,  title: "Bandages",             category: "Pharmacy",   rating: 4.6, price: 1.99,  img: "https://m.media-amazon.com/images/I/81gv+J2XzHL._AC_SL1500_.jpg" },
  { id: 8,  title: "Cough Syrup",          category: "Pharmacy",   rating: 4.9, price: 6.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLlBVi6q5bkDYN_dy8oBfb7APurYEI9bJT3w&s" },
  { id: 9,  title: "Vitamin C Tablets",    category: "Pharmacy",   rating: 4.7, price: 5.49,  img: "https://www.healthspan.co.uk/Images/Product/Default/xlarge/HS-Orange-Effervescent-Vitamin-C-1000mg-tube-FF8-_2048px_VCEF1040-Sep25.png" },
  { id:10,  title: "Digital Thermometer",  category: "Pharmacy",   rating: 4.8, price:12.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJOF7T1bCDe4Al9ILBxgW1KmvzOao-NeUGlQ&s"},

  // Electronics
  { id:11,  title: "Wireless Headphones",  category: "Electronics",rating: 4.5, price:39.99,  img: "https://cdn.shopify.com/s/files/1/0552/0883/7292/products/sony-WH-CH520-Wireless-Headphones.jpg?v=1680695555"},
  { id:12,  title: "USB Charger",          category: "Electronics",rating: 4.4, price: 8.99,  img: "https://m.media-amazon.com/images/I/61MyHRuZHNL._AC_SL1500_.jpg" },
  { id:13,  title: "Smartphone Case",      category: "Electronics",rating: 4.3, price:12.49,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1bAdlxrJS0i8P_4x5iocFJC5oEnngoyNt9w&s"},
  { id:14,  title: "Smartwatch",           category: "Electronics",rating: 4.7, price:59.00,  img: "https://rukminim2.flixcart.com/image/480/640/xif0q/shopsy-smartwatch/a/s/z/1-44-android-ios-android-smart-watch-men-4g-network-bt-call-gps-original-imagvy24dhbhe8zx.jpeg?q=90" },
  { id:15,  title: "Bluetooth Speaker",    category: "Electronics",rating: 4.6, price:22.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-1UYtybdF_4ig8RTfB9Ujbkb_ypcQh2kNkA&s"},

  // Food
  { id:16,  title: "Pizza Slice",          category: "Food",       rating: 4.7, price: 3.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTog4ACm0vIRHdmml_FgepznxIz9arjHXx4gA&s" },
  { id:17,  title: "Burger",               category: "Food",       rating: 4.8, price: 5.49,  img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop"},
  { id:18,  title: "Salad Bowl",           category: "Food",       rating: 4.6, price: 4.99,  img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop" },
  { id:19,  title: "Sushi Roll",           category: "Food",       rating: 4.9, price: 6.49,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1BKC57WRG66MIUxowtsTWHr9_rItwpD2aDA&s" },
  { id:20,  title: "Pasta Plate",          category: "Food",       rating: 4.7, price: 5.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvIQxaujJ2_ywFTV-2EJ5V2Z_J0D0U4GdQ4w&s" },

  // Gifts
  { id:21,  title: "Bouquet of Roses",     category: "Gifts",      rating: 4.4, price:14.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3vhoGIjiEFUwuHXe3Uz7tHIpx3gCHlZJcrQ&s"},
  { id:22,  title: "Chocolate Box",        category: "Gifts",      rating: 4.5, price: 9.99,  img: "https://carouselchocolates.co.uk/wp-content/uploads/2014/10/24-Chocolate-Box-2-copy.jpg"},
  { id:23,  title: "Greeting Card",        category: "Gifts",      rating: 4.3, price: 2.49,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSybKpg7Ht9C28IRns8tYm1sTQYTOY4xPYL1Q&s"},
  { id:24,  title: "Teddy Bear",           category: "Gifts",      rating: 4.6, price:12.99,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREZtsVAvqFGIGLiBSXIw2R3ej8S9Xq2cwOPw&s" },
  { id:25,  title: "Scented Candle",       category: "Gifts",      rating: 4.7, price: 6.49,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS04DuPqfb86J8J3w6S3y7rTU8iAefcl8qS6g&s"},

  // Pets
  { id:26,  title: "Dog Food",             category: "Pets",       rating: 4.3, price:11.99,  img: "https://www.petriotics.com/cdn/shop/files/Large_-_2024-06-06T125108.566_596x700.png?v=1741867644"},
  { id:27,  title: "Cat Toy",              category: "Pets",       rating: 4.4, price: 3.29,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt1_aQMoxPwGISEgdmgv_E7pxCblU2r-7hQg&s" },
  { id:28,  title: "Pet Shampoo",          category: "Pets",       rating: 4.2, price: 5.79,  img: "https://m.media-amazon.com/images/I/71e5MZsT79L.AC_UF350,350_QL80.jpg" },

  // Office
  { id:29,  title: "Notebook",             category: "Office",     rating: 4.2, price: 2.99,  img: "https://m.media-amazon.com/images/I/71u5-wVIYuL.AC_SL1500.jpg"},
  { id:30,  title: "Pen Set",              category: "Office",     rating: 4.1, price: 1.49,  img: "https://images-cdn.ubuy.co.in/667117571f567314cb1cd5d6-colorit-gel-pens-for-adult-coloring.jpg"},
  { id:31,  title: "Stapler",              category: "Office",     rating: 4.0, price: 4.25,  img: "https://m.media-amazon.com/images/I/71EC6Is60uL.AC_SL1500.jpg"},
  { id:32,  title: "Desk Lamp",            category: "Office",     rating: 4.4, price:16.99,  img: "https://i5.walmartimages.com/seo/Home-Decorative-Mainstays-LED-Architect-Desk-Lamp-Black-Metal-Powder-Coating-Finish-for-All-Ages_2416f3cf-e5d2-4e9d-9612-d2ad61a014e0.ce7d149337e1d115ba4a61a2c3a11904.jpeg" },
  { id:33,  title: "Office Chair",         category: "Office",     rating: 4.5, price:79.00,  img: "https://m.media-amazon.com/images/I/61Ln1oKWgcL.AC_SL1500.jpg" },

  // Home
  { id:34,  title: "Laundry Detergent",    category: "Home",       rating: 4.6, price:10.49,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS66YGWpEXZpUFjMfkMn91NgDOFiPwUJQs_7A&s"},
  { id:35,  title: "Dish Soap",            category: "Home",       rating: 4.5, price: 2.39,  img: "https://res.cloudinary.com/hksqkdlah/image/upload/c_fill,dpr_2.0,f_auto,fl_lossy.progressive.strip_profile,g_faces:auto,h_240,q_auto:low,w_400/v1/ATK%20Reviews/2025/Dish%20Soap/SPS_DishSoap-Hero-9" },
  { id:36,  title: "Vacuum Cleaner",       category: "Home",       rating: 4.7, price:99.00,  img: "https://i5.walmartimages.com/asr/3956abde-4a9e-4937-8b88-3948ce14ce9d.ff364eac54a371b44bbe0a0e5b5efe60.jpeg"},
  { id:37,  title: "Air Freshener",        category: "Home",       rating: 4.3, price: 3.49,  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYAA0wH7mRFEfeYx4OfvkLPksWMQA3FDiKhg&s"},
  { id:38,  title: "Table Lamp",           category: "Home",       rating: 4.4, price:14.99,  img: "https://www.assets.signify.com/is/image/Signify/582026%20PHILIPS%20Ornate%20Wood%20TableLamp%20E27-MAP?wid=375&hei=375&qlt=82"},
];

const CATEGORIES = ["All", "Groceries", "Pharmacy", "Electronics", "Food", "Gifts", "Pets", "Office", "Home"];

// ---------- component ----------
export default function Catalog() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const products = useMemo(() => {
    let items = SAMPLE_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    if (category !== "All") items = items.filter(p => p.category === category);
    switch (sort) {
      case "price-asc":  items = items.slice().sort((a,b)=>a.price-b.price); break;
      case "price-desc": items = items.slice().sort((a,b)=>b.price-a.price); break;
      case "rating":     items = items.slice().sort((a,b)=>b.rating-a.rating); break;
      default: break;
    }
    return items;
  }, [query, category, sort]);

  return (
    <div className="page">
      <style>{`
        :root{
          --bg:#1a1a1f; --card:#20222a; --text:#e7e9ff; --muted:#a5afc3;
          --accent:#9f4ef8; --accent2:#39a0ff; --glass-border: rgba(255,255,255,0.16);
        }
        *{ box-sizing:border-box } .page{ min-height:100vh; background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
        .content{ padding-top:78px; } .container{ max-width:1200px; margin:0 auto; padding:18px 16px 32px; }
        .header{ display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
        .title{ font-size:28px; font-weight:900; letter-spacing:.3px; }
        .tools{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .search{ display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.06); border:1px solid var(--glass-border); padding:8px 12px; border-radius:12px; min-width:240px; }
        .search input{ background:transparent; border:none; outline:none; color:var(--text); width:180px; font-size:14px; }
        .select{ background:rgba(255,255,255,0.06); color:var(--text); border:1px solid var(--glass-border); border-radius:12px; padding:10px 12px; cursor:pointer; }
        .chips{ display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 16px; }
        .chip{ border:1px solid var(--glass-border); padding:8px 12px; border-radius:999px; background:rgba(255,255,255,0.04); color:var(--text); cursor:pointer; font-weight:700; font-size:13px; transition:transform .1s ease, background .2s ease; }
        .chip:hover{ transform:translateY(-1px); background:rgba(255,255,255,0.08); }
        .chip.active{ background:linear-gradient(135deg,var(--accent),var(--accent2)); border-color:transparent; }
        .grid{ display:grid; gap:16px; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); }
        .card{ border:1px solid var(--glass-border); border-radius:16px; overflow:hidden; background:linear-gradient(180deg,rgba(32,34,42,.9),rgba(32,34,42,.7)); box-shadow:0 10px 28px rgba(0,0,0,.35); display:flex; flex-direction:column; }
        .thumb{ position:relative; width:100%; height:160px; overflow:hidden; background:#0f0f13; }
        .thumb img{ width:100%; height:100%; object-fit:cover; display:block; filter:saturate(105%); transform:scale(1.02); transition: transform 0.3s ease; }
        .card:hover .thumb img { transform: scale(1.05); }
        .body{ padding:12px 14px; display:flex; flex-direction:column; gap:6px; }
        .p-title{ font-weight:800; font-size:15px; line-height:1.3; }
        .muted{ color:var(--muted); font-size:13px; }
        .row{ display:flex; align-items:center; justify-content:space-between }
        .price{ font-weight:900; } .rating{ color:#ffd36b; font-weight:700; }
        .actions{ display:flex; gap:8px; margin-top:8px }
        .btn{ appearance:none; border:none; border-radius:10px; padding:10px 12px; font-weight:800; cursor:pointer; transition: all 0.2s ease; }
        .btn-primary{ background:linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; box-shadow:0 0 18px rgba(159,78,248,.35); }
        .btn-primary:hover { transform: translateY(-1px); box-shadow:0 0 24px rgba(159,78,248,.5); }
        .btn-ghost{ background:transparent; border:1px solid var(--glass-border); color:var(--text); }
        .btn-ghost:hover { background: rgba(255,255,255,0.05); }
        .footer{ margin:26px auto 40px; max-width:1200px; color:var(--muted); text-align:center; border-top:1px solid var(--glass-border); padding:16px; }
      `}</style>

      <div className="content">
        <div className="container">
          {/* Header */}
          <div className="header">
            <div className="title">Catalog</div>
            <div className="tools">
              <div className="search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-3.8-3.8M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search services…" />
              </div>
              <select className="select" value={sort} onChange={(e)=>setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div className="chips">
            {CATEGORIES.map(c => (
              <button key={c} className={`chip ${category===c ? "active":""}`} onClick={()=>setCategory(c)}>
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid">
            {products.map(p => (
              <article className="card" key={p.id}>
                <div className="thumb">
                  <img
                    src={p.img}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/400x200/1a1a1f/a5afc3?text=${encodeURIComponent(p.title)}`;
                    }}
                  />
                </div>
                <div className="body">
                  <div className="p-title">{p.title}</div>
                  <div className="muted">{p.category}</div>
                  <div className="row">
                    <div className="price">${p.price.toFixed(2)}</div>
                    <div className="rating">★ {p.rating.toFixed(1)}</div>
                  </div>
                  <div className="actions">
                    <button className="btn btn-ghost" onClick={()=>navigate("/Details/"+p.id)}>
                      Details
                    </button>
                    <button className="btn btn-primary" onClick={()=>navigate("/Signup")}>
                      Get Service
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className="footer">
          © {new Date().getFullYear()} Door2Go · All rights reserved.
        </footer>
      </div>
    </div>
  );
}
