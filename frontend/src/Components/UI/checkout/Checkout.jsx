import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import useCheckoutState from "./useCheckoutState";
import CheckoutStepAddress from "./CheckoutStepAddress";
import CheckoutStepPayment from "./CheckoutStepPayment";
import CheckoutStepConfirm from "./CheckoutStepConfirm";
import "./checkout.css";

const STEPS = ["Adresă", "Plată", "Confirmare"];

const canAdvance = (step, selectedAddressId, paymentMethod) =>
  step === 0 ? !!selectedAddressId : step === 1 ? !!paymentMethod : false;

const OrderSuccess = ({ order }) => (
  <div className="ck-page">
    <div className="ck-success">
      <div className="ck-success__icon">✓</div>
      <h2 className="ck-success__title">Comandă plasată!</h2>
      <p className="ck-success__ref">Ref. #{order._id.slice(-6).toUpperCase()}</p>
      <p className="ck-success__total">
        Total: {Number(order.totalPrice).toLocaleString("ro-RO")} RON
      </p>
      <p className="ck-success__info">
        Vei primi un email de confirmare. Poți urmări comanda din profilul tău.
      </p>
      <Link to="/products" className="ck-btn ck-btn--primary">Continuă cumpărăturile</Link>
    </div>
  </div>
);

const Checkout = () => {
  const { user } = useSelector((s) => s.auth);
  const cart = useSelector((s) => s.addToCart);
  const cs = useCheckoutState(cart.card);

  if (!user) return <Navigate to="/auth/login" />;
  if (cart.card.length === 0 && !cs.orderSuccess) return <Navigate to="/cart" />;
  if (cs.orderSuccess) return <OrderSuccess order={cs.orderSuccess} />;

  return (
    <div className="ck-page">
      <div className="ck-container">
        <div className="ck-progress">
          {STEPS.map((label, i) => (
            <div key={label} className={
              `ck-progress__step${i === cs.step ? " ck-progress__step--active" : ""}${i < cs.step ? " ck-progress__step--done" : ""}`
            }>
              <span className="ck-progress__dot">{i + 1}</span>
              <span className="ck-progress__label">{label}</span>
            </div>
          ))}
        </div>

        {cs.step === 0 && (
          <CheckoutStepAddress
            selectedId={cs.selectedAddressId}
            onSelect={cs.setSelectedAddressId}
          />
        )}
        {cs.step === 1 && (
          <CheckoutStepPayment
            value={cs.paymentMethod}
            onChange={cs.setPaymentMethod}
          />
        )}
        {cs.step === 2 && (
          <CheckoutStepConfirm
            cart={cart}
            isSubmitting={cs.isSubmitting}
            error={cs.orderError}
            onSubmit={cs.handleSubmit}
          />
        )}

        <div className="ck-nav">
          {cs.step > 0 && (
            <button type="button" className="ck-btn"
              onClick={() => cs.setStep(cs.step - 1)}>
              ← Înapoi
            </button>
          )}
          {cs.step < 2 && (
            <button type="button" className="ck-btn ck-btn--primary"
              disabled={!canAdvance(cs.step, cs.selectedAddressId, cs.paymentMethod)}
              onClick={() => cs.setStep(cs.step + 1)}>
              Continuă →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
