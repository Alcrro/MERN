import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutPayment.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ orderId, total }) => {
  const stripe        = useStripe();
  const elements      = useElements();
  const navigate      = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState(null);
  const [ready, setReady]           = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}?payment=success`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else {
      navigate(`/orders/${orderId}?payment=success`);
    }
  };

  return (
    <form className="cp-form" onSubmit={handleSubmit}>
      {!ready && <div className="cp-skeleton" aria-hidden="true" />}
      <PaymentElement
        onReady={() => setReady(true)}
        options={{ layout: "tabs" }}
      />
      {error && <p className="cp-error" role="alert">{error}</p>}
      <div className="cp-summary">
        <span>Total de plată</span>
        <strong>{total ? `${Number(total).toLocaleString("ro-RO")} RON` : ""}</strong>
      </div>
      <button type="submit" className="cp-btn" disabled={!stripe || processing || !ready}>
        {processing ? "Se procesează..." : "Plătește acum"}
      </button>
    </form>
  );
};

const getAppearance = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    theme: isDark ? "night" : "stripe",
    variables: {
      colorPrimary:          "#2563eb",
      colorBackground:       isDark ? "#1e293b" : "#ffffff",
      colorText:             isDark ? "#f1f5f9" : "#0f172a",
      colorTextSecondary:    isDark ? "#94a3b8" : "#64748b",
      colorDanger:           "#dc2626",
      borderRadius:          "8px",
      fontSizeBase:          "15px",
      spacingUnit:           "5px",
    },
    rules: {
      ".Input": {
        border:     isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        boxShadow:  "none",
        padding:    "10px 14px",
      },
      ".Input:focus": {
        border:    "1px solid #2563eb",
        boxShadow: "0 0 0 3px rgba(37,99,235,0.15)",
      },
      ".Label": { fontWeight: "500", marginBottom: "6px" },
    },
  };
};

const CheckoutPayment = ({ clientSecret, orderId, total }) => {
  if (!clientSecret) return null;

  return (
    <div className="cp-container">
      <div className="cp-header">
        <span className="cp-header__lock" aria-hidden="true">🔒</span>
        <h3 className="cp-title">Plată securizată</h3>
      </div>
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: getAppearance() }}>
        <PaymentForm orderId={orderId} total={total} />
      </Elements>
    </div>
  );
};

export default CheckoutPayment;
