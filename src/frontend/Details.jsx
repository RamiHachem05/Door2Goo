import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../frontend/axios";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load product details:", err);
        setError("Failed to load product details");
        setLoading(false);
      });

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [id]);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="overlay" onClick={handleClose}></div>

      <div className="popup">
        {loading ? (
          <h2>Loading...</h2>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          <>
            <h2>{product?.name}</h2>
            <p className="desc">{product?.description}</p>

            <div className="actions">
              <button onClick={handleClose} className="btn-primary">
                OK
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.28);
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
          width: min(500px, 90vw);
          padding: 24px 28px;
          z-index: 1001;
          text-align: center;
        }

        .popup h2 {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .desc {
          font-size: 1rem;
          color: #d1d4df;
          margin: 12px 0 20px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #9f4ef8, #39a0ff);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
