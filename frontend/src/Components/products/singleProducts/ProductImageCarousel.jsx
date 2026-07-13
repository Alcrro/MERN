import { useState, useEffect } from "react";
import pandaImg from "../../../Assets/images/panda.png";
import CarouselNavBtn from "../../UI/ProductCarousel/CarouselNavBtn";
import "./ProductImageCarousel.css";

const ProductImageCarousel = ({ images = [], alt = "", avail, availStyle }) => {
  const imgs    = images.length ? images : [pandaImg];
  const imgsKey = imgs.join(",");
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [imgsKey]);

  const prev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx((i) => (i + 1) % imgs.length);

  return (
    <div className="pic">
      <div className="pic__main">
        {avail && (
          <span className="pic__badge" style={{ background: availStyle?.bg, color: availStyle?.color }}>
            {avail}
          </span>
        )}

        {imgs.length > 1 && (
          <CarouselNavBtn direction="prev" onClick={prev} label="Imaginea anterioară" className="pic__nav--l" />
        )}

        <img src={imgs[idx]} alt={alt} className="pic__img" />

        {imgs.length > 1 && (
          <CarouselNavBtn direction="next" onClick={next} label="Imaginea următoare" className="pic__nav--r" />
        )}

        {imgs.length > 1 && (
          <div className="pic__dots">
            {imgs.map((_, i) => (
              <span key={i} className={`pic__dot${i === idx ? " pic__dot--on" : ""}`} />
            ))}
          </div>
        )}
      </div>

      {imgs.length > 1 && (
        <div className="pic__thumbs">
          {imgs.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`pic__thumb${i === idx ? " pic__thumb--on" : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Imaginea ${i + 1}`}
            >
              <img src={src} alt={`${alt} ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
