import { Link } from "react-router-dom";
import { fmt, fmtRate, SHIP_THRESHOLD } from "../../products/add-to-Cart/cartUtils";
import panda from "../../../Assets/images/panda.png";

const CheckoutStepCart = ({ cart }) => {
  const shipping = cart.cartTotalAmount >= SHIP_THRESHOLD ? 0 : 19.99;

  return (
    <div className="ck-section">
      <div className="ck-section__hd">
        <span className="ck-section__num">1</span>
        <h3 className="ck-section__title">Coșul meu</h3>
        <Link to="/cart" className="ck-cart-edit">Editează</Link>
      </div>

      <div className="ck-cart-items">
        {cart.card.map((item, idx) => {
          const p    = item.data;
          const name = p.model || p.name || "Produs";
          const img  = p._variantImages?.[0] ?? p.images?.[0] ?? panda;
          const num  = String(idx + 1).padStart(2, "0");
          const attrs = Object.entries(p._variantAttrs ?? {}).filter(([, v]) => v);

          return (
            <div key={p._id} className="ck-cart-item">
              <span className="ck-cart-item__idx">{num}</span>
              <img src={img} alt={name} className="ck-cart-item__img" />
              <div className="ck-cart-item__info">
                {p.brand && <span className="ck-cart-item__brand">{p.brand}</span>}
                <p className="ck-cart-item__name">{name}</p>
                {attrs.length > 0 && (
                  <div className="ck-cart-item__attrs">
                    {attrs.map(([k, v]) => <span key={k}>{v}</span>)}
                  </div>
                )}
                <span className="ck-cart-item__unit">{fmt(p.price ?? p.minPrice ?? 0)} RON / buc.</span>
                {p._selectedRate && (
                  <span className="ck-cart-item__rate">
                    {p._selectedRate} rate · {fmtRate((p.price ?? p.minPrice ?? 0) / p._selectedRate)} RON/lună
                  </span>
                )}
              </div>
              <div className="ck-cart-item__right">
                <span className="ck-cart-item__total">{fmt(item.itemAmountPrice)} RON</span>
                <span className="ck-cart-item__qty">×{item.itemQuantity}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ck-cart-summary">
        <div className="ck-cart-summary__row">
          <span>Livrare</span>
          {shipping === 0
            ? <span className="ck-cart-summary__free">Gratuită</span>
            : <span>{fmt(shipping)} RON</span>}
        </div>
        <div className="ck-cart-summary__total">
          <span>Total</span>
          <span>{fmt(cart.cartTotalAmount + shipping)} RON</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepCart;
