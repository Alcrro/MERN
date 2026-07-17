import { Link } from "react-router-dom";
import { ArrowRight, LockIcon, TruckIcon, ReturnIcon } from "./cartIcons";
import { fmt, SHIP_THRESHOLD } from "./cartUtils";

const CartSummary = ({ cart }) => {
  const total = cart.cartTotalAmount;

  return (
    <aside className="ct-summary">
      <div className="ct-receipt">
        <div className="ct-receipt__head">
          <span className="ct-receipt__label">Sumar comandă</span>
          <span className="ct-receipt__badge">
            {cart.cartTotalQuantity} {cart.cartTotalQuantity === 1 ? "produs" : "produse"}
          </span>
        </div>
        <div className="ct-receipt__lines">
          <div className="ct-receipt__row">
            <span>Subtotal</span>
            <span>{fmt(total)} RON</span>
          </div>
          <div className="ct-receipt__row">
            <span>Livrare</span>
            {total >= SHIP_THRESHOLD
              ? <span className="ct-receipt__free">Gratuită</span>
              : <span className="ct-receipt__ship-cost">~15 RON</span>}
          </div>
        </div>
        <div className="ct-receipt__total">
          <span>Total</span>
          <span className="ct-receipt__total-val">{fmt(total)} RON</span>
        </div>
      </div>
      <Link to="/cart/checkout" className="ct-cta">
        Finalizează comanda <ArrowRight />
      </Link>
      <div className="ct-trust">
        <span><LockIcon /> Plată securizată</span>
        <span>•</span>
        <span><TruckIcon /> Livrare 1–2 zile</span>
        <span>•</span>
        <span><ReturnIcon /> Retur 30 zile</span>
      </div>
    </aside>
  );
};

export default CartSummary;
