import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CreditPackageCard from "../../molecules/CreditPackageCard";
import { useTopUpCreditsMutation, useGetMyCardQuery } from "../../../features/shopCard/rtkShopCard";
import "./CreditPackages.css";

const PACKAGES = [
  { credits: 50,  priceRON: 50,  discount: 0 },
  { credits: 100, priceRON: 95,  discount: 5 },
  { credits: 250, priceRON: 220, discount: 12, popular: true },
  { credits: 500, priceRON: 400, discount: 20 },
];

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "");

const CheckoutForm = ({ clientSecret, credits, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState(null);
  const { refetch } = useGetMyCardQuery();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setErr(null);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      setErr(result.error.message);
      setPaying(false);
    } else {
      await refetch();
      onSuccess(credits);
    }
  };

  return (
    <form className="credit-checkout" onSubmit={handlePay}>
      <p className="credit-checkout__title">Introdu datele cardului</p>
      <div className="credit-checkout__card-el">
        <CardElement options={{ style: { base: { fontSize: "15px", color: "#0f172a" } } }} />
      </div>
      {err && <p className="credit-checkout__err">{err}</p>}
      <div className="credit-checkout__actions">
        <button type="button" className="credit-checkout__cancel" onClick={onCancel}>Anulează</button>
        <button type="submit" className="credit-checkout__pay" disabled={paying || !stripe}>
          {paying ? "Se procesează…" : `Plătește`}
        </button>
      </div>
    </form>
  );
};

const CreditPackages = () => {
  const [topUp, { isLoading }] = useTopUpCreditsMutation();
  const [flow, setFlow] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleBuy = async (pkg) => {
    try {
      const res = await topUp({ package: pkg }).unwrap();
      setFlow({ clientSecret: res.clientSecret, credits: res.credits });
    } catch {}
  };

  if (success) return (
    <div className="credit-pkgs__success">
      <span className="credit-pkgs__success-icon">✓</span>
      <p>{success} credite au fost adăugate în cardul tău!</p>
      <button type="button" className="credit-pkgs__success-btn" onClick={() => setSuccess(null)}>
        Cumpără din nou
      </button>
    </div>
  );

  return (
    <div className="credit-pkgs">
      <h2 className="credit-pkgs__title">Pachete de credite</h2>
      <p className="credit-pkgs__sub">1 credit = 1 RON. Folosește creditele la orice comandă.</p>

      {flow ? (
        <Elements stripe={stripePromise} options={{ clientSecret: flow.clientSecret }}>
          <CheckoutForm
            clientSecret={flow.clientSecret}
            credits={flow.credits}
            onSuccess={(c) => { setFlow(null); setSuccess(c); }}
            onCancel={() => setFlow(null)}
          />
        </Elements>
      ) : (
        <div className="credit-pkgs__grid">
          {PACKAGES.map((pkg) => (
            <CreditPackageCard
              key={pkg.credits}
              pkg={pkg}
              onBuy={handleBuy}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CreditPackages;
