import { useState } from "react";
import { useGetAllProductsQuery } from "../../../../features/product/rtkProducts";

const RamFilter = ({ ram, setRam }) => {
  const [open, setOpen] = useState(true);
  const { data } = useGetAllProductsQuery();
  const all = data?.totalProducts ?? [];

  const options = [...new Set(all.map((p) => p.RAM).filter(Boolean))].sort(
    (a, b) => parseFloat(a) - parseFloat(b)
  );

  const toggle = (val) =>
    setRam((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  if (options.length === 0) return null;

  return (
    <div className="sidebar-filter-brand">
      <a href="#!" className="filter-head" onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}>
        <span>RAM</span>
      </a>
      {open && (
        <div className="filter-body scrollable">
          {options.map((val) => {
            const count = all.filter((p) => p.RAM === val).length;
            return (
              <label key={val} className="filter-inner">
                <input
                  type="checkbox"
                  value={val}
                  checked={ram.includes(val)}
                  onChange={() => toggle(val)}
                />
                <span>{val}</span>
                <div className="star-brand-text"><span>({count})</span></div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RamFilter;
