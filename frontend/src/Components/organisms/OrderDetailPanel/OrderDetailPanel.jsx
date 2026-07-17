import { useLocation } from "react-router-dom";
import { useCancelOrderMutation } from "../../../features/order/rtkOrders";
import "./OrderDetailPanel.css";

const STATUS_LABELS = {
  Pending:    "În așteptare",
  Processing: "Se procesează",
  Shipped:    "Expediat",
  Delivered:  "Livrat",
  Cancelled:  "Anulat",
};

const PaymentBadge = ({ isPaid, isRefunded }) => {
  if (isRefunded) return <span className="od-badge od-badge--refunded">Rambursat</span>;
  if (isPaid)     return <span className="od-badge od-badge--paid">Plătit</span>;
  return               <span className="od-badge od-badge--unpaid">Neachitat</span>;
};

const CardInfo = ({ details }) => {
  if (!details?.last4) return null;
  const brand = details.brand
    ? details.brand.charAt(0).toUpperCase() + details.brand.slice(1)
    : "Card";
  return (
    <span className="od-card-info">
      {brand} •••• {details.last4}
      {details.receiptUrl && (
        <a href={details.receiptUrl} target="_blank" rel="noreferrer" className="od-receipt-link">
          Chitanță
        </a>
      )}
    </span>
  );
};

const OrderDetailPanel = ({ order }) => {
  const { search } = useLocation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const paymentSuccess = new URLSearchParams(search).get("payment") === "success";

  return (
    <div className="od-panel">
      <div className="od-header">
        <div>
          <h2 className="od-title">Comandă #{order._id.slice(-6).toUpperCase()}</h2>
          <p className="od-date">
            {new Date(order.createdAt).toLocaleDateString("ro-RO", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="od-badges">
          <span className={`od-badge od-badge--status od-badge--${order.status.toLowerCase()}`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
          <PaymentBadge isPaid={order.isPaid} isRefunded={order.isRefunded} />
        </div>
      </div>

      {paymentSuccess && !order.isPaid && (
        <div className="od-processing" role="status">
          <span className="od-processing__dot" aria-hidden="true" />
          Plata se procesează... Pagina se va actualiza în câteva secunde.
        </div>
      )}

      <ul className="od-items">
        {order.items.map((item, i) => (
          <li key={i} className="od-item">
            <span className="od-item__name">{item.brand} {item.model}</span>
            <span className="od-item__qty">×{item.quantity}</span>
            <span className="od-item__price">{(item.price * item.quantity).toLocaleString("ro-RO")} RON</span>
          </li>
        ))}
      </ul>

      <div className="od-footer">
        <div className="od-row">
          <span className="od-label">Metodă plată:</span>
          <span>{order.paymentMethod}</span>
          <CardInfo details={order.paymentDetails} />
        </div>
        <div className="od-row od-row--address">
          <span className="od-label">Adresă livrare:</span>
          <span>
            {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
            {order.deliveryAddress.county} {order.deliveryAddress.zip} — {order.deliveryAddress.phone}
          </span>
        </div>
        <div className="od-total">
          Total: <strong>{Number(order.totalPrice).toLocaleString("ro-RO")} RON</strong>
        </div>
        {order.status === "Pending" && (
          <button
            type="button"
            className="od-btn-cancel"
            disabled={isCancelling}
            onClick={() => cancelOrder(order._id)}
          >
            {isCancelling ? "Se anulează..." : "Anulează comanda"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPanel;
