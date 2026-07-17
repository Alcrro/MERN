import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useCheckoutState from "./useCheckoutState";
import useCheckoutEligibility from "../../../hooks/useCheckoutEligibility";
import CheckoutSuccess from "./CheckoutSuccess";
import CheckoutStepAddress from "./CheckoutStepAddress";
import CheckoutStepPayment from "./CheckoutStepPayment";
import CheckoutStepConfirm from "./CheckoutStepConfirm";
import CheckoutPayment from "../../organisms/CheckoutPayment";
import "./checkout.css";

const STEPS = ["Adresă", "Plată", "Confirmare"];

const canAdvance = (step, addr, cs) => {
  if (step === 0) return !!addr;
  if (step === 1) {
    if (cs.paymentPath === "installments") {
      return !!(cs.installmentPlan?.bank && cs.installmentPlan?.months);
    }
    return !!cs.paymentMethod;
  }
  return false;
};

const Checkout = () => {
  const { user }               = useSelector((s) => s.auth);
  const cart                   = useSelector((s) => s.addToCart);
  const cs                     = useCheckoutState(cart.card);
  const { isInstallmentEligible } = useCheckoutEligibility();

  if (!user) return <Navigate to="/auth/login" />;
  if (cart.card.length === 0 && !cs.orderSuccess && !cs.pendingPayment) return <Navigate to="/cart" />;
  if (cs.orderSuccess) return <CheckoutSuccess order={cs.orderSuccess} />;
  if (cs.pendingPayment) return (
    <div className="ck-page">
      <div className="ck-container">
        <CheckoutPayment
          clientSecret={cs.pendingPayment.clientSecret}
          orderId={cs.pendingPayment.order._id}
          total={cs.pendingPayment.order.totalPrice}
        />
      </div>
    </div>
  );

  return (
    <div className="ck-page">
      <div className="ck-container">
        <div className="ck-progress">
          {STEPS.map((label, i) => (
            <div key={label} className={`ck-progress__step${i === cs.step ? " ck-progress__step--active" : ""}${i < cs.step ? " ck-progress__step--done" : ""}`}>
              <span className="ck-progress__dot">{i + 1}</span>
              <span className="ck-progress__label">{label}</span>
            </div>
          ))}
        </div>

        {cs.step === 0 && <CheckoutStepAddress selectedId={cs.selectedAddressId} onSelect={cs.setSelectedAddressId} />}
        {cs.step === 1 && (
          <CheckoutStepPayment
            paymentPath={cs.paymentPath}
            onPathChange={cs.setPaymentPath}
            paymentMethod={cs.paymentMethod}
            onMethodChange={cs.setPaymentMethod}
            installmentPlan={cs.installmentPlan}
            onPlanChange={cs.setInstallmentPlan}
            totalCart={cart.cartTotalAmount}
            isInstallmentEligible={isInstallmentEligible}
            savedPaymentMethodId={cs.savedPaymentMethodId}
            onSavedCardChange={cs.setSavedPaymentMethodId}
          />
        )}
        {cs.step === 2 && <CheckoutStepConfirm cart={cart} isSubmitting={cs.isSubmitting} error={cs.orderError} onSubmit={cs.handleSubmit} />}

        <div className="ck-nav">
          {cs.step > 0 && <button type="button" className="ck-btn" onClick={() => cs.setStep(cs.step - 1)}>← Înapoi</button>}
          {cs.step < 2 && <button type="button" className="ck-btn ck-btn--primary" disabled={!canAdvance(cs.step, cs.selectedAddressId, cs)} onClick={() => cs.setStep(cs.step + 1)}>Continuă →</button>}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
