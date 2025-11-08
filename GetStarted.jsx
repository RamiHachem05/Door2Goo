// Landing page with animation + two buttons
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hyperspeed from "./Animations/Hyperspeed";
import { hyperspeedPresets } from "./Animations/hyperspeedPresets"; // FIXED filename

export default function GetStarted() {
  const navigate = useNavigate();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev || "auto"; };
  }, []);

  const goHome = () => navigate("/home");
  const goAbout = () => navigate("/about");

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Background Animation ONLY (no controls) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Hyperspeed effectOptions={hyperspeedPresets.one} />
      </div>

      {/* Centered Overlay Content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          gap: "1.8rem",
          padding: "1rem",
          width: "min(90vw, 1000px)",
          
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            margin: 0,
            fontWeight: "bold",
            lineHeight: "1.2",
            whiteSpace: "nowrap",
          }}
        >
          DOOR2GO TO YOUR SERVICE
        </h1>

        <h2
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
            margin: 0,
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          Where quality meets speed
        </h2>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "0.8rem",
          }}
        >
          {/* Get Started – white pill */}
          <button
            onClick={goHome}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              transition: "all 0.25s ease",
              padding: "0.9rem 2rem",
              borderRadius: "50px",
              border: "none",
              background: "white",
              color: "#111",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
              cursor: "pointer",
              letterSpacing: ".2px",
            }}
          >
            Get Started
          </button>

          {/* Learn More – glass pill */}
          <button
            onClick={goAbout}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            }}
            style={{
              transition: "all 0.25s ease",
              padding: "0.9rem 2rem",
              borderRadius: "50px",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(255,255,255,0.18)",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              letterSpacing: ".2px",
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
