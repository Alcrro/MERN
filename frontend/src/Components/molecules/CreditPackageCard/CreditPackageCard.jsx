import "./CreditPackageCard.css";

const CreditPackageCard = ({ pkg, onBuy, isLoading }) => (
  <div className={`credit-pkg${pkg.popular ? " credit-pkg--popular" : ""}`}>
    {pkg.popular && <span className="credit-pkg__tag">Recomandat</span>}
    <p className="credit-pkg__credits">{pkg.credits}</p>
    <p className="credit-pkg__label">credite</p>
    <span className={`credit-pkg__discount${pkg.discount === 0 ? " credit-pkg__discount--empty" : ""}`}>
      {pkg.discount > 0 ? `-${pkg.discount}%` : ' '}
    </span>
    <p className="credit-pkg__price">{pkg.priceRON} RON</p>
    <p className="credit-pkg__sub">1 credit = 1 RON</p>
    <button
      type="button"
      className="credit-pkg__btn"
      onClick={() => onBuy(String(pkg.credits))}
      disabled={isLoading}
      aria-label={`Cumpără ${pkg.credits} credite pentru ${pkg.priceRON} RON`}
    >
      {isLoading ? "Se procesează…" : "Cumpără"}
    </button>
  </div>
);

export default CreditPackageCard;
