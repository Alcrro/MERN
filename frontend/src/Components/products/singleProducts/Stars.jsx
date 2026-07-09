const Stars = ({ value, size = 17 }) => (
  <span className="sp-stars" style={{ "--sz": `${size}px` }}>
    <span className="sp-stars-empty">★★★★★</span>
    <span className="sp-stars-fill" style={{ width: `${((value / 5) * 100).toFixed(1)}%` }}>★★★★★</span>
  </span>
);

export default Stars;
