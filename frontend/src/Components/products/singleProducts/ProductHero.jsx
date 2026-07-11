import { useState } from "react";
import pandaImg from "../../../Assets/images/panda.png";
import Stars from "./Stars";
import { AVAIL_COLOR, DEMO_COLORS } from "./singleProductConstants";
import { deliveryDate } from "./singleProductUtils";
import { TruckIcon, ReturnIcon, ShieldIcon, CheckIcon, CartIcon, HeartIcon, LockIcon, CheckSmIcon, PhoneIcon } from "./singleProductIcons";

const ProductHero = ({ p, productName, added, onAddToCart, onScrollToReviews, listing }) => {
  const [selColor, setSelColor] = useState(0);

  const src    = listing ?? p;
  const avail  = src.stock?.availability;
  const qty    = src.stock?.quantity ?? 0;
  const aStyle = AVAIL_COLOR[avail] || AVAIL_COLOR["In Stoc"];
  const isOut  = avail === "Stoc Epuizat" || qty === 0;
  const isPromo = avail === "Promotii";
  const price  = src.price ?? 0;
  const fmtP   = price.toLocaleString("ro-RO");
  const discount = isPromo ? Math.round(price * 0.1) : 0;
  const fmtFinal = (price - discount).toLocaleString("ro-RO");
  const avg      = p.rating?.average ?? 0;
  const rcount   = p.rating?.count ?? 0;

  return (
    <section className="sp-hero">

      <div className="sp-img-wrap">
        {avail && <span className="sp-avail" style={{ background: aStyle.bg, color: aStyle.color }}>{avail}</span>}
        <div className="sp-img-inner">
          <img src={pandaImg} alt={`${p.brand} ${productName}`} />
        </div>
      </div>

      <div className="sp-details">
        <div className="sp-chips"><span className="sp-chip-brand">{p.brand}</span></div>
        <h1 className="sp-title">{p.brand} {productName}</h1>
        {avg > 0 && (
          <div className="sp-rating-row">
            <Stars value={avg} size={17} />
            <span className="sp-avg-num">{avg.toFixed(1)}</span>
            <button className="sp-rev-link" onClick={onScrollToReviews}>
              {rcount} {rcount === 1 ? "recenzie" : "recenzii"}
            </button>
          </div>
        )}
        <div className="sp-sep" />
        {p.stocare && (
          <div className="sp-variant-group">
            <span className="sp-variant-label">Stocare</span>
            <div className="sp-variant-chips"><button className="sp-vchip sp-vchip--on">{p.stocare}</button></div>
          </div>
        )}
        <div className="sp-variant-group">
          <span className="sp-variant-label">Culoare: <strong>{DEMO_COLORS[selColor].name}</strong></span>
          <div className="sp-colors">
            {DEMO_COLORS.map((c, i) => (
              <button key={i} className={`sp-color${selColor === i ? " sp-color--on" : ""}`}
                style={{ background: c.hex }} onClick={() => setSelColor(i)} title={c.name} />
            ))}
          </div>
        </div>
        <div className="sp-sep" />
        <div className="sp-delivery">
          <div className="sp-del-row"><TruckIcon /><div><span className="sp-del-title">Livrare gratuită</span><span className="sp-del-sub">Ajunge la tine: <strong>{deliveryDate()}</strong></span></div></div>
          <div className="sp-del-row"><ReturnIcon /><div><span className="sp-del-title">Retur gratuit 30 zile</span><span className="sp-del-sub">Fără întrebări</span></div></div>
          <div className="sp-del-row"><ShieldIcon /><div><span className="sp-del-title">Garanție 24 luni</span><span className="sp-del-sub">Produse originale cu factură</span></div></div>
        </div>
        <div className="sp-stock">
          {isOut ? <span className="sp-s-out">✕ Stoc epuizat</span>
            : qty <= 3 ? <span className="sp-s-low">⚠ Ultimele {qty} bucăți</span>
            : <span className="sp-s-ok">✓ În stoc</span>}
        </div>
      </div>

      <div className="sp-price-panel">
        <div className="sp-price-box">
          <div className="sp-prow"><span className="sp-plabel">Preț</span><span className="sp-pval">{fmtP} RON</span></div>
          {discount > 0 && (
            <div className="sp-prow sp-prow--discount">
              <span className="sp-plabel">Reducere (10%)</span>
              <span className="sp-pval sp-pval--discount">−{discount.toLocaleString("ro-RO")} RON</span>
            </div>
          )}
          <div className="sp-pdivider" />
          <div className="sp-prow sp-prow--total">
            <span className="sp-plabel-total">Total</span>
            <span className="sp-pval-total">{discount > 0 ? fmtFinal : fmtP} RON</span>
          </div>
        </div>
        <div className="sp-cta">
          <button className={`sp-btn-primary${added ? " sp-btn-primary--done" : ""}`} onClick={onAddToCart} disabled={isOut}>
            {added ? <><CheckIcon />Adăugat în coș</> : <><CartIcon />Adaugă în coș</>}
          </button>
          <button className="sp-btn-outline"><HeartIcon />Adaugă la favorite</button>
        </div>
        <div className="sp-mini-trust">
          <span><LockIcon /> Plată securizată</span>
          <span><CheckSmIcon /> Produs original</span>
          <span><PhoneIcon /> Suport 24/7</span>
        </div>
      </div>

    </section>
  );
};

export default ProductHero;
