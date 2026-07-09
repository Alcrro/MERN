import React, { useState } from "react";
import "./navbarAux.css";
import { Link, useLocation } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../features/product/rtkProducts";

const PROMO_LINKS = [
  { label: "Oferte zilnice",  to: "/products?availability=Promotii", accent: "#ef4444" },
  { label: "Noutăți",        to: "/products?availability=Nou",       accent: null },
  { label: "Resigilate",     to: "/products?availability=Resigilat", accent: null },
  { label: "Top vânzări",    to: "/products?sort=-rating",           accent: null },
  { label: "Clearance",      to: "/products?sort=price",             accent: null },
];

const catHref = (cat) => {
  if (!cat.kind) return "/products";
  return `/products?kind=${cat.kind}`;
};

const subLink = (item, parentKind) => {
  const kind = item.kind ?? parentKind;
  if (!kind) return "/products";
  if (item.tip) return `/products?kind=${kind}&tip=${encodeURIComponent(item.tip)}`;
  return `/products?kind=${kind}`;
};

const NavbarAux = () => {
  const { pathname } = useLocation();
  const isProducts = pathname === "/products";

  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.categories ?? [];

  const [hoveredLabel, setHoveredLabel] = useState(null);
  const activeCat = categories.find((c) => c.label === hoveredLabel) ?? categories[0];

  return (
    <nav className="category-nav">
      <div className="category-nav-inner">

        {/* Toate produsele + mega-dropdown */}
        <div
          className="cat-dropdown-wrap"
          onMouseLeave={() => setHoveredLabel(null)}
        >
          <Link
            to="/products"
            className={`cat-link cat-link--drop${isProducts ? " active" : ""}`}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            Toate produsele
            <svg className="cat-chevron" viewBox="0 0 24 24" width="12" height="12"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
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
                    <svg className="cat-dd-arrow" viewBox="0 0 24 24" width="13" height="13"
                      fill="none" stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                ))}
              </div>

              {activeCat && (
                <div className="cat-dd-right">
                  <Link
                    to={catHref(activeCat)}
                    className="cat-dd-right-title"
                  >
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

        {/* Linkuri promoționale */}
        {PROMO_LINKS.map(({ label, to, accent }) => (
          <Link
            key={label}
            to={to}
            className="cat-link cat-promo"
            style={accent ? { color: accent } : undefined}
          >
            {label}
          </Link>
        ))}

        <span className="cat-sep" />

        <Link to="/about" className="cat-link cat-help">
          Ajutor
        </Link>
      </div>
    </nav>
  );
};

export default NavbarAux;
