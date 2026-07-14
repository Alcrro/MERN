const StarPicker = ({ value, onChange }) => (
  <div className="sp-star-picker">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button"
        className={`sp-pick-star${n <= value ? " on" : ""}`}
        onClick={() => onChange(n)}>★</button>
    ))}
  </div>
);

export default StarPicker;
