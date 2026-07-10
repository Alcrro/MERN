import { useState } from "react";
import { useGetAllProductsQuery } from "../../../../features/product/rtkProducts";

const StorageFilter = ({ stocare, setStocare }) => {
  const [open, setOpen] = useState(true);
  const { data } = useGetAllProductsQuery();
  const all = data?.totalProducts ?? [];

  const options = [...new Set(all.map((p) => p.stocare).filter(Boolean))].sort((a, b) => {
    const toGB = (s) => {
      const n = parseFloat(s);
      return s?.toUpperCase().includes("TB") ? n * 1024 : n;
    };
    return toGB(a) - toGB(b);
  });

  const toggle = (val) =>
    setStocare((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  if (options.length === 0) return null;

  return (
    <div className="sidebar-filter-brand">
      <a href="#!" className="filter-head" onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}>
        <span>Stocare</span>
      </a>
      {open && (
        <div className="filter-body scrollable">
          {options.map((val) => {
            const count = all.filter((p) => p.stocare === val).length;
            return (
              <label key={val} className="filter-inner">
                <input
                  type="checkbox"
                  value={val}
                  checked={stocare.includes(val)}
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

export default StorageFilter;
