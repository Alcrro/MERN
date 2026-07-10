import "./limit.css";
import Select from "./select/Select";
import TipAfisare from "./tipAfisare/TipAfisare";
import { SORT_OPTIONS, LIMIT_OPTIONS } from "../../../utils/constants";

const ListingPanel = ({
  queryProduct,
  limit,
  setLimit,
  brand,
  model,
  setBrand,
  setModel,
  setChecked,
  sort,
  setSort,
  displayAllProducts,
  onOpenFilters,
  activeFilterCount,
}) => {
  const activeFilters = [...(brand ?? []), ...(model ?? [])];
  const total = activeFilters.length > 0 ? queryProduct?.length : displayAllProducts?.length;

  const removeAll = () => {
    setBrand([]);
    setModel([]);
    setChecked?.(false);
  };

  return (
    <div className="lp-bar">
      <div className="lp-title-row">
        <h2 className="lp-title">
          Produse
          {total != null && <span className="lp-count">{total} rezultate</span>}
        </h2>
        {activeFilters.length > 0 && (
          <div className="lp-active-filters">
            {brand.map(b => (
              <span key={b} className="lp-chip">
                {b}
                <button type="button" onClick={() => setBrand(brand.filter(x => x !== b))}>×</button>
              </span>
            ))}
            {model.map(m => (
              <span key={m} className="lp-chip">
                {m}
                <button type="button" onClick={() => setModel(model.filter(x => x !== m))}>×</button>
              </span>
            ))}
            <button type="button" className="lp-clear-all" onClick={removeAll}>Șterge tot</button>
          </div>
        )}
      </div>

      <div className="lp-controls-row">
        {onOpenFilters && (
          <button type="button" className="mob-filter-btn" onClick={onOpenFilters}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filtre
            {activeFilterCount > 0 && <span className="mob-filter-btn-badge">{activeFilterCount}</span>}
          </button>
        )}
        <Select value={sort} options={SORT_OPTIONS} onChange={setSort} prefix="Sortare:" />
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
