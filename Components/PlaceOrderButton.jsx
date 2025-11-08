import { useState, useRef } from "react";
import "./PlaceOrderButton.css";

export default function PlaceOrderButton({ onComplete }) {
    const [animating, setAnimating] = useState(false);
    const timeoutRef = useRef(null);

    const handleClick = () => {
        if (animating) return;
        setAnimating(true);

        // match your CSS timing (10s)
        timeoutRef.current = setTimeout(() => {
            setAnimating(false);
            onComplete?.(); // optional callback when finished
        }, 10000);
    };

    return (
        <div className="place-order">
            <button
                type="button"
                className={`order ${animating ? "animate" : ""}`}
                onClick={handleClick}
                aria-live="polite"
                aria-label="Place order"
            >
                {/* moving bg lines */}
                <span className="lines" />

                {/* truck + parts */}
                <div className="truck">
                    <div className="back" />
                    <div className="front">
                        <div className="window" />
                    </div>
                    <div className="light top" />
                    <div className="light bottom" />
                </div>

                {/* the box */}
                <div className="box" />

                {/* labels */}
                <span className="default">Place order</span>
                <span className="success">
                    Placed
                    <svg viewBox="0 0 12 10" aria-hidden="true">
                        <polyline points="1.5 6 4.5 9 10.5 1" />
                    </svg>
                </span>
            </button>
        </div>
    );
}
