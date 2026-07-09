import { useState } from "react";
import { Link } from "react-router-dom";
import { catHref, subLink } from "./navbarAuxUtils";
import { HamburgerIcon, ChevronDown, ChevronRight } from "./navbarAuxIcons";

const CategoryDropdown = ({ categories, isLoading, isActive }) => {
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const activeCat = categories.find((c) => c.label === hoveredLabel) ?? categories[0];

  return (
    <div className="cat-dropdown-wrap" onMouseLeave={() => setHoveredLabel(null)}>
      <Link
        to="/products"
        className={`cat-link cat-link--drop${isActive ? " active" : ""}`}
      >
        <HamburgerIcon />
        Toate produsele
        <ChevronDown />
      </Link>

      {!isLoading && categories.length > 0 && (
        <div className="cat-dropdown">
          <div className="cat-dd-left">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`cat-dd-item${activeCat?._id === cat._id ? " cat-dd-item--active" : ""}`}
                onMouseEnter={() => setHoveredLabel(cat.label)}
              >
                <span className="cat-dd-icon">{cat.icon}</span>
                <span className="cat-dd-label">{cat.label}</span>
                <ChevronRight />
              </div>
            ))}
          </div>

          {activeCat && (
            <div className="cat-dd-right">
              <Link to={catHref(activeCat)} className="cat-dd-right-title">
                {activeCat.icon} {activeCat.label}
                <span className="cat-dd-see-all">Vezi toate →</span>
              </Link>
              <div className="cat-dd-sub-grid">
                {activeCat.sub?.map((item) => (
                  <Link
                    key={item.label}
                    to={subLink(item, activeCat.kind)}
                    className="cat-sub-link"
                  >
                    <span className="cat-sub-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
