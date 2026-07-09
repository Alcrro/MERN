import React, { useState, useRef, useEffect } from "react";
import "./limit.css";
import TipAfisare from "./tipAfisare/TipAfisare";

const SORT_OPTIONS = [
  { value: "Newest",               label: "Cele mai noi" },
  { value: "Oldest",               label: "Cele mai vechi" },
  { value: "Price: Low to High",   label: "Preț: crescător" },
  { value: "Price: High to Low",   label: "Preț: descrescător" },
  { value: "Rating: High to Low",  label: "Rating: descrescător" },
  { value: "Rating: Low to High",  label: "Rating: crescător" },
];

const LIMIT_OPTIONS = [30, 60, 90];

const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
);

const Select = ({ value, options, onChange, prefix }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = options.find(o => (o.value ?? o) === value);
  const label   = current ? (current.label ?? current) : value;

  return (
    <div className="lp-select" ref={ref}>
      <button className={`lp-select__btn${open ? " lp-select__btn--open" : ""}`} onClick={() => setOpen(p => !p)}>
        {prefix && <span className="lp-select__prefix">{prefix}</span>}
        <span className="lp-select__val">{label}</span>
        <span className="lp-select__arrow"><ChevronDown /></span>
      </button>
      {open && (
        <div className="lp-select__dropdown">
          {options.map(opt => {
            const v = opt.value ?? opt;
            const l = opt.label ?? opt;
            return (
              <button
                key={v}
                className={`lp-select__opt${v === value ? " lp-select__opt--active" : ""}`}
                onClick={() => { onChange(v); setOpen(false); }}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ListingPanel = ({
  queryProduct,
  limit,
  setLimit,
  brand,
  model,
  setBrand,
  setModel,
  checked,
  setChecked,
  sort,
  setSort,
  displayAllProducts,
  onOpenFilters,
  activeFilterCount,
}) => {
  const combineFilter = [...(brand ?? []), ...(model ?? [])];
  const total = combineFilter.length > 0 ? queryProduct?.length : displayAllProducts?.length;

  const removeAll = (e) => {
    e.preventDefault();
    setBrand([]); setModel([]); setChecked(false);
  };

  return (
    <div className="lp-bar">
      {/* ── Row 1: title + active filters ── */}
      <div className="lp-title-row">
        <h2 className="lp-title">
          Produse
          {total != null && <span className="lp-count">{total} rezultate</span>}
        </h2>

        {combineFilter.length > 0 && (
          <div className="lp-active-filters">
            {brand.map(b => (
              <span key={b} className="lp-chip">
                {b}
                <button onClick={() => setBrand(brand.filter(x => x !== b))}>×</button>
              </span>
            ))}
            {model.map(m => (
              <span key={m} className="lp-chip">
                {m}
                <button onClick={() => setModel(model.filter(x => x !== m))}>×</button>
              </span>
            ))}
            <button className="lp-clear-all" onClick={removeAll}>Șterge tot</button>
          </div>
        )}
      </div>

      {/* ── Row 2: controls ── */}
      <div className="lp-controls-row">
        {/* Mobile filter button */}
        {onOpenFilters && (
          <button className="mob-filter-btn" onClick={onOpenFilters}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filtre
            {activeFilterCount > 0 && <span className="mob-filter-btn-badge">{activeFilterCount}</span>}
          </button>
        )}

        <Select
          value={sort}
          options={SORT_OPTIONS}
          onChange={setSort}
          prefix="Sortare:"
        />

        <Select
          value={limit}
          options={LIMIT_OPTIONS.map(n => ({ value: n, label: `${n} / pagină` }))}
          onChange={v => setLimit(Number(v))}
          prefix="Afișare:"
        />

        <TipAfisare />
      </div>
    </div>
  );
};

export default ListingPanel;
