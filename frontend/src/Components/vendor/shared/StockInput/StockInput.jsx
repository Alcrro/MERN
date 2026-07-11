import { STOCK_AVAILABILITY_OPTIONS } from "../../../../utils/constants";
import "./StockInput.css";

const StockInput = ({ stock, onChange }) => {
  const set = (key, val) => onChange({ ...stock, [key]: val });

  return (
    <div className="stock-input">
      <div className="vf-field">
        <label className="vf-label" htmlFor="stock-qty">Cantitate în stoc</label>
        <input
          id="stock-qty"
          type="number"
          min="0"
          className="vf-input"
          value={stock.quantity ?? ""}
          onChange={(e) => set("quantity", Number(e.target.value))}
        />
      </div>
      <div className="vf-field">
        <label className="vf-label" htmlFor="stock-avail">Disponibilitate</label>
        <select
          id="stock-avail"
          className="vf-input"
          value={stock.availability ?? "In Stoc"}
          onChange={(e) => set("availability", e.target.value)}
        >
          {STOCK_AVAILABILITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
};

export default StockInput;
