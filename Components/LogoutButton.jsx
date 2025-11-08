import { useState, useEffect } from "react";
import "./LogoutButton.css";

export default function LogoutButton({ onLogout }) {
    const [state, setState] = useState("default");
    const [classes, setClasses] = useState("");

    // mimic CSS variable updates
    useEffect(() => {
        const el = document.querySelector(".logoutButton");
        if (!el) return;
        const current = logoutButtonStates[state];
        if (current) {
            Object.entries(current).forEach(([key, val]) => {
                el.style.setProperty(key, val);
            });
        }
    }, [state]);

    const handleClick = () => {
        if (state === "default" || state === "hover") {
            setClasses("clicked");
            setState("walking1");
            setTimeout(() => {
                setClasses("clicked door-slammed");
                setState("walking2");
                setTimeout(() => {
                    setClasses("clicked door-slammed falling");
                    setState("falling1");
                    setTimeout(() => {
                        setState("falling2");
                        setTimeout(() => {
                            setState("falling3");
                            setTimeout(() => {
                                setClasses("");
                                setState("default");
                                onLogout?.(); // optional callback
                            }, 1000);
                        }, parseInt(logoutButtonStates["falling2"]["--walking-duration"]));
                    }, parseInt(logoutButtonStates["falling1"]["--walking-duration"]));
                }, parseInt(logoutButtonStates["walking2"]["--figure-duration"]));
            }, parseInt(logoutButtonStates["walking1"]["--figure-duration"]));
        }
    };

    return (
        <button
            className={`logoutButton ${classes}`}
            onClick={handleClick}
            onMouseEnter={() => state === "default" && setState("hover")}
            onMouseLeave={() => state === "hover" && setState("default")}
            aria-label="Logout"
            style={{
                position: "absolute",
                top: "20px",
                right: "20px",
            }}
        >
            <span className="button-text">Logout</span>

            {/* Doorway */}
            <svg className="doorway" viewBox="0 0 100 100">
                <rect x="35" y="20" width="30" height="60" rx="5" />
            </svg>

            {/* Door */}
            <svg className="door" viewBox="0 0 100 100">
                <rect x="35" y="20" width="30" height="60" rx="5" />
            </svg>

            {/* Figure */}
            <svg className="figure" viewBox="0 0 100 100">
                <circle className="head" cx="50" cy="20" r="8" />
                <rect className="arm1" x="30" y="30" width="8" height="25" rx="3" />
                <rect className="arm2" x="62" y="30" width="8" height="25" rx="3" />
                <rect className="leg1" x="38" y="55" width="8" height="25" rx="3" />
                <rect className="leg2" x="54" y="55" width="8" height="25" rx="3" />
            </svg>

            <svg className="bang" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="10" fill="#4371f7" />
            </svg>
        </button>
    );
}

// the same state map from your script:
const logoutButtonStates = {
    default: { "--figure-duration": "100", "--transform-figure": "none", "--walking-duration": "100", "--transform-arm1": "none", "--transform-wrist1": "none", "--transform-arm2": "none", "--transform-wrist2": "none", "--transform-leg1": "none", "--transform-calf1": "none", "--transform-leg2": "none", "--transform-calf2": "none" },
    hover: { "--figure-duration": "100", "--transform-figure": "translateX(1.5px)", "--walking-duration": "100", "--transform-arm1": "rotate(-5deg)", "--transform-wrist1": "rotate(-15deg)", "--transform-arm2": "rotate(5deg)", "--transform-wrist2": "rotate(6deg)", "--transform-leg1": "rotate(-10deg)", "--transform-calf1": "rotate(5deg)", "--transform-leg2": "rotate(20deg)", "--transform-calf2": "rotate(-20deg)" },
    walking1: { "--figure-duration": "300", "--transform-figure": "translateX(11px)", "--walking-duration": "300", "--transform-arm1": "translateX(-4px) translateY(-2px) rotate(120deg)", "--transform-wrist1": "rotate(-5deg)", "--transform-arm2": "translateX(4px) rotate(-110deg)", "--transform-wrist2": "rotate(-5deg)", "--transform-leg1": "translateX(-3px) rotate(80deg)", "--transform-calf1": "rotate(-30deg)", "--transform-leg2": "translateX(4px) rotate(-60deg)", "--transform-calf2": "rotate(20deg)" },
    walking2: { "--figure-duration": "400", "--transform-figure": "translateX(17px)", "--walking-duration": "300", "--transform-arm1": "rotate(60deg)", "--transform-wrist1": "rotate(-15deg)", "--transform-arm2": "rotate(-45deg)", "--transform-wrist2": "rotate(6deg)", "--transform-leg1": "rotate(-5deg)", "--transform-calf1": "rotate(10deg)", "--transform-leg2": "rotate(10deg)", "--transform-calf2": "rotate(-20deg)" },
    falling1: { "--figure-duration": "1600", "--walking-duration": "400", "--transform-arm1": "rotate(-60deg)", "--transform-wrist1": "none", "--transform-arm2": "rotate(30deg)", "--transform-wrist2": "rotate(120deg)", "--transform-leg1": "rotate(-30deg)", "--transform-calf1": "rotate(-20deg)", "--transform-leg2": "rotate(20deg)" },
    falling2: { "--walking-duration": "300", "--transform-arm1": "rotate(-100deg)", "--transform-arm2": "rotate(-60deg)", "--transform-wrist2": "rotate(60deg)", "--transform-leg1": "rotate(80deg)", "--transform-calf1": "rotate(20deg)", "--transform-leg2": "rotate(-60deg)" },
    falling3: { "--walking-duration": "500", "--transform-arm1": "rotate(-30deg)", "--transform-wrist1": "rotate(40deg)", "--transform-arm2": "rotate(50deg)", "--transform-wrist2": "none", "--transform-leg1": "rotate(-30deg)", "--transform-leg2": "rotate(20deg)", "--transform-calf2": "none" }
};
