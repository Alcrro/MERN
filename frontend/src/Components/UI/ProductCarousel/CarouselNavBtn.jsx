const ChevLeft  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

const CarouselNavBtn = ({ direction, onClick, label, className = "" }) => (
  <button
    type="button"
    className={`carousel-btn carousel-btn-${direction}${className ? ` ${className}` : ""}`}
    onClick={onClick}
    aria-label={label || (direction === "prev" ? "Înapoi" : "Înainte")}
  >
    {direction === "prev" ? <ChevLeft /> : <ChevRight />}
  </button>
);

export default CarouselNavBtn;
