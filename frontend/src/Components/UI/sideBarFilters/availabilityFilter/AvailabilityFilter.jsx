import { useState } from "react";
import { useGetAllProductsQuery } from "../../../../features/product/rtkProducts";

const OPTIONS = ["Nou", "In Stoc", "Promotii", "Resigilat", "Precomanda"];

const AvailabilityFilter = ({ availability, setAvailability }) => {
  const [open, setOpen] = useState(true);
  const { data } = useGetAllProductsQuery();
  const all = data?.totalProducts ?? [];

  const toggle = (val) =>
    setAvailability((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  const counts = Object.fromEntries(
    OPTIONS.map((opt) => [opt, all.filter((p) => p.stock?.availability === opt).length])
  );

  return (
    <div className="sidebar-filter-brand">
      <a href="#!" className="filter-head" onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}>
        <span>Stare</span>
      </a>
      {open && (
        <div className="filter-body">
          {OPTIONS.filter((opt) => counts[opt] > 0).map((opt) => (
            <label key={opt} className="filter-inner">
              <input
                type="checkbox"
                value={opt}
                checked={availability.includes(opt)}
                onChange={() => toggle(opt)}
              />
              <span>{opt}</span>
              <div className="star-brand-text"><span>({counts[opt]})</span></div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityFilter;
