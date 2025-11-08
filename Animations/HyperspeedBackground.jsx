import Hyperspeed from "./Hyperspeed";
import { hyperspeedPresets } from "./hyperspeedPresets";

export default function HyperspeedBackground() {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            <Hyperspeed effectOptions={hyperspeedPresets.one} />
        </div>
    );
}
