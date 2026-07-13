import { useState } from "react";
import { useFilters } from "../../../products/products/FilterContext";

const OPTIONS = ["Nou", "In Stoc", "Promotii", "Resigilat", "Precomanda"];

const AvailabilityFilter = () => {
  const { availability, setAvailability, availabilityContext: contextProducts = [] } = useFilters();
  const [open, setOpen] = useState(true);

  const counts = Object.fromEntries(
    OPTIONS.map((opt) => [opt, contextProducts.filter((p) => p.stock?.availability === opt).length])
  );

  const toggle = (val) =>
    setAvailability((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const visible = OPTIONS.filter((opt) => counts[opt] > 0 || availability.includes(opt));
  if (visible.length === 0) return null;

  return (
    <div className="filter-v2-container">
      <button type="button" className="filter-head" onClick={() => setOpen((o) => !o)}>
        <span>Stare</span>
      </button>
      {open && (
        <div className="filter-body">
          {visible.map((opt) => (
            <div className="filter-inner" key={opt}>
              <input
                type="checkbox"
                id={`avail-${opt}`}
                value={opt}
                checked={availability.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <label htmlFor={`avail-${opt}`}>{opt}</label>
              <div className="star-brand-text"><span>({counts[opt]})</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityFilter;
