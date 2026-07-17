import { useEffect } from "react";
import { useGetPaymentMethodsQuery } from "../../../features/paymentMethods/rtkPaymentMethods";
import PaymentPathSelector from "../../molecules/PaymentPathSelector";
import InstallmentPlanForm from "../../molecules/InstallmentPlanForm";

const FULL_METHODS = [
  { value: "Card",    label: "Plată cu cardul",    desc: "Visa, Mastercard — online securizat" },
  { value: "Ramburs", label: "Ramburs la livrare", desc: "Plătești când primești coletul" },
];

const BRAND_LABEL = { visa: "Visa", mastercard: "Mastercard", amex: "Amex", maestro: "Maestro" };

const CheckoutStepPayment = ({
  paymentPath, onPathChange,
  paymentMethod, onMethodChange,
  installmentPlan, onPlanChange,
  totalCart, isInstallmentEligible,
  savedPaymentMethodId, onSavedCardChange,
}) => {
  const { data: pmData } = useGetPaymentMethodsQuery();
  const savedCards = pmData?.data ?? [];

  useEffect(() => {
    if (paymentMethod !== "Card" || savedCards.length === 0 || savedPaymentMethodId !== null) return;
    const def = savedCards.find((c) => c.isDefault) ?? savedCards[0];
    onSavedCardChange(def.id);
  }, [paymentMethod, savedCards.length]);

  return (
    <div className="ck-step">
      <h3 className="ck-step__title">Metoda de plată</h3>

      <PaymentPathSelector
        value={paymentPath}
        onChange={onPathChange}
        isInstallmentEligible={isInstallmentEligible}
      />

      {paymentPath === "full" && (
        <div className="ck-pay-methods">
          {FULL_METHODS.map((m) => (
            <label key={m.value} className={`ck-method${paymentMethod === m.value ? " ck-method--active" : ""}`}>
              <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => onMethodChange(m.value)} />
              <div className="ck-method__body">
                <span className="ck-method__label">{m.label}</span>
                <span className="ck-method__desc">{m.desc}</span>
              </div>
            </label>
          ))}
        </div>
      )}

      {paymentPath === "full" && paymentMethod === "Card" && savedCards.length > 0 && (
        <div className="ck-saved-cards">
          <p className="ck-saved-cards__title">Carduri salvate</p>
          {savedCards.map((pm) => (
            <label key={pm.id} className={`ck-saved-card${savedPaymentMethodId === pm.id ? " ck-saved-card--active" : ""}`}>
              <input type="radio" name="savedCard" value={pm.id} checked={savedPaymentMethodId === pm.id} onChange={() => onSavedCardChange(pm.id)} />
              <span className="ck-saved-card__brand">{BRAND_LABEL[pm.brand] ?? pm.brand.toUpperCase()}</span>
              <span className="ck-saved-card__number">•••• {pm.last4}</span>
              <span className="ck-saved-card__exp">{String(pm.expMonth).padStart(2, "0")}/{String(pm.expYear).slice(-2)}</span>
              {pm.isDefault && <span className="ck-saved-card__badge">Implicit</span>}
            </label>
          ))}
          <label className={`ck-saved-card${savedPaymentMethodId === null ? " ck-saved-card--active" : ""}`}>
            <input type="radio" name="savedCard" value="" checked={savedPaymentMethodId === null} onChange={() => onSavedCardChange(null)} />
            <span className="ck-saved-card__new">+ Card nou</span>
          </label>
        </div>
      )}

      {paymentPath === "installments" && (
        <InstallmentPlanForm plan={installmentPlan} onPlanChange={onPlanChange} totalCart={totalCart} />
      )}
    </div>
  );
};

export default CheckoutStepPayment;
