import { useState } from "react";
import "../allCategories/allCategories.css";

const FilterSection = ({ title, items, selected, onToggle, getCount }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="filter-v2-container">
      <button
        className="filter-head"
        onClick={() => setIsOpen(o => !o)}
        type="button"
      >
        <span>{title}</span>
      </button>
      {isOpen && (
        <div className="collapse out">
          <div className="filter-body scrollable">
            {items.map((value) => (
              <div className="filter-inner" key={value}>
                <input
                  type="checkbox"
                  id={`filter-${title}-${value}`}
                  value={value}
                  checked={selected.includes(value)}
                  onChange={(e) => onToggle(value, e.target.checked)}
                />
                <label htmlFor={`filter-${title}-${value}`}>{value}</label>
                <div className="star-brand-text">
                  <span>({getCount(value)})</span>
                </div>
              </div>
            ))}
          </div>
          <div className="filter-body">
            <div className="filter-body-separator" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
