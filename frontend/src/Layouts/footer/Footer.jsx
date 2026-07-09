import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const YEAR = new Date().getFullYear();

const PRODUCT_LINKS = [
  { label: "Toate produsele", to: "/products" },
  { label: "Oferte zilnice",  to: "/products?availability=Promotii" },
  { label: "Noutăți",        to: "/products?availability=Nou" },
  { label: "Resigilate",     to: "/products?availability=Resigilat" },
  { label: "Top vânzări",    to: "/products?sort=-rating" },
  { label: "Clearance",      to: "/products?sort=price" },
];

const ACCOUNT_LINKS = [
  { label: "Autentificare",  to: "/auth/login" },
  { label: "Înregistrare",   to: "/auth/register" },
  { label: "Profilul meu",   to: "/profile" },
  { label: "Comenzile mele", to: "/profile/orders" },
  { label: "Adresele mele",  to: "/profile/address" },
];

const LEGAL_LINKS = [
  { label: "Termeni și condiții", to: "/terms" },
  { label: "Confidențialitate",   to: "/privacy" },
  { label: "GDPR",                to: "/gdpr" },
  { label: "Despre noi",          to: "/about" },
];

/* ── Social icons ────────────────────────────────────────────── */
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const TikTokIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
);

/* ── Trust badges ────────────────────────────────────────────── */
const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 12a9 9 0 109-9M3 3v4h4"/>
  </svg>
);
const HeadsetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 18v-6a9 9 0 0118 0v6"/>
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/>
    <path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
  </svg>
);

const TRUST = [
  { icon: <TruckIcon />,  title: "Livrare gratuită",   sub: "La comenzi peste 500 RON" },
  { icon: <ShieldIcon />, title: "Plată securizată",   sub: "SSL 256-bit encryption" },
  { icon: <ReturnIcon />, title: "Retur 30 de zile",   sub: "Fără întrebări" },
  { icon: <HeadsetIcon />,title: "Suport 24/7",        sub: "0800 123 456" },
];

/* ── Footer ──────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="ft">

    {/* ── Trust strip ── */}
    <div className="ft-trust">
      <div className="ft-trust__inner">
        {TRUST.map((t) => (
          <div key={t.title} className="ft-trust__item">
            <span className="ft-trust__icon">{t.icon}</span>
            <div>
              <p className="ft-trust__title">{t.title}</p>
              <p className="ft-trust__sub">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ── Main grid ── */}
    <div className="ft-main">
      <div className="ft-main__inner">

        {/* brand column */}
        <div className="ft-brand">
          <Link to="/" className="ft-logo">alcrro</Link>
          <p className="ft-brand__desc">
            Magazinul tău de telefoane și accesorii. Produse verificate,
            prețuri corecte, livrare rapidă în toată România.
          </p>
          <div className="ft-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="ft-social" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="ft-social" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="ft-social" aria-label="TikTok"><TikTokIcon /></a>
          </div>
        </div>

        {/* produse + cont — wrapped pentru mobile 2-col */}
        <div className="ft-links-wrap">
          <div className="ft-col">
            <h3 className="ft-col__title">Produse</h3>
            <ul className="ft-col__list">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="ft-col">
            <h3 className="ft-col__title">Contul meu</h3>
            <ul className="ft-col__list">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* contact */}
        <div className="ft-col">
          <h3 className="ft-col__title">Contact</h3>
          <ul className="ft-col__list ft-contact">
            <li>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-5-5 19.79 19.79 0 01-3.07-8.67A2 2 0 015.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9a16 16 0 006.29 6.29l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <a href="tel:0800123456">0800 123 456</a>
            </li>
            <li>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Lun–Vin, 09:00–20:00</span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div className="ft-bottom">
      <div className="ft-bottom__inner">
        <span className="ft-copy">© {YEAR} alcrro. Toate drepturile rezervate.</span>
        <nav className="ft-legal">
          {LEGAL_LINKS.map((l, i) => (
            <React.Fragment key={l.to}>
              {i > 0 && <span className="ft-legal__sep">·</span>}
              <Link to={l.to}>{l.label}</Link>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>

  </footer>
);

export default Footer;
