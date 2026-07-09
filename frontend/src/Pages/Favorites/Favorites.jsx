import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearFavorites } from "../../features/favorites/favoritesSlice";
import Cards from "../../Components/products/cards/Cards";
import "./Favorites.css";

const HeartIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const Favorites = () => {
  const dispatch = useDispatch();
  const items    = useSelector((s) => s.favorites.items);

  if (items.length === 0) {
    return (
      <div className="fav-empty">
        <span className="fav-empty__icon"><HeartIcon /></span>
        <h1 className="fav-empty__title">Nicio dorință salvată</h1>
        <p className="fav-empty__sub">
          Apasă inima de pe orice produs pentru a-l salva aici.
        </p>
        <Link to="/products" className="fav-empty__btn">Explorează produsele</Link>
      </div>
    );
  }

  return (
    <div className="fav-page">
      <div className="fav-header">
        <div>
          <h1 className="fav-header__title">Favorite</h1>
          <span className="fav-header__count">
            {items.length} {items.length === 1 ? "produs salvat" : "produse salvate"}
          </span>
        </div>
        <button className="fav-clear-btn" onClick={() => dispatch(clearFavorites())}>
          <TrashIcon /> Șterge tot
        </button>
      </div>

      <div className="fav-grid card-collection card-v2-grid">
        {items.map((product) => (
          <Cards key={product._id} products={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
