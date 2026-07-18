import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCancelOrderMutation, useGetOrderPayIntentQuery, useConfirmPaymentMutation, ordersApi } from "../../../features/order/rtkOrders";
import { useGetPaymentMethodsQuery } from "../../../features/paymentMethods/rtkPaymentMethods";
import "./OrderDetailPanel.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const STEPS = ["Pending", "Processing", "Shipped", "Delivered"];
const STEP_LABELS = { Pending: "Plasată", Processing: "Confirmată", Shipped: "Expediată", Delivered: "Livrată" };
const STATUS_LABELS = { Pending: "În așteptare", Processing: "Se procesează", Shipped: "Expediat", Delivered: "Livrat", Cancelled: "Anulat" };

const Timeline = ({ status }) => {
  if (status === "Cancelled") return (
    <div className="od-timeline">
      <span className="od-tl__cancelled">Comandă anulată</span>
    </div>
  );
  const cur = STEPS.indexOf(status);
  return (
    <div className="od-timeline">
      {STEPS.map((step, i) => (
        <div key={step} className="od-tl__step">
          <div className={`od-tl__dot ${i < cur ? "done" : i === cur ? "current" : ""}`} />
          {i < STEPS.length - 1 && <div className={`od-tl__line ${i < cur ? "done" : ""}`} />}
          <span className={`od-tl__label ${i === cur ? "current" : ""}`}>{STEP_LABELS[step]}</span>
        </div>
      ))}
    </div>
  );
};

const CardPayForm = ({ clientSecret, orderId, total, defaultCard }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const pmParam = defaultCard
      ? { payment_method: defaultCard.id, payment_method_options: { card: { cvc: elements.getElement(CardCvcElement) } } }
      : { payment_method: { card: elements.getElement(CardElement) } };

    const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, pmParam);
    if (stripeErr) { setError(stripeErr.message); setProcessing(false); return; }
    if (paymentIntent?.status === "succeeded") {
      await confirmPayment(orderId).unwrap().catch(() => {});
      navigate(`/orders/${orderId}?payment=success`);
    }
  };

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const elStyle = { style: { base: { fontSize: "15px", color: isDark ? "#f1f5f9" : "#0f172a", "::placeholder": { color: isDark ? "#64748b" : "#94a3b8" } } } };

  return (
    <form className="od-card-form" onSubmit={handleSubmit}>
      {defaultCard ? (
        <div className="od-saved-card">
          <div className="od-saved-card__info">
            <span className="od-saved-card__brand">{defaultCard.brand.toUpperCase()}</span>
            <span className="od-saved-card__num">•••• •••• •••• {defaultCard.last4}</span>
            <span className="od-saved-card__exp">{String(defaultCard.expMonth).padStart(2, "0")}/{String(defaultCard.expYear).slice(-2)}</span>
          </div>
          <div className="od-cvc-wrap">
            <label className="od-cvc-label">CVV</label>
            <div className="od-card-element od-cvc-element">
              <CardCvcElement options={elStyle} />
            </div>
          </div>
        </div>
      ) : (
        <div className="od-card-element">
          <CardElement options={elStyle} />
        </div>
      )}
      {error && <p className="od-pay-error">{error}</p>}
      <div className="od-pay-row">
        <span>Total de plată</span>
        <strong>{Number(total).toLocaleString("ro-RO")} RON</strong>
      </div>
      <button type="submit" className="od-pay-btn" disabled={!stripe || processing}>
        {processing ? "Se procesează..." : "Plătește acum"}
      </button>
    </form>
  );
};

const InlinePayment = ({ order }) => {
  const dispatch = useDispatch();
  const needsPay = order.status === "Pending" && !order.isPaid && !!order.stripePaymentIntentId;
  const { data: piData, isLoading } = useGetOrderPayIntentQuery(order._id, { skip: !needsPay, refetchOnMountOrArgChange: true });
  const { data: pmData } = useGetPaymentMethodsQuery(undefined, { skip: !needsPay });

  useEffect(() => {
    if (piData?.alreadyPaid) {
      dispatch(ordersApi.util.invalidateTags([{ type: "Orders", id: order._id }]));
    }
  }, [piData?.alreadyPaid, order._id, dispatch]);

  if (!needsPay) return null;
  if (isLoading) return <div className="od-pay-loading">Se încarcă...</div>;
  if (!piData?.clientSecret) return null;

  const defaultCard = pmData?.data?.find((pm) => pm.isDefault) ?? null;

  return (
    <div className="od-pay-section">
      <h3 className="od-section-title">Finalizează plata</h3>
      <Elements stripe={stripePromise}>
        <CardPayForm
          clientSecret={piData.clientSecret}
          orderId={order._id}
          total={order.totalPrice - (order.creditsUsed || 0)}
          defaultCard={defaultCard}
        />
      </Elements>
    </div>
  );
};

const OrderDetailPanel = ({ order }) => {
  const { search } = useLocation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const paymentSuccess = new URLSearchParams(search).get("payment") === "success";

  return (
    <article className="od-invoice">

      <header className="od-invoice__head">
        <div className="od-invoice__brand">
          <span className="od-brand__name">alcrro</span>
          <span className="od-brand__tagline">Magazin online de telefoane</span>
          <span className="od-brand__contact">contact@alcrro.ro · 0800 123 456</span>
        </div>
        <div className="od-invoice__meta">
          <p className="od-meta__type">FACTURĂ ELECTRONICĂ</p>
          <p className="od-meta__ref">#{order._id.slice(-6).toUpperCase()}</p>
          <p className="od-meta__date">
            {new Date(order.createdAt).toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <div className="od-meta__badges">
            <span className={`od-badge od-badge--${order.status.toLowerCase()}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
            <span className={`od-badge ${order.isPaid ? "od-badge--paid" : "od-badge--unpaid"}`}>
              {order.isRefunded ? "Rambursat" : order.isPaid ? "Plătit" : "Neachitat"}
            </span>
          </div>
        </div>
      </header>

      <Timeline status={order.status} />

      {paymentSuccess && !order.isPaid && (
        <div className="od-notice">
          <span className="od-notice__dot" />
          Plata se procesează — pagina se va actualiza automat.
        </div>
      )}

      <section className="od-section">
        <h3 className="od-section-title">Produse comandate</h3>
        <table className="od-table">
          <thead>
            <tr>
              <th className="od-table__name">Produs</th>
              <th className="od-table__qty">Cant.</th>
              <th className="od-table__price">Preț unitar</th>
              <th className="od-table__total">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.brand} {item.model}</td>
                <td className="od-table__qty">×{item.quantity}</td>
                <td className="od-table__price">{Number(item.price).toLocaleString("ro-RO")} RON</td>
                <td className="od-table__total">{(item.price * item.quantity).toLocaleString("ro-RO")} RON</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="od-details-grid">
        <div className="od-delivery">
          <h3 className="od-section-title">Adresă livrare</h3>
          <p>{order.deliveryAddress.street}</p>
          <p>{order.deliveryAddress.city}, jud. {order.deliveryAddress.county} {order.deliveryAddress.zip}</p>
          <p>{order.deliveryAddress.phone}</p>
          <p className="od-delivery__method">
            Plată: <strong>{order.paymentMethod}</strong>
            {order.paymentDetails?.last4 && <span> · •••• {order.paymentDetails.last4}</span>}
            {order.paymentDetails?.receiptUrl && (
              <a href={order.paymentDetails.receiptUrl} target="_blank" rel="noreferrer" className="od-receipt-link">Chitanță</a>
            )}
          </p>
          {order.awb && <p className="od-delivery__awb">AWB: <strong>{order.awb}</strong></p>}
        </div>

        <div className="od-totals">
          <div className="od-totals__row">
            <span>Subtotal</span>
            <span>{Number(order.totalPrice + (order.creditsUsed || 0)).toLocaleString("ro-RO")} RON</span>
          </div>
          {order.voucherDiscount > 0 && (
            <div className="od-totals__row od-totals__row--discount">
              <span>Voucher {order.voucherCode && <span className="od-voucher-code">({order.voucherCode})</span>}</span>
              <span>−{Number(order.voucherDiscount).toLocaleString("ro-RO")} RON</span>
            </div>
          )}
          {order.creditsUsed > 0 && (
            <div className="od-totals__row od-totals__row--discount">
              <span>Credite folosite</span>
              <span>−{Number(order.creditsUsed).toLocaleString("ro-RO")} RON</span>
            </div>
          )}
          <div className="od-totals__row">
            <span>Livrare</span>
            <span className="od-totals__free">Gratuită</span>
          </div>
          <div className="od-totals__final">
            <span>Total de plată</span>
            <strong>{Number(order.totalPrice).toLocaleString("ro-RO")} RON</strong>
          </div>
        </div>
      </div>

      <InlinePayment order={order} />

      {order.status === "Pending" && (
        <div className="od-actions">
          <button type="button" className="od-btn-cancel" disabled={isCancelling} onClick={() => cancelOrder(order._id)}>
            {isCancelling ? "Se anulează..." : "Anulează comanda"}
          </button>
        </div>
      )}

    </article>
  );
};

export default OrderDetailPanel;
