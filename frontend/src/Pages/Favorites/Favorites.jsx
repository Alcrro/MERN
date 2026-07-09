import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearFavorites } from "../../features/favorites/favoritesSlice";
import Cards from "../../Components/products/cards/Cards";
import { HeartIcon, TrashIcon } from "./favoritesIcons";
import "./Favorites.css";

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
