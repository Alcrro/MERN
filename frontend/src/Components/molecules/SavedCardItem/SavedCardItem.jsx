import {
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
} from "../../../features/paymentMethods/rtkPaymentMethods";
import "./SavedCardItem.css";

const BRAND_LABEL  = { visa: "VISA", mastercard: "MASTERCARD", amex: "AMEX", maestro: "MAESTRO" };
const KNOWN_BRANDS = new Set(["visa", "mastercard", "amex", "maestro"]);

const SavedCardItem = ({ paymentMethod }) => {
  const { id, brand, last4, expMonth, expYear, isDefault } = paymentMethod;
  const [deleteCard, { isLoading: deleting }] = useDeletePaymentMethodMutation();
  const [setDefault, { isLoading: settingDefault }] = useSetDefaultPaymentMethodMutation();

  const now = new Date();
  const isExpired =
    expYear < now.getFullYear() ||
    (expYear === now.getFullYear() && expMonth < now.getMonth() + 1);

  const label = BRAND_LABEL[brand] || brand.toUpperCase();
  const expStr = `${String(expMonth).padStart(2, "0")}/${String(expYear).slice(-2)}`;

  return (
    <div className="sci">
      <div className={`sci__card sci__card--${KNOWN_BRANDS.has(brand) ? brand : "unknown"}${isExpired ? " sci__card--expired" : ""}`}>
        <div className="sci__card-top">
          <span className="sci__brand">{label}</span>
          {isDefault && <span className="sci__badge">Implicit</span>}
        </div>
        <div className="sci__chip" aria-hidden="true">
          <div className="sci__chip-lines" />
        </div>
        <div className="sci__number">•••• •••• •••• {last4}</div>
        <div className="sci__card-bottom">
          <div className="sci__expiry-block">
            <span className="sci__card-label">Valabil până</span>
            <span className="sci__expiry">{expStr}</span>
          </div>
          {isExpired && <span className="sci__expired-tag">Expirat</span>}
        </div>
        <div className="sci__glow" aria-hidden="true" />
      </div>
      <div className="sci__actions">
        {!isDefault && (
          <button
            type="button"
            className="sci__btn sci__btn--default"
            onClick={() => setDefault(id)}
            disabled={settingDefault}
            aria-label={`Setează ${label} ••••${last4} ca implicit`}
          >
            Setează implicit
          </button>
        )}
        <button
          type="button"
          className="sci__btn sci__btn--delete"
          onClick={() => deleteCard(id)}
          disabled={deleting}
          aria-label={`Șterge cardul ${label} ••••${last4}`}
        >
          Șterge
        </button>
      </div>
    </div>
  );
};

export default SavedCardItem;
