import { useRef } from "react";
import { Link } from "react-router-dom";
import Cards from "../../products/cards/Cards";
import CarouselNavBtn from "./CarouselNavBtn";
import "./ProductCarousel.css";

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
          <CarouselNavBtn direction="prev" onClick={() => scroll(-1)} />
          <div className="carousel-viewport" ref={ref}>
            <div className="carousel-track">
              {data.map((item, i) => (
                <div className="carousel-item" key={i}><Cards products={item} /></div>
              ))}
            </div>
          </div>
          <CarouselNavBtn direction="next" onClick={() => scroll(1)} />
        </div>
      ) : null}
    </section>
  );
};

export default ProductCarousel;
