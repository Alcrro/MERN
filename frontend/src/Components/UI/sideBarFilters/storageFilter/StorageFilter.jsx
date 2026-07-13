import { useState } from "react";
import { useFilters } from "../../../products/products/FilterContext";

const StorageFilter = () => {
  const { stocare, setStocare, stocareContext: contextProducts = [] } = useFilters();
  const [open, setOpen] = useState(true);

  const toGB = (s) => (s?.toUpperCase().includes("TB") ? parseFloat(s) * 1024 : parseFloat(s));

  const options = [...new Set(contextProducts.map((p) => p.stocare).filter(Boolean))].sort(
    (a, b) => toGB(a) - toGB(b)
  );

  const toggle = (val) =>
    setStocare((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const visible = [
    ...options,
    ...stocare.filter((s) => !options.includes(s)),
  ];

  if (visible.length === 0) return null;

  return (
    <div className="filter-v2-container">
      <button type="button" className="filter-head" onClick={() => setOpen((o) => !o)}>
        <span>Stocare</span>
      </button>
      {open && (
        <div className="filter-body scrollable">
          {visible.map((val) => {
            const count = contextProducts.filter((p) => p.stocare === val).length;
            return (
              <div className="filter-inner" key={val}>
                <input
                  type="checkbox"
                  id={`stocare-${val}`}
                  value={val}
                  checked={stocare.includes(val)}
                  onChange={() => toggle(val)}
                />
                <label htmlFor={`stocare-${val}`}>{val}</label>
                <div className="star-brand-text"><span>({count})</span></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StorageFilter;
