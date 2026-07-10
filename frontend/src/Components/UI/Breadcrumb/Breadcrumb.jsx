import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BackIcon from "./BackIcon";
import { buildCrumbs } from "./breadcrumbUtils";
import "./Breadcrumb.css";

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const crumbs = buildCrumbs(pathname);
  const isHome = pathname === "/";
  const hasCrumbs = crumbs.length > 1;

  return (
    <nav className="bc-bar" aria-label="breadcrumb">
      <div className="bc-inner">
        <Link to="/" className="bc-logo">alcrro</Link>
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
