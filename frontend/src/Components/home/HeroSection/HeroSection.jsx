import { Link } from "react-router-dom";
import { ArrowRight, TruckIcon } from "../homeIcons";
import panda from "../../../Assets/images/panda.png";

const HeroSection = () => (
  <section className="hero-section" aria-label="Hero">
    <div className="hero-content">
      <h1 className="hero-title">
        Cel mai bun<br />
        <span className="hero-highlight">smartphone</span><br />
        la prețul tău
      </h1>
      <p className="hero-subtitle">
        Descoperă cele mai noi telefoane din brandurile de top. Livrare
        gratuită, garanție 24 luni și retur în 30 de zile.
      </p>
      <div className="hero-actions">
        <Link to="/products" className="hero-btn-primary">
          Explorează produsele <ArrowRight />
        </Link>
        <Link to="/products?availability=Promotii" className="hero-btn-secondary">
          Oferte zilnice
        </Link>
      </div>
    </div>
    <div className="hero-visual">
      <div className="hero-card-float hero-card-1"><span>⭐ 4.9</span><span>Top Rated</span></div>
      <div className="hero-card-float hero-card-2"><TruckIcon /><span>Livrare gratuită</span></div>
      <div className="hero-image-placeholder">
        <img src={panda} alt="Telefon de top" className="hero-img" />
      </div>
    </div>
  </section>
);

export default HeroSection;
