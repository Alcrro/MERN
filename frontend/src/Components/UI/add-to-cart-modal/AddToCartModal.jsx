import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, addToCart, removeSingleCart } from "../../../features/product/addToCart/addToCartSlice";
import { fmt } from "../../products/add-to-Cart/cartUtils";
import panda from "../../../Assets/images/panda.png";
import "./addToCartModal.css";

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const MODAL_W = 340;

const AddToCartModal = () => {
  const dispatch    = useDispatch();
  const cart        = useSelector((s) => s.addToCart);
  const items       = cart.card ?? [];
  const totalQty    = cart.cartTotalQuantity;
  const totalAmount = cart.cartTotalAmount;

  const wrapRef  = useRef(null);
  const [align, setAlign] = useState("center");

  useEffect(() => {
    const el = wrapRef.current?.closest(".cart-wrapper");
    if (!el) return;
    const check = () => {
      const rect   = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const vw     = window.innerWidth;
      if (center - MODAL_W / 2 < 8)           setAlign("right");
      else if (center + MODAL_W / 2 > vw - 8) setAlign("left");
      else                                     setAlign("center");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className={`crt-modal crt-modal--${align}`} ref={wrapRef}>
      <div className="crt-modal__inner">

        <div className="crt-modal__head">
          <span className="crt-modal__title">Coșul tău</span>
          {totalQty > 0 && (
            <span className="crt-modal__count">{totalQty} {totalQty === 1 ? "produs" : "produse"}</span>
          )}
        </div>

        <div className="crt-modal__body">
          {items.length === 0 ? (
            <div className="crt-modal__empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Coșul este gol</p>
            </div>
          ) : (
            items.map((item, i) => {
              const p    = item.data;
              const name = p.model || p.name || p.brand;
              return (
                <div className="crt-modal__item" key={i}>
                  <Link to="/cart" className="crt-modal__img-wrap">
                    <img src={p.images?.[0] || panda} alt={name} />
                  </Link>
                  <div className="crt-modal__info">
                    <Link to="/cart" className="crt-modal__name">{p.brand} {name}</Link>
                    <div className="crt-modal__specs">
                      {p.stocare  && <span>{p.stocare}</span>}
                      {p.RAM      && <span>{p.RAM} RAM</span>}
                      {p.camera   && <span>{p.camera.split("+")[0].trim()} MP</span>}
                      {p.display  && <span>{p.display.split(" ")[0]}</span>}
                      {p.baterie  && <span>{p.baterie}</span>}
                      {p.culoare  && <span>{p.culoare}</span>}
                      {p.material && <span>{p.material}</span>}
                    </div>
                    <div className="crt-modal__price-row">
                      <div className="crt-modal__qty">
                        <button type="button" onClick={() => dispatch(removeSingleCart(item))} aria-label="Scade">−</button>
                        <span>{item.itemQuantity}</span>
                        <button type="button" onClick={() => dispatch(addToCart(item))} aria-label="Adaugă">+</button>
                      </div>
                      <span className="crt-modal__item-price">{fmt(item.itemAmountPrice)} RON</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="crt-modal__remove"
                    onClick={() => dispatch(removeFromCart(item))}
                    aria-label="Șterge"
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="crt-modal__foot">
            <div className="crt-modal__total">
              <span>Total</span>
              <span className="crt-modal__total-val">{fmt(totalAmount)} RON</span>
            </div>
            <Link to="/cart" className="crt-modal__cta">
              Vezi coșul →
            </Link>
            <Link to="/cart/checkout" className="crt-modal__cta crt-modal__cta--outline">
              Finalizează comanda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCartModal;
