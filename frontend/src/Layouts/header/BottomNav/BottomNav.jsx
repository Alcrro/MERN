import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeIcon, GridIcon, SearchIcon, CartIcon, UserIcon } from "../icons";
import Avatar from "../../../Components/atoms/Avatar";
import "./BottomNav.css";

const BottomNav = ({ onOpenMenu, searchActive, onToggleSearch }) => {
  const { pathname } = useLocation();
  const user      = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.addToCart.cartTotalQuantity);

  return (
    <nav className="mob-bottom-nav">
      <Link to="/" className={`mob-bot-item${pathname === "/" ? " mob-bot-item--active" : ""}`}>
        <HomeIcon /><span>Acasă</span>
      </Link>

      <button className="mob-bot-item" onClick={onOpenMenu}>
        <GridIcon /><span>Categorii</span>
      </button>

      <button className={`mob-bot-item${searchActive ? " mob-bot-item--active" : ""}`} onClick={onToggleSearch}>
        <SearchIcon /><span>Caută</span>
      </button>

      <Link to="/cart" className={`mob-bot-item${pathname === "/cart" ? " mob-bot-item--active" : ""}`}>
        <span className="mob-bot-cart-wrap">
          <CartIcon />
          {cartCount > 0 && <span className="mob-bot-badge">{cartCount}</span>}
        </span>
        <span>Coș</span>
      </Link>

      <Link
        to={user ? "/profile" : "/auth/login"}
        className={`mob-bot-item${pathname.startsWith("/profile") || pathname.startsWith("/auth") ? " mob-bot-item--active" : ""}`}
      >
        {user ? <Avatar src={user.avatar} name={user.name} size="sm" /> : <UserIcon />}
        <span>{user ? user.name.split(" ")[0] : "Cont"}</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
