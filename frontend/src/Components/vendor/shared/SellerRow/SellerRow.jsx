import { Link } from "react-router-dom";
import "./SellerRow.css";

const AVAIL_MOD = {
  "In Stoc":      "green",
  "Promotii":     "amber",
  "Nou":          "blue",
  "Resigilat":    "purple",
  "Precomanda":   "gray",
  "Stoc Epuizat": "red",
};

const SellerRow = ({ seller, selected, onSelect }) => {
  const firstVariant = seller.variants?.[0];
  const price = (seller.minPrice ?? firstVariant?.price)?.toLocaleString("ro-RO");
  const avail = firstVariant?.stock?.availability;
  const shop  = seller.vendor?.shopName ?? "Vânzător";
  const vp      = seller.vendor?.profile ?? {};
  const loc     = seller.vendor?.locations?.[0] ?? {};
  const tip     = vp?.tipEntitate;
  const vRating = seller.vendor?.rating;
  const city    = loc.oras;
  const retur   = vp?.returZile;
  const min     = loc.zileLivrare?.min;
  const max     = loc.zileLivrare?.max;
  const mod   = AVAIL_MOD[avail] ?? "gray";

  return (
    <div
      className={`seller-row${selected ? " seller-row--selected" : ""}`}
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(seller)}
    >
      <span className={`seller-row__radio${selected ? " seller-row__radio--on" : ""}`} aria-hidden="true" />

      <div className="seller-row__identity">
        {seller.vendor?._id ? (
          <Link
            to={`/vendor/${seller.vendor._id}`}
            className="seller-row__shop seller-row__shop--link"
            onClick={(e) => e.stopPropagation()}
          >
            {shop}
          </Link>
        ) : (
          <span className="seller-row__shop">{shop}</span>
        )}
        {tip && <span className="seller-row__tip">{tip}</span>}
        {vRating?.count > 0 && (
          <span className="seller-row__vrating">★ {vRating.average.toFixed(1)}</span>
        )}
      </div>

      <div className="seller-row__meta">
        {avail && <span className={`seller-row__dot seller-row__dot--${mod}`} />}
        {avail && <span>{avail}</span>}
        {city  && <><span className="seller-row__sep">·</span><span>{city}</span></>}
        {min != null && max != null
          ? <><span className="seller-row__sep">·</span><span>🚚 {min}–{max}&nbsp;zile</span></>
          : null
        }
        {retur != null && <><span className="seller-row__sep">·</span><span>↩ {retur}&nbsp;zile</span></>}
      </div>

      <span className="seller-row__price">
        {price} <span className="seller-row__currency">RON</span>
      </span>

      <button
        type="button"
        className={`seller-row__btn${selected ? " seller-row__btn--active" : ""}`}
        onClick={(e) => { e.stopPropagation(); onSelect(seller); }}
        aria-pressed={selected}
      >
        {selected ? "✓ Ales" : "Alege"}
      </button>
    </div>
  );
};

export default SellerRow;
