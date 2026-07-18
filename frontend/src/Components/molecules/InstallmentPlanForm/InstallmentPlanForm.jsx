import { INSTALLMENT_PLANS, INSTALLMENT_BANKS } from "../../../utils/constants";
import "./InstallmentPlanForm.css";

const fmt = (n) =>
  Number(n).toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const InstallmentPlanForm = ({ plan, onPlanChange, totalCart }) => {
  const availableMonths = plan?.bank ? INSTALLMENT_PLANS[plan.bank]?.months ?? [] : [];

  const setBank = (bank) => {
    const months = INSTALLMENT_PLANS[bank]?.months ?? [];
    const currentMonths = plan?.months;
    const validMonths = months.includes(currentMonths) ? currentMonths : null;
    onPlanChange({
      bank,
      months: validMonths,
      monthlyAmount: validMonths ? parseFloat((totalCart / validMonths).toFixed(2)) : null,
    });
  };

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

      {plan?.bank && (
        <>
          <p className="ipf__label">Număr de rate</p>
          <div className="ipf__months" role="radiogroup" aria-label="Număr rate">
            {availableMonths.map((m) => {
              const monthly = totalCart / m;
              const active  = plan?.months === m;
              return (
                <button
                  key={m}
                  type="button"
                  className={`ipf__month${active ? " ipf__month--active" : ""}`}
                  aria-pressed={active}
                  onClick={() => setMonths(m)}
                >
                  <span className="ipf__month-n">{m} rate</span>
                  <span className="ipf__month-val">{fmt(monthly)} RON/lună</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {plan?.months && (
        <div className="ipf__preview">
          <span className="ipf__preview-label">Total în {plan.months} rate</span>
          <strong className="ipf__preview-amount">{fmt(totalCart / plan.months)} RON/lună</strong>
        </div>
      )}

      <p className="ipf__note">
        Disponibil cu cardul de rate emis de banca selectată. Aprobarea se face de către bancă.
      </p>
    </div>
  );
};

export default InstallmentPlanForm;
