const METHODS = [
  { value: "Card",    label: "Plată cu cardul",      desc: "Visa, Mastercard — online securizat" },
  { value: "Ramburs", label: "Ramburs la livrare",   desc: "Plătești când primești coletul" },
];

const CheckoutStepPayment = ({ value, onChange }) => (
  <div className="ck-step">
    <h3 className="ck-step__title">Metoda de plată</h3>
    {METHODS.map((m) => (
      <label key={m.value} className={`ck-method${value === m.value ? " ck-method--active" : ""}`}>
        <input type="radio" name="payment" value={m.value}
          checked={value === m.value}
          onChange={() => onChange(m.value)} />
        <div className="ck-method__body">
          <span className="ck-method__label">{m.label}</span>
          <span className="ck-method__desc">{m.desc}</span>
        </div>
      </label>
    ))}
  </div>
);

export default CheckoutStepPayment;
