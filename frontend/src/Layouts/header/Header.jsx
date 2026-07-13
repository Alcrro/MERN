import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCategoriesQuery } from "../../features/product/rtkProducts";
import AddToCartModal from "../../Components/UI/add-to-cart-modal/AddToCartModal";
import AnnouncementBar from "./AnnouncementBar";
import SearchBar from "./SearchBar";
import MobileDrawer from "./MobileDrawer";
import UserMenu from "./UserMenu";
import BottomNav from "./BottomNav";
import { MenuIcon, SearchIcon, CartIcon, HeartIcon } from "./icons";
import { useLogout } from "./useLogout";
import "../header/header.css";

const Header = () => {
  const { user }    = useSelector((state) => state.auth);
  const cartCount   = useSelector((state) => state.addToCart.cartTotalQuantity);
  const favCount    = useSelector((state) => state.favorites.items.length);
  const { data }    = useGetCategoriesQuery();
  const categories  = data?.categories ?? [];

  const [menuOpen,     setMenuOpen]     = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const logout = useLogout();

  return (
    <>
      <header className="main-header">
        <AnnouncementBar />

        <div className="header-inner">
          <button className="mob-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Meniu">
            <MenuIcon />
          </button>

          <Link to="/" className="brand-logo">alcrro</Link>

          <SearchBar mobileOpen={mobileSearch} onCloseMobile={() => setMobileSearch(false)} />

          <div className="header-actions">
            <button className="mob-search-btn" onClick={() => setMobileSearch(p => !p)} aria-label="Caută">
              <SearchIcon />
            </button>

            <Link to="/favorites" className="fav-btn hide-mobile" aria-label="Favorite">
              <div className="fav-icon-wrap">
                <HeartIcon />
                {favCount > 0 && <span className="fav-badge">{favCount}</span>}
              </div>
              <span className="cart-label">Favorite</span>
            </Link>

            <div className="cart-wrapper">
              <Link to="/cart" className="cart-btn">
                <div className="cart-icon-wrap">
                  <CartIcon />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
                <span className="cart-label">Coș</span>
              </Link>
              <AddToCartModal />
            </div>

            <UserMenu user={user} onLogout={logout} />
          </div>
        </div>
      </header>

      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={logout}
        categories={categories}
      />

      <BottomNav
        onOpenMenu={() => setMenuOpen(true)}
        searchActive={mobileSearch}
        onToggleSearch={() => setMobileSearch(p => !p)}
      />
    </>
  );
};

export default Header;
