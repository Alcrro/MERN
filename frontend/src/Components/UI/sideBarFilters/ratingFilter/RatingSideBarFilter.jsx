import { useState } from "react";
import "./sideBarFiltersRating.css";
import "../../singleCardRating/starRating.css";

const rateObject = [
  { id: 5, style: 100 },
  { id: 4, style: 80 },
  { id: 3, style: 60 },
  { id: 2, style: 40 },
  { id: 1, style: 20 },
];

const SideBarFilters = ({ rating, setRating, contextProducts = [] }) => {
  const [open, setOpen] = useState(true);

  const toggle = (val, checked) => {
    setRating((prev) =>
      checked ? [...prev, val] : prev.filter((r) => r !== val)
    );
  };

  return (
    <div className="filter-v2-container">
      <button type="button" className="filter-head" onClick={() => setOpen((o) => !o)}>
        <span>Rating</span>
      </button>
      {open && (
        <div className="filter-body scrollable">
          {rateObject.map((rate) => {
            const count = contextProducts.filter(
              (item) => (item.rating?.average || 0) >= rate.id
            ).length;
            const isChecked = Array.isArray(rating) && rating.includes(String(rate.id));
            return (
              <div key={rate.id} className="filter-inner">
                <input
                  type="checkbox"
                  id={`rating-${rate.id}`}
                  name="stars"
                  value={rate.id}
                  checked={isChecked}
                  onChange={(e) => toggle(String(rate.id), e.target.checked)}
                />
                <label htmlFor={`rating-${rate.id}`}>
                  <div className="first-star-rating star-rating-read">
                    <div className="star-rating-inner" style={{ width: `${rate.style}%` }} />
                  </div>
                </label>
                <div className="star-brand-text"><span>({count})</span></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SideBarFilters;
