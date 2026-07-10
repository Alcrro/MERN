import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { FacebookIcon, InstagramIcon, TikTokIcon, EmailIcon, PhoneIcon, ClockIcon, TRUST } from "./footerIcons";
import { YEAR, PRODUCT_LINKS, ACCOUNT_LINKS, LEGAL_LINKS } from "./footerConstants";
import "./footer.css";

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const FtCol = ({ title, children, listClass = "" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="ft-col">
      <button
        className={`ft-col__title${open ? " ft-col__title--open" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        {title}
        <span className="ft-chevron"><Chevron /></span>
      </button>
      <ul className={`ft-col__list${open ? " ft-col__list--open" : ""}${listClass ? ` ${listClass}` : ""}`}>
        {children}
      </ul>
    </div>
  );
};

const Footer = () => (
  <footer className="ft">

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

    <div className="ft-main">
      <div className="ft-main__inner">

        <div className="ft-brand">
          <Link to="/" className="ft-logo">alcrro</Link>
          <p className="ft-brand__desc">
            Magazinul tău de telefoane și accesorii. Produse verificate,
            prețuri corecte, livrare rapidă în toată România.
          </p>
          <div className="ft-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="ft-social" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="ft-social" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://tiktok.com"    target="_blank" rel="noreferrer" className="ft-social" aria-label="TikTok"><TikTokIcon /></a>
          </div>
        </div>

        <FtCol title="Produse">
          {PRODUCT_LINKS.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
        </FtCol>

        <FtCol title="Contul meu">
          {ACCOUNT_LINKS.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
        </FtCol>

        <FtCol title="Contact" listClass="ft-contact">
          <li><EmailIcon /><a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a></li>
          <li><PhoneIcon /><a href="tel:0800123456">0800 123 456</a></li>
          <li><ClockIcon /><span>Lun–Vin, 09:00–20:00</span></li>
        </FtCol>

      </div>
    </div>

    <div className="ft-bottom">
      <div className="ft-bottom__inner">
        <span className="ft-copy">© {YEAR} alcrro. Toate drepturile rezervate.</span>
        <nav className="ft-legal">
          {LEGAL_LINKS.map((l, i) => (
            <Fragment key={l.to}>
              {i > 0 && <span className="ft-legal__sep">·</span>}
              <Link to={l.to}>{l.label}</Link>
            </Fragment>
          ))}
        </nav>
      </div>
    </div>

  </footer>
);

export default Footer;
