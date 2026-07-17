import "./PaymentPathSelector.css";

const PaymentPathSelector = ({ value, onChange, isInstallmentEligible }) => (
  <div className="pps" role="radiogroup" aria-label="Cale de plată">
    <label className={`pps__card${value === "full" ? " pps__card--active" : ""}`}>
      <input
        type="radio"
        name="paymentPath"
        value="full"
        checked={value === "full"}
        onChange={() => onChange("full")}
      />
      <div className="pps__body">
        <span className="pps__title">Plată integrală</span>
        <span className="pps__desc">Card bancar sau ramburs la livrare</span>
      </div>
    </label>

    {isInstallmentEligible && (
      <label className={`pps__card${value === "installments" ? " pps__card--active" : ""}`}>
        <input
          type="radio"
          name="paymentPath"
          value="installments"
          checked={value === "installments"}
          onChange={() => onChange("installments")}
        />
        <div className="pps__body">
          <span className="pps__title">Rate fără dobândă</span>
          <span className="pps__desc">Disponibil cu card BT, ING, Raiffeisen sau BCR</span>
          <span className="pps__badge">0% dobândă</span>
        </div>
      </label>
    )}
  </div>
);

export default PaymentPathSelector;
