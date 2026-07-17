import { INSTALLMENT_BANKS, INSTALLMENT_MONTHS } from "../../../utils/constants";
import "./InstallmentPlanForm.css";

const fmt = (n) =>
  Number(n).toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const InstallmentPlanForm = ({ plan, onPlanChange, totalCart }) => {
  const monthly = plan?.months ? totalCart / plan.months : null;

  const setBank = (bank) =>
    onPlanChange({
      ...plan,
      bank,
      monthlyAmount: plan?.months ? parseFloat((totalCart / plan.months).toFixed(2)) : null,
    });

  const setMonths = (months) =>
    onPlanChange({
      ...plan,
      months,
      monthlyAmount: parseFloat((totalCart / months).toFixed(2)),
    });

  return (
    <div className="ipf">
      <p className="ipf__label">Selectează banca</p>
      <div className="ipf__chips" role="radiogroup" aria-label="Bancă">
        {INSTALLMENT_BANKS.map((b) => (
          <button
            key={b}
            type="button"
            className={`ipf__chip${plan?.bank === b ? " ipf__chip--active" : ""}`}
            aria-pressed={plan?.bank === b}
            onClick={() => setBank(b)}
          >
            {b}
          </button>
        ))}
      </div>

      <p className="ipf__label">Număr de rate</p>
      <div className="ipf__chips" role="radiogroup" aria-label="Număr rate">
        {INSTALLMENT_MONTHS.map((m) => (
          <button
            key={m}
            type="button"
            className={`ipf__chip${plan?.months === m ? " ipf__chip--active" : ""}`}
            aria-pressed={plan?.months === m}
            onClick={() => setMonths(m)}
          >
            {m}×
          </button>
        ))}
      </div>

      {monthly !== null && (
        <div className="ipf__preview">
          <span className="ipf__preview-label">Sumă lunară estimată</span>
          <strong className="ipf__preview-amount">{fmt(monthly)} RON/lună</strong>
        </div>
      )}

      <p className="ipf__note">
        Disponibil cu cardul de rate emis de banca selectată. Aprobarea se face de către bancă.
      </p>
    </div>
  );
};

export default InstallmentPlanForm;
