import { useState } from "react";
import { useFilters } from "../../../products/products/FilterContext";

const RamFilter = () => {
  const { ram, setRam, ramContext: contextProducts = [] } = useFilters();
  const [open, setOpen] = useState(true);

  const options = [...new Set(contextProducts.map((p) => p.RAM).filter(Boolean))].sort(
    (a, b) => parseFloat(a) - parseFloat(b)
  );

  const toggle = (val) =>
    setRam((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const visible = [
    ...options,
    ...ram.filter((r) => !options.includes(r)),
  ];

  if (visible.length === 0) return null;

  return (
    <div className="filter-v2-container">
      <button type="button" className="filter-head" onClick={() => setOpen((o) => !o)}>
        <span>RAM</span>
      </button>
      {open && (
        <div className="filter-body scrollable">
          {visible.map((val) => {
            const count = contextProducts.filter((p) => p.RAM === val).length;
            return (
              <div className="filter-inner" key={val}>
                <input
                  type="checkbox"
                  id={`ram-${val}`}
                  value={val}
                  checked={ram.includes(val)}
                  onChange={() => toggle(val)}
                />
                <label htmlFor={`ram-${val}`}>{val}</label>
                <div className="star-brand-text"><span>({count})</span></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RamFilter;
