import { useState } from "react";
import Stars from "./Stars";
import ProductImageCarousel from "./ProductImageCarousel";
import VariantPicker from "./VariantPicker";
import useVariantPicker from "./useVariantPicker";
import { AVAIL_COLOR } from "./singleProductConstants";
import { deliveryDate } from "./singleProductUtils";
import {
  TruckIcon, ZapIcon, StoreIcon,
  ReturnIcon, ShieldIcon, BadgeIcon,
  CheckIcon, CartIcon, HeartIcon,
  LockIcon, CheckSmIcon, PhoneIcon,
} from "./singleProductIcons";
import InstallmentWidget from "./InstallmentWidget";
import "./ProductHero.css";

const DELIVERY = [
  { id: "standard", Icon: TruckIcon, name: "Livrare standard",  sub: () => `Ajunge: ${deliveryDate()}`, price: "Gratuit"    },
  { id: "express",  Icon: ZapIcon,   name: "Curier express",     sub: () => "Mâine până la 14:00",       price: "19,99 RON" },
  { id: "pickup",   Icon: StoreIcon, name: "Ridicare personală", sub: () => "Azi din București",          price: "Gratuit"   },
];

const ProductHero = ({ p, productName, added, onAddToCart, onScrollToReviews, listing, recPct = 0 }) => {
  const [delivery, setDelivery] = useState("standard");

  const src      = listing ?? p;
  const variants = src.variants ?? [];

  const { attrKeys, options, selected, activeVariant, isValid, select } = useVariantPicker(variants);
  const activeV  = activeVariant ?? {};

  const allImgs = [...new Set([...(activeV.images ?? []), ...(src.images ?? [])].filter(Boolean))];

  const avail   = activeV.stock?.availability;
  const qty     = activeV.stock?.quantity ?? 0;
  const aStyle  = AVAIL_COLOR[avail] || AVAIL_COLOR["In Stoc"];
  const isOut   = avail === "Stoc Epuizat" || qty === 0;
  const isPromo = avail === "Promotii";
  const price   = activeV.price ?? 0;
  const fmtP    = price.toLocaleString("ro-RO");
  const discount  = isPromo ? Math.round(price * 0.1) : 0;
  const fmtFinal  = (price - discount).toLocaleString("ro-RO");
  const avg     = p.rating?.average ?? 0;
  const rcount  = p.rating?.count ?? 0;

  return (
    <section className="sp-hero">

      <ProductImageCarousel
        images={allImgs}
        alt={`${p.brand} ${productName}`}
        avail={avail}
        availStyle={aStyle}
      />

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
        {recPct > 0 && (
          <div className="sp-rec">
            <div className="sp-rec-track"><div className="sp-rec-fill" style={{ width: `${recPct}%` }} /></div>
            <span className="sp-rec-label"><strong>{recPct}%</strong> recomandă produsul</span>
          </div>
        )}

        <div className="sp-sep" />

        <VariantPicker attrKeys={attrKeys} options={options} selected={selected} isValid={isValid} onSelect={select} />

        <div className="sp-sep" />

        <div className="sp-delivery-picker">
          {DELIVERY.map(({ id, Icon, name, sub, price: dPrice }) => (
            <label key={id} className={`sp-dopt${delivery === id ? " sp-dopt--on" : ""}`}>
              <input type="radio" name="delivery" value={id} checked={delivery === id} onChange={() => setDelivery(id)} />
              <span className="sp-dopt-icon"><Icon /></span>
              <span className="sp-dopt-body">
                <span className="sp-dopt-name">{name}</span>
                <span className="sp-dopt-sub">{sub()}</span>
              </span>
              <span className="sp-dopt-price">{dPrice}</span>
            </label>
          ))}
        </div>

        <div className="sp-seller-card">
          <div className="sp-sc-row"><ShieldIcon /><span>Garanție <strong>24 luni</strong> de la producător</span></div>
          <div className="sp-sc-row"><ReturnIcon /><span>Retur gratuit <strong>30 zile</strong> fără întrebări</span></div>
          <div className="sp-sc-row"><CheckSmIcon /><span>Asigurare transport <strong>inclusă</strong></span></div>
          <div className="sp-sc-row"><BadgeIcon /><span>Vânzător <strong>certificat</strong> AlcRo</span></div>
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

        <InstallmentWidget price={discount > 0 ? price - discount : price} />

        <div className="sp-cta">
          <button
            className={`sp-btn-primary${added ? " sp-btn-primary--done" : ""}`}
            onClick={() => onAddToCart(activeV)}
            disabled={isOut}
          >
            {added ? <><CheckIcon />Adăugat în coș</> : <><CartIcon />Adaugă în coș</>}
          </button>
          <button type="button" className="sp-btn-outline"><HeartIcon />Adaugă la favorite</button>
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
