import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Prevent scroll + close on ESC
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleClose = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/catalog");
  };

  const PRODUCTS = [
    { id: 1,  title: "Organic Apples", description: "Fresh, juicy organic apples sourced locally for a healthy snack." },
    { id: 2,  title: "Whole Wheat Bread", description: "Soft and wholesome bread made from 100% whole wheat flour." },
    { id: 3,  title: "Milk Carton", description: "Rich and creamy fresh dairy milk in a recyclable carton." },
    { id: 4,  title: "Pure Cane Sugar", description: "Premium-quality cane sugar perfect for desserts and beverages." },
    { id: 5,  title: "Bottled Mineral Water", description: "Clean and crisp mineral water sourced from natural springs." },
    { id: 6,  title: "Aspirin", description: "Trusted pain relief tablets ideal for headaches and muscle aches." },
    { id: 7,  title: "Bandages", description: "Flexible adhesive bandages to protect small cuts and wounds." },
    { id: 8,  title: "Cough Syrup", description: "Fast-acting cough syrup that soothes the throat and relieves irritation." },
    { id: 9,  title: "Vitamin C Tablets", description: "Daily immunity-boosting supplement packed with essential vitamins." },
    { id:10,  title: "Digital Thermometer", description: "Accurate and quick digital temperature readings for all ages." },
    { id:11,  title: "Wireless Headphones", description: "Noise-cancelling wireless headphones with immersive sound quality." },
    { id:12,  title: "USB Charger", description: "Compact and efficient USB wall charger for fast device charging." },
    { id:13,  title: "Smartphone Case", description: "Durable, stylish protective case that keeps your phone safe." },
    { id:14,  title: "Smartwatch", description: "Feature-rich smartwatch for fitness tracking and instant notifications." },
    { id:15,  title: "Bluetooth Speaker", description: "Portable speaker delivering clear sound and deep bass for hours." },
    { id:16,  title: "Pizza Slice", description: "Freshly baked pizza slice loaded with melted cheese and toppings." },
    { id:17,  title: "Burger", description: "Juicy grilled burger served with fresh vegetables and sauce." },
    { id:18,  title: "Salad Bowl", description: "Colorful mix of crisp vegetables tossed in a light dressing." },
    { id:19,  title: "Sushi Roll", description: "Hand-rolled sushi made with premium rice and fresh seafood." },
    { id:20,  title: "Pasta Plate", description: "Creamy pasta with Parmesan and herbs for a comforting meal." },
    { id:21,  title: "Bouquet of Roses", description: "Elegant bouquet of red roses symbolizing love and appreciation." },
    { id:22,  title: "Chocolate Box", description: "Assorted premium chocolates perfect for gifting or self-indulgence." },
    { id:23,  title: "Greeting Card", description: "Thoughtful greeting card designed for any special occasion." },
    { id:24,  title: "Teddy Bear", description: "Soft, cuddly teddy bear that brings warmth and comfort." },
    { id:25,  title: "Scented Candle", description: "Hand-poured candle releasing a calming, aromatic fragrance." },
    { id:26,  title: "Dog Food", description: "Balanced nutrition for dogs to support strength and healthy fur." },
    { id:27,  title: "Cat Toy", description: "Fun and interactive toy to keep your cat entertained for hours." },
    { id:28,  title: "Pet Shampoo", description: "Gentle shampoo that cleans and softens your pet’s coat safely." },
    { id:29,  title: "Notebook", description: "Lined notebook ideal for writing, journaling, or taking notes." },
    { id:30,  title: "Pen Set", description: "Set of smooth, long-lasting pens for school or office use." },
    { id:31,  title: "Stapler", description: "Reliable metal stapler built for everyday office organization." },
    { id:32,  title: "Desk Lamp", description: "Adjustable LED lamp offering focused lighting for study or work." },
    { id:33,  title: "Office Chair", description: "Ergonomic chair providing excellent lumbar support for long hours." },
    { id:34,  title: "Laundry Detergent", description: "Powerful detergent that removes stains while keeping fabrics soft." },
    { id:35,  title: "Dish Soap", description: "Lemon-scented dishwashing liquid cutting through grease easily." },
    { id:36,  title: "Vacuum Cleaner", description: "High-suction vacuum cleaner for quick and deep home cleaning." },
    { id:37,  title: "Air Freshener", description: "Long-lasting air freshener keeping your home smelling clean." },
    { id:38,  title: "Table Lamp", description: "Modern lamp design that brings warmth and style to any room." },
  ];

  const product = PRODUCTS.find((p) => p.id === Number(id));

  return (
    <>
      <div className="overlay" onClick={handleClose}></div>
      <div className="popup">
        <h2>{product ? product.title : "Product not found"}</h2>
        <p className="desc">
          {product ? product.description : "We couldn't find that product."}
        </p>
        <div className="actions">
          <button onClick={handleClose} className="btn-primary">OK</button>
        </div>
      </div>

      <style>{`
        .overlay {
          position: fixed;
          inset: 0;
          /* Slightly dim without hiding the catalog */
          background: rgba(0, 0, 0, 0.28);
          backdrop-filter: brightness(0.78) blur(2px) saturate(1.02);
          -webkit-backdrop-filter: brightness(0.78) blur(2px) saturate(1.02);
          z-index: 1000;
        }
        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #1e1f26;
          color: #f5f6fa;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
          width: min(500px, 90vw);
          padding: 24px 28px;
          z-index: 1001;
          text-align: center;
          animation: fadeIn 0.25s ease;
        }
        .popup h2 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .desc {
          font-size: 1rem;
          color: #d1d4df;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .actions {
          display: flex;
          justify-content: center;
        }
        .btn-primary {
          background: linear-gradient(135deg, #9f4ef8, #39a0ff);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(159,78,248,0.4);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
