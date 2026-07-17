import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  useSetupIntentMutation,
  useSetDefaultPaymentMethodMutation,
} from "../../../features/paymentMethods/rtkPaymentMethods";
import "./AddCardForm.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "");

const AddCardInner = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const cardOptions = {
    style: {
      base: {
        fontSize: "15px",
        color: isDark ? "#e2e8f0" : "#1e293b",
        "::placeholder": { color: isDark ? "#4b5563" : "#94a3b8" },
      },
      invalid: { color: "#dc2626" },
    },
  };
  const [setupIntent] = useSetupIntentMutation();
  const [setDefault] = useSetDefaultPaymentMethodMutation();
  const [makeDefault, setMakeDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    try {
      const res = await setupIntent();
      if (!res.data?.clientSecret) throw new Error(res.error?.data?.message || "Eroare setup");

      const result = await stripe.confirmCardSetup(res.data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) throw new Error(result.error.message);

      if (makeDefault && result.setupIntent?.payment_method) {
        setDefault(result.setupIntent.payment_method);
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <div className="add-card-form__field">
        <CardElement options={cardOptions} />
      </div>
      <label className="add-card-form__checkbox">
        <input
          type="checkbox"
          checked={makeDefault}
          onChange={(e) => setMakeDefault(e.target.checked)}
        />
        Setează ca implicit
      </label>
      {error && <p className="add-card-form__error">{error}</p>}
      <div className="add-card-form__actions">
        <button
          type="button"
          className="add-card-form__btn add-card-form__btn--cancel"
          onClick={onCancel}
          disabled={loading}
        >
          Anulează
        </button>
        <button
          type="submit"
          className="add-card-form__btn add-card-form__btn--save"
          disabled={loading}
        >
          {loading ? "Se salvează…" : "Salvează cardul"}
        </button>
      </div>
    </form>
  );
};

const AddCardForm = ({ onSuccess, onCancel }) => (
  <Elements stripe={stripePromise}>
    <AddCardInner onSuccess={onSuccess} onCancel={onCancel} />
  </Elements>
);

export default AddCardForm;
