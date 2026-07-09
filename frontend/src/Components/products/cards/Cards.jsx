import React from "react";
import "./cards.css";
import SingleCardRating from "../../UI/singleCardRating/SingleCardRating";
import AddToCartV2Button from "../../UI/add-to-cart-v2-button/AddToCartV2Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../../features/favorites/favoritesSlice";

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const AVAIL_CLASS = {
  "In Stoc":      "avail-green",
  "Nou":          "avail-blue",
  "Promotii":     "avail-orange",
  "Resigilat":    "avail-purple",
  "Precomanda":   "avail-orange",
  "Stoc Epuizat": "avail-red",
};

const Cards = ({ products: data }) => {
  const dispatch = useDispatch();
  const isFav    = useSelector((s) => s.favorites.items.some((p) => p._id === data._id));

  const avail = data.stock?.availability;
  const qty   = data.stock?.quantity ?? 0;
  const availClass = AVAIL_CLASS[avail] || "avail-green";
  const priceFormatted = data.price?.toLocaleString("ro-RO");

  return (
    <div className="card-item">
      <div className="card-v2">
        <div className="card-v2-wrapper">
          <Link to={`/product/${data._id}`} className="card-v2-link">
            <div className="card-v2-thumb-inner">
              <img
                src={require("../../../Assets/images/panda.png")}
                alt={`${data.brand} ${data.model}`}
              />
              {avail && (
                <span className={`card-avail-badge ${availClass}`}>{avail}</span>
              )}
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
                {data.memorieInterna && (
                  <span className="card-memory-chip">{data.memorieInterna}</span>
                )}
              </div>

              <h2 className="card-v2-title-wrapper">{data.model}</h2>

              <p className="card-v2-desc">{data.description}</p>

              <div className="card-v2-rating">
                <SingleCardRating data={data} />
              </div>

              <div className="card-estimate-placeholder">
                <span className="card-stock">
                  {qty === 1 && (
                    <span className="danger-stock">Ultimul produs în stoc</span>
                  )}
                  {qty > 1 && qty <= 3 && (
                    <span className="danger-stock">Ultimele {qty} produse</span>
                  )}
                </span>
              </div>
            </div>
          </Link>

          <div className="card-v2-content">
            <div className="card-v2-price">
              <p className="product-new-price">
                {priceFormatted}
                <span className="price-currency">RON</span>
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
