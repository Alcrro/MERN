import { TruckIcon } from "./cartIcons";
import { fmt, SHIP_THRESHOLD } from "./cartUtils";

const ShipBar = ({ total }) => {
  const pct  = Math.min(100, Math.round((total / SHIP_THRESHOLD) * 100));
  const left = fmt(Math.max(0, SHIP_THRESHOLD - total));
  const done = total >= SHIP_THRESHOLD;

  return (
    <div className={`ct-ship${done ? " ct-ship--done" : ""}`}>
      <div className="ct-ship__row">
        <TruckIcon />
        {done
          ? <span>Felicitări! Ai obținut <strong>livrare gratuită</strong>.</span>
          : <span>Mai adaugă <strong>{left} RON</strong> și livrarea e gratuită.</span>}
        <span className="ct-ship__pct">{pct}%</span>
      </div>
      <div className="ct-ship__track">
        <div className="ct-ship__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default ShipBar;
