import { useState } from "react";

const TIP_ORDER = [
  "Telefon", "Laptop", "Tabletă", "Desktop PC",
  "TV", "Soundbar", "Căști", "Boxe Bluetooth",
  "Mașină de spălat", "Frigider", "Side by Side", "Aspirator",
  "Robot aspirator", "Friteuza cu aer", "Espressor", "Bec smart",
];

const TipFilter = ({ tip, setTip, contextProducts = [] }) => {
  const [open, setOpen] = useState(true);

  const available = [...new Set(contextProducts.map((p) => p.tip).filter(Boolean))];
  const options = [
    ...TIP_ORDER.filter((t) => available.includes(t)),
    ...available.filter((t) => !TIP_ORDER.includes(t)).sort(),
  ];

  const visible = [...options, ...tip.filter((t) => !options.includes(t))];

  if (visible.length === 0) return null;

  const toggle = (val) =>
    setTip((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  return (
    <div className="filter-v2-container">
      <button type="button" className="filter-head" onClick={() => setOpen((o) => !o)}>
        <span>Categorie produs</span>
      </button>
      {open && (
        <div className="filter-body scrollable">
          {visible.map((val) => {
            const count = contextProducts.filter((p) => p.tip === val).length;
            return (
              <div className="filter-inner" key={val}>
                <input
                  type="checkbox"
                  id={`tip-${val}`}
                  checked={tip.includes(val)}
                  onChange={() => toggle(val)}
                />
                <label htmlFor={`tip-${val}`}>{val}</label>
                <div className="star-brand-text"><span>({count})</span></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TipFilter;
