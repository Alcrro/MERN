import "./InstallmentWidget.css";

const WalletIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
    <path d="M16 12h5v4h-5a2 2 0 0 1 0-4z"/>
  </svg>
);

const MIN_PRICE = 200;
const MAX_MONTHS = 24;
const fmt = (n) => n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const InstallmentWidget = ({ price, selected, onSelect }) => {
  if (!price || price < MIN_PRICE) return null;

  const minMonthly = price / MAX_MONTHS;

  return (
    <div className="inst">
      <div className="inst__head">
        <WalletIcon />
        <span className="inst__title">Plătești în rate</span>
        <span className="inst__zero">0% dobândă</span>
      </div>

      <button
        type="button"
        className={`inst__toggle${selected ? " inst__toggle--on" : ""}`}
        onClick={() => onSelect(selected ? null : true)}
      >
        <span className="inst__radio">
          <span className="inst__radio-dot" />
        </span>
        <span className="inst__toggle-text">
          {selected ? "Plătesc în rate" : "Vreau să plătesc în rate"}
        </span>
        <span className="inst__toggle-hint">
          de la {fmt(minMonthly)} RON/lună
        </span>
      </button>

      {selected && (
        <p className="inst__note">
          Banca și numărul de rate le alegi la pasul următor.
        </p>
      )}
    </div>
  );
};

export default InstallmentWidget;
