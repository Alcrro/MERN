import { Link } from "react-router-dom";
import { useGetPaymentMethodsQuery } from "../../../features/paymentMethods/rtkPaymentMethods";
import "./SummaryPaymentWidget.css";

const BRAND_LABEL = { visa: "VISA", mastercard: "MASTERCARD", amex: "AMEX", maestro: "MAESTRO" };
const KNOWN       = new Set(["visa", "mastercard", "amex", "maestro"]);

const SummaryPaymentWidget = () => {
  const { data, isLoading } = useGetPaymentMethodsQuery();
  const methods = data?.data ?? [];
  const pm = methods.find((p) => p.isDefault) ?? methods[0] ?? null;

  const now = new Date();
  const isExpired = pm && (
    pm.expYear < now.getFullYear() ||
    (pm.expYear === now.getFullYear() && pm.expMonth < now.getMonth() + 1)
  );

  const brand  = pm?.brand ?? "unknown";
  const label  = BRAND_LABEL[brand] || brand.toUpperCase();
  const expStr = pm
    ? `${String(pm.expMonth).padStart(2, "0")}/${String(pm.expYear).slice(-2)}`
    : "";

  return (
    <div className="sum-payment">
      <div className="sum-payment__header">
        <h3 className="sum-payment__title">Card de plată implicit</h3>
        <Link to="/profile/payment-methods" className="sum-payment__link">Gestionează</Link>
      </div>

      {isLoading && <div className="sum-payment__skel" />}

      {!isLoading && !pm && (
        <div className="sum-payment__empty">
          <p>Nu ai un card de plată salvat.</p>
          <Link to="/profile/payment-methods" className="sum-payment__cta">+ Adaugă card</Link>
        </div>
      )}

      {!isLoading && pm && (
        <div className={`sum-payment__card sum-payment__card--${KNOWN.has(brand) ? brand : "unknown"}${isExpired ? " sum-payment__card--expired" : ""}`}>
          <div className="sum-payment__card-top">
            <span className="sum-payment__brand">{label}</span>
            <span className="sum-payment__implicit">Implicit</span>
          </div>
          <div className="sum-payment__chip"><div className="sum-payment__chip-lines" /></div>
          <div className="sum-payment__number">•••• •••• •••• {pm.last4}</div>
          <div className="sum-payment__card-bottom">
            <div className="sum-payment__expiry-block">
              <span className="sum-payment__card-label">Valabil până</span>
              <span className="sum-payment__expiry">{expStr}</span>
            </div>
            {isExpired && <span className="sum-payment__expired-tag">Expirat</span>}
          </div>
          <div className="sum-payment__glow" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default SummaryPaymentWidget;
