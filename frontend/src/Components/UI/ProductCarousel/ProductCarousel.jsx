import { useRef } from "react";
import { Link } from "react-router-dom";
import Cards from "../../products/cards/Cards";
import "./ProductCarousel.css";

const ChevLeft   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const ArrowRight = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const CARD_W = 256;
const GAP    = 16;

const ProductCarousel = ({ title, linkTo, data, isLoading }) => {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * (CARD_W + GAP) * 2, behavior: "smooth" });

  return (
    <section className="home-carousel-section" aria-label={title}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <Link to={linkTo} className="section-link">
          Vezi toate <ArrowRight />
        </Link>
      </div>

      {isLoading ? (
        <div className="carousel-viewport">
          <div className="carousel-track">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="carousel-item skeleton-card">
                <div className="skeleton-img skeleton-pulse" />
                <div className="skeleton-line skeleton-pulse" style={{ width: "75%" }} />
                <div className="skeleton-line skeleton-pulse" style={{ width: "45%" }} />
              </div>
            ))}
          </div>
        </div>
      ) : data?.length > 0 ? (
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-btn-prev" onClick={() => scroll(-1)} aria-label="Înapoi"><ChevLeft /></button>
          <div className="carousel-viewport" ref={ref}>
            <div className="carousel-track">
              {data.map((item, i) => (
                <div className="carousel-item" key={i}><Cards products={item} /></div>
              ))}
            </div>
          </div>
          <button className="carousel-btn carousel-btn-next" onClick={() => scroll(1)} aria-label="Înainte"><ChevRight /></button>
        </div>
      ) : null}
    </section>
  );
};

export default ProductCarousel;
