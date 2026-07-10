import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CloseIcon, GridIcon, ChevronIcon, ChevronRight, LogoutIcon } from "../icons";
import { PROMO_LINKS, ROLE_LABEL } from "../../../utils/constants";
import "./MobileDrawer.css";

const MobileDrawer = ({ open, onClose, user, onLogout, categories }) => {
  const [catOpen, setCatOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);

  const close = () => { onClose(); setCatOpen(false); setExpandedCat(null); };

  return (
    <>
      {open && <div className="mob-backdrop" onClick={close} />}
      <div className={`mob-drawer${open ? " mob-drawer--open" : ""}`}>

        <div className="mob-drawer__head">
          <Link to="/" className="brand-logo" onClick={close}>alcrro</Link>
          <button className="mob-drawer__close" onClick={close}><CloseIcon /></button>
        </div>

        <div className="mob-drawer__body">
          {user ? (
            <div className="mob-user-block">
              <div className="mob-avatar">{user.name[0].toUpperCase()}</div>
              <div>
                <p className="mob-user-name">{user.name}</p>
                <span className={`role-badge role-${user.role}`}>{ROLE_LABEL[user.role] || user.role}</span>
              </div>
            </div>
          ) : (
            <div className="mob-auth-block">
              <Link to="/auth/login"    className="btn-register mob-auth-btn" onClick={close}>Intră în cont</Link>
              <Link to="/auth/register" className="btn-login mob-auth-btn"    onClick={close}>Înregistrare</Link>
            </div>
          )}

          <div className="mob-divider" />

          <button className="mob-section-btn" onClick={() => setCatOpen(p => !p)}>
            <GridIcon />
            <span>Categorii</span>
            <span className={`mob-chevron${catOpen ? " mob-chevron--open" : ""}`}><ChevronIcon open={catOpen} /></span>
          </button>

          {catOpen && (
            <div className="mob-cat-list">
              {categories.map(cat => (
                <div key={cat._id} className="mob-cat-item">
                  <button
                    className="mob-cat-row"
                    onClick={() => setExpandedCat(expandedCat === cat._id ? null : cat._id)}
                  >
                    <span>{cat.icon} {cat.label}</span>
                    <span className={`mob-chevron${expandedCat === cat._id ? " mob-chevron--open" : ""}`}><ChevronRight /></span>
                  </button>
                  {expandedCat === cat._id && (
                    <div className="mob-sub-list">
                      {cat.sub?.map(sub => (
                        <Link
                          key={sub.label}
                          to={sub.tip ? `/products?kind=${cat.kind}&tip=${encodeURIComponent(sub.tip)}` : `/products?kind=${sub.kind || cat.kind || ""}`}
                          className="mob-sub-link"
                          onClick={close}
                        >
                          {sub.icon} {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mob-divider" />

          {PROMO_LINKS.map(({ label, to, accent }) => (
            <Link key={label} to={to} className="mob-nav-link" style={accent ? { color: accent } : undefined} onClick={close}>
              {label}
            </Link>
          ))}

          <div className="mob-divider" />

          {user && (
            <>
              <Link to="/profile"        className="mob-nav-link" onClick={close}>👤 Profilul meu</Link>
              <Link to="/profile/orders" className="mob-nav-link" onClick={close}>📦 Comenzile mele</Link>
              <Link to="/favorites"      className="mob-nav-link" onClick={close}>❤️ Favorite</Link>
              {(user.role === "admin" || user.role === "vendor") && (
                <Link to="/add/product"  className="mob-nav-link" onClick={close}>➕ Adaugă produs</Link>
              )}
              <button className="mob-logout-btn" onClick={() => { onLogout(); close(); }}>
                <LogoutIcon /> Deconectare
              </button>
            </>
          )}

          <Link to="/about" className="mob-nav-link" onClick={close}>ℹ️ Despre noi</Link>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
