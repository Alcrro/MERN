import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toggleFavorite } from "../../../features/favorites/favoritesSlice";
import SingleCardRating from "../../UI/singleCardRating/SingleCardRating";
import AddToCartV2Button from "../../UI/add-to-cart-v2-button/AddToCartV2Button";
import { HeartIcon } from "./cardsIcons";
import { AVAIL_CLASS } from "./cardsConstants";
import { COLOR_MAP } from "../../../utils/colorUtils";
import panda from "../../../Assets/images/panda.png";
import "./cards.css";

const Cards = ({ products: data }) => {
  const dispatch = useDispatch();
  const isFav    = useSelector((s) => s.favorites.items.some((p) => p._id === data._id));

  const firstVariant   = data.variants?.[0];
  const avail          = firstVariant?.stock?.availability;
  const qty            = firstVariant?.stock?.quantity ?? 0;
  const availClass     = AVAIL_CLASS[avail] || "avail-green";
  const displayPrice   = data.minPrice ?? firstVariant?.price;
  const hasMultiPrice  = data.variants?.length > 1 &&
    data.variants.some((v) => v.price !== data.variants[0].price);
  const priceFormatted = displayPrice?.toLocaleString("ro-RO");

  const colorOptions = [...new Set(
    (data.variants ?? [])
      .map((v) => v.attributes?.Culoare)
      .filter(Boolean)
  )];

  return (
    <div className="card-item">
      <div className="card-v2">
        <div className="card-v2-wrapper">
          <Link to={data.sku ? `/product/${data.slug}/${data.sku}` : `/product/${data._id}`} className="card-v2-link">
            <div className="card-v2-thumb-inner">
              <img src={data.images?.[0] || panda} alt={`${data.brand} ${data.model}`} />
              {avail && <span className={`card-avail-badge ${availClass}`}>{avail}</span>}
              <button
                className={`card-fav-btn${isFav ? " card-fav-btn--active" : ""}`}
                onClick={(e) => { e.preventDefault(); dispatch(toggleFavorite(data)); }}
                aria-label={isFav ? "Elimină din favorite" : "Adaugă la favorite"}
              >
                <HeartIcon filled={isFav} />
              </button>
            </div>

            <div className="pad-description">
              <div className="card-v2-meta">
                <span className="card-brand-chip">{data.brand}</span>
                {data.memorieInterna && <span className="card-memory-chip">{data.memorieInterna}</span>}
                {data.sellersCount > 1 && (
                  <span className="card__sellers-badge">{data.sellersCount} oferte</span>
                )}
              </div>

              {colorOptions.length > 1 && (
                <div className="card-colors">
                  {colorOptions.slice(0, 6).map((c) => (
                    <span
                      key={c}
                      className="card-color-dot"
                      style={{ background: COLOR_MAP[c] || "#9ca3af" }}
                      title={c}
                    />
                  ))}
                  {colorOptions.length > 6 && (
                    <span className="card-colors-more">+{colorOptions.length - 6}</span>
                  )}
                </div>
              )}
              <h2 className="card-v2-title-wrapper">{data.model}</h2>
              <p className="card-v2-desc">{data.description}</p>
              <div className="card-v2-rating">
                <SingleCardRating data={data} />
              </div>
              <div className="card-estimate-placeholder">
                <span className="card-stock">
                  {qty === 1 && <span className="danger-stock">Ultimul produs în stoc</span>}
                  {qty > 1 && qty <= 3 && <span className="danger-stock">Ultimele {qty} produse</span>}
                </span>
              </div>
            </div>
          </Link>

          <div className="card-v2-content">
            <div className="card-v2-price">
              <p className="product-new-price">
                {hasMultiPrice && <span className="price-from">De la </span>}
                {priceFormatted}<span className="price-currency">RON</span>
              </p>
            </div>
            <div className="card-v2-add-to-cart">
              <AddToCartV2Button data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
