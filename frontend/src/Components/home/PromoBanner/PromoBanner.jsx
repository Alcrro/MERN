import { Link } from "react-router-dom";
import { ArrowRight } from "../homeIcons";

const PromoBanner = () => (
  <section className="home-promo" aria-label="Oferte zilnice">
    <div className="home-promo__inner">
      <div className="home-promo__content">
        <span className="home-promo__tag">Limitat</span>
        <h2 className="home-promo__title">Oferte zilnice cu până la <em>40% reducere</em></h2>
        <p className="home-promo__sub">
          Stoc limitat — prețuri actualizate în fiecare zi la cele mai căutate modele.
        </p>
        <Link to="/products?availability=Promotii" className="home-promo__btn">
          Vezi ofertele <ArrowRight />
        </Link>
      </div>
      <div className="home-promo__decoration" aria-hidden>
        <span className="home-promo__circle home-promo__circle--1" />
        <span className="home-promo__circle home-promo__circle--2" />
        <span className="home-promo__badge">−40%</span>
      </div>
    </div>
  </section>
);

export default PromoBanner;
