import { fmt } from "../../products/add-to-Cart/cartUtils";

const CheckoutStepConfirm = ({ cart, onSubmit, isSubmitting, error }) => (
  <div className="ck-step">
    <h3 className="ck-step__title">Confirmă comanda</h3>
    <div className="ck-confirm__items">
      {cart.card.map((item) => (
        <div key={item.data._id} className="ck-confirm__row">
          <span className="ck-confirm__name">
            {[item.data.brand, item.data.model || item.data.name].filter(Boolean).join(" ") || "Produs"}
            <span className="ck-confirm__qty"> ×{item.itemQuantity}</span>
          </span>
          <span className="ck-confirm__price">{fmt(item.itemAmountPrice)} RON</span>
        </div>
      ))}
    </div>
    <div className="ck-confirm__total">
      <span>Total</span>
      <strong>{fmt(cart.cartTotalAmount)} RON</strong>
    </div>
    {error && (
      <p className="ck-error">
        {error.data?.message || "Eroare la plasarea comenzii. Încearcă din nou."}
      </p>
    )}
    <button type="button" className="ck-btn ck-btn--primary ck-btn--full"
      onClick={onSubmit} disabled={isSubmitting}>
      {isSubmitting ? "Se procesează..." : "Finalizează comanda"}
    </button>
  </div>
);

export default CheckoutStepConfirm;
