import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Breadcrumb.css";

const LABELS = {
  "":          "Acasă",
  products:    "Produse",
  product:     "Produs",
  cart:        "Coș",
  checkout:    "Finalizare",
  profile:     "Profil",
  info:        "Informații",
  orders:      "Comenzi",
  address:     "Adrese",
  settings:    "Setări",
  auth:        null,
  login:       "Autentificare",
  register:    "Înregistrare",
  about:       "Despre noi",
  add:         null,
  admin:       "Admin",
};

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);


const Breadcrumb = () => {
  const { pathname } = useLocation();
  const navigate     = useNavigate();

  const isHome = pathname === "/";

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Acasă", to: "/" }];
  let path = "";

  for (const seg of segments) {
    path += `/${seg}`;
    const label = LABELS[seg];
    if (label === null) continue;
    if (label === undefined) {
      crumbs.push({ label: seg.length > 14 ? seg.slice(0, 12) + "…" : seg, to: path });
    } else {
      crumbs.push({ label, to: path });
    }
  }

  const hasCrumbs = crumbs.length > 1;

  return (
    <nav className="bc-bar" aria-label="breadcrumb">
      <div className="bc-inner">
        {/* Logo — mereu vizibil pe mobile */}
        <Link to="/" className="bc-logo">alcrro</Link>

        {/* Back + crumbs — doar dacă nu suntem pe home */}
        {hasCrumbs && !isHome && (
          <>
            <span className="bc-divider" />
            <button className="bc-back" onClick={() => navigate(-1)} aria-label="Înapoi">
              <BackIcon />
            </button>
            <ol className="bc-list">
              {crumbs.slice(1).map((c, i) => {
                const isLast = i === crumbs.length - 2;
                return (
                  <li key={c.to} className="bc-item">
                    {!isLast
                      ? <Link to={c.to} className="bc-link">{c.label}</Link>
                      : <span className="bc-current">{c.label}</span>}
                    {!isLast && <span className="bc-sep" aria-hidden>/</span>}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </nav>
  );
};

export default Breadcrumb;
