import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./addToCart.css";
import {
  addToCart,
  removeFromCart,
  removeSingleCart,
} from "../../../features/product/addToCart/addToCartSlice";

const fmt = (n) => Number(n).toLocaleString("ro-RO");
const SHIP_THRESHOLD = 500;

/* ── Icons ──────────────────────────────────────────────────── */
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);
const MinusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 12a9 9 0 109-9M3 3v4h4"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ── Step indicator ─────────────────────────────────────────── */
const STEPS = ["Coș", "Livrare", "Plată"];

const Steps = () => (
  <div className="ct-steps">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className={`ct-step${i === 0 ? " ct-step--active" : ""}`}>
          <span className="ct-step__dot">
            {i === 0 ? <CheckIcon /> : i + 1}
          </span>
          <span className="ct-step__label">{label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`ct-step__line${i === 0 ? " ct-step__line--done" : ""}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ── Shipping progress bar ──────────────────────────────────── */
const ShipBar = ({ total }) => {
  const pct  = Math.min(100, Math.round((total / SHIP_THRESHOLD) * 100));
  const left = fmt(Math.max(0, SHIP_THRESHOLD - total));
  const done = total >= SHIP_THRESHOLD;

  return (
    <div className={`ct-ship${done ? " ct-ship--done" : ""}`}>
      <div className="ct-ship__row">
        <TruckIcon />
        {done
          ? <span>Felicitări! Ai obținut <strong>livrare gratuită</strong>.</span>
          : <span>Mai adaugă <strong>{left} RON</strong> și livrarea e gratuită.</span>}
        <span className="ct-ship__pct">{pct}%</span>
      </div>
      <div className="ct-ship__track">
        <div className="ct-ship__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ── Empty state ─────────────────────────────────────────────── */
const EmptyCart = () => (
  <div className="ct-empty">
    <svg className="ct-empty__svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="currentColor" opacity=".06"/>
      <path d="M34 42h52l-6 36H40L34 42z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
      <path d="M26 34h12l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="48" cy="86" r="4" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="72" cy="86" r="4" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M52 58h16M60 50v16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".4"/>
    </svg>
    <h2 className="ct-empty__title">Coșul tău este gol</h2>
    <p className="ct-empty__sub">Explorează produsele și adaugă ce îți place.</p>
    <Link to="/products" className="ct-empty__btn">
      Descoperă produsele <ArrowRight />
    </Link>
  </div>
);

/* ── Main component ──────────────────────────────────────────── */
const AddToCart = () => {
  const cart     = useSelector((s) => s.addToCart);
  const dispatch = useDispatch();

  const inc = (item) => {
    if (item.itemQuantity < (item.data.stock?.quantity ?? Infinity)) {
      dispatch(addToCart(item));
    }
  };
  const dec = (item) => dispatch(removeSingleCart(item));
  const del = (item) => dispatch(removeFromCart(item));

  if (cart.card.length === 0) return <EmptyCart />;

  return (
    <div className="ct-page">

      <Steps />

      <div className="ct-head">
        <h1 className="ct-head__title">Coșul meu</h1>
        <span className="ct-head__count">
          {cart.card.length} {cart.card.length === 1 ? "produs" : "produse"}
        </span>
      </div>

      <div className="ct-layout">

        {/* ── LEFT: items + ship bar ── */}
        <div className="ct-left">

          <div className="ct-items">
            {cart.card.map((item, idx) => {
              const p      = item.data;
              const brand  = p.brand || null;
              const name   = p.model || p.name || p.description?.slice(0, 40) || "Produs";
              const atMax  = item.itemQuantity >= (p.stock?.quantity ?? Infinity);
              const num    = String(idx + 1).padStart(2, "0");

              return (
                <div key={p._id} className="ct-item">

                  {/* editorial index */}
                  <span className="ct-item__idx" aria-hidden>{num}</span>

                  {/* image */}
                  <div className="ct-item__img-wrap">
                    <img
                      src={require("../../../Assets/images/panda.png")}
                      alt={name}
                      className="ct-item__img"
                    />
                  </div>

                  {/* info */}
                  <div className="ct-item__info">
                    {brand && <span className="ct-item__brand">{brand}</span>}
                    <p className="ct-item__name">{name}</p>
                    {(p.stocare || p.RAM || p.camera || p.display || p.baterie || p.culoare) && (
                      <div className="ct-item__specs">
                        {p.stocare  && <span>{p.stocare}</span>}
                        {p.RAM      && <span>{p.RAM} RAM</span>}
                        {p.camera   && <span>{p.camera.split("+")[0].trim()} MP</span>}
                        {p.display  && <span>{p.display.split(" ")[0]}</span>}
                        {p.baterie  && <span>{p.baterie}</span>}
                        {p.culoare  && <span>{p.culoare}</span>}
                      </div>
                    )}
                    <span className="ct-item__unit">{fmt(p.price)} RON / buc.</span>
                  </div>

                  {/* price + stepper */}
                  <div className="ct-item__right">
                    <span className="ct-item__total">{fmt(item.itemAmountPrice)} RON</span>
                    <div className="ct-stepper">
                      <button className="ct-stepper__btn" onClick={() => dec(item)} aria-label="Scade">
                        <MinusIcon />
                      </button>
                      <span className="ct-stepper__qty">{item.itemQuantity}</span>
                      <button
                        className={`ct-stepper__btn${atMax ? " ct-stepper__btn--off" : ""}`}
                        onClick={() => inc(item)}
                        disabled={atMax}
                        aria-label="Crește"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>

                  {/* remove */}
                  <button className="ct-item__del" onClick={() => del(item)} aria-label="Șterge">
                    <TrashIcon />
                  </button>

                </div>
              );
            })}
          </div>

          <ShipBar total={cart.cartTotalAmount} />
        </div>

        {/* ── RIGHT: order summary ── */}
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
                <span>{fmt(cart.cartTotalAmount)} RON</span>
              </div>
              <div className="ct-receipt__row">
                <span>Livrare</span>
                {cart.cartTotalAmount >= SHIP_THRESHOLD
                  ? <span className="ct-receipt__free">Gratuită</span>
                  : <span className="ct-receipt__ship-cost">~15 RON</span>}
              </div>
            </div>

            <div className="ct-receipt__total">
              <span>Total</span>
              <span className="ct-receipt__total-val">{fmt(cart.cartTotalAmount)} RON</span>
            </div>
          </div>

          <Link to="/cart/checkout" className="ct-cta">
            Finalizează comanda
            <ArrowRight />
          </Link>

          <div className="ct-trust">
            <span><LockIcon /> Plată securizată</span>
            <span>•</span>
            <span><TruckIcon /> Livrare 1–2 zile</span>
            <span>•</span>
            <span><ReturnIcon /> Retur 30 zile</span>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default AddToCart;
