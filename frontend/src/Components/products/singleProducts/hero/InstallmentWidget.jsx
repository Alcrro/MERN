import "./InstallmentWidget.css";

const WalletIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
    <path d="M16 12h5v4h-5a2 2 0 0 1 0-4z"/>
  </svg>
);

const PLANS = [3, 6, 12];
const MIN_PRICE = 200;
const fmt = (n) => n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const InstallmentWidget = ({ price, selected, onSelect }) => {
  if (!price || price < MIN_PRICE) return null;

  return (
    <div className="inst">
      <div className="inst__head">
        <WalletIcon />
        <span className="inst__title">Plătești în rate</span>
        <span className="inst__zero">0% dobândă</span>
      </div>

      {PLANS.map((n) => {
        const monthly = price / n;
        const on = selected === n;
        return (
          <button
            key={n}
            type="button"
            className={`inst__row${on ? " inst__row--on" : ""}`}
            onClick={() => onSelect(on ? null : n)}
            aria-pressed={on}
          >
            <span className="inst__radio">
              <span className="inst__radio-dot" />
            </span>
            <span className="inst__label">
              <strong>{n}</strong> rate a câte
            </span>
            <span className="inst__amount">
              {fmt(monthly)} RON<span className="inst__mo">/lună</span>
            </span>
            {on && <span className="inst__check">✓</span>}
          </button>
        );
      })}

      {selected && (
        <p className="inst__summary">
          Total: <strong>{fmt(price)} RON</strong> în <strong>{selected} rate</strong> de <strong>{fmt(price / selected)} RON/lună</strong>
        </p>
      )}
    </div>
  );
};

export default InstallmentWidget;
