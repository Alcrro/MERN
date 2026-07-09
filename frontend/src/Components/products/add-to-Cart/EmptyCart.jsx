import { Link } from "react-router-dom";
import { ArrowRight } from "./cartIcons";

const EmptyCart = () => (
  <div className="ct-empty">
    <svg className="ct-empty__svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="currentColor" opacity=".06"/>
      <path d="M34 42h52l-6 36H40L34 42z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      <path d="M26 34h12l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="48" cy="86" r="4" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="72" cy="86" r="4" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M52 58h16M60 50v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".4"/>
    </svg>
    <h2 className="ct-empty__title">Coșul tău este gol</h2>
    <p className="ct-empty__sub">Explorează produsele și adaugă ce îți place.</p>
    <Link to="/products" className="ct-empty__btn">
      Descoperă produsele <ArrowRight />
    </Link>
  </div>
);

export default EmptyCart;
