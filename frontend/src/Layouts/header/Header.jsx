import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import "../header/header.css";
import { toast } from "react-toastify";
import AddToCartModal from "../../Components/UI/add-to-cart-modal/AddToCartModal";
import { useGetCategoriesQuery } from "../../features/product/rtkProducts";

/* ── Icons ────────────────────────────────────────────────── */
const SearchIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const CartIcon     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const HomeIcon     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GridIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const UserIcon     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MenuIcon     = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ChevronIcon  = ({ open }) => <svg className={`chevron${open ? " open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const LogoutIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const HeartIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;

const PROMO_LINKS = [
  { label: "Oferte zilnice", to: "/products?availability=Promotii", accent: "#ef4444" },
  { label: "Noutăți",        to: "/products?availability=Nou" },
  { label: "Resigilate",     to: "/products?availability=Resigilat" },
  { label: "Top vânzări",    to: "/products?sort=-rating" },
  { label: "Clearance",      to: "/products?sort=price" },
];

const ROLE_LABEL = { client: "Cumpărător", vendor: "Vânzător", admin: "Administrator" };

/* ── Mobile Drawer ────────────────────────────────────────── */
const MobileDrawer = ({ open, onClose, user, onLogout, categories }) => {
  const [catOpen, setCatOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);

  const close = () => { onClose(); setCatOpen(false); setExpandedCat(null); };

  return (
    <>
      {open && <div className="mob-backdrop" onClick={close} />}
      <div className={`mob-drawer${open ? " mob-drawer--open" : ""}`}>

        {/* drawer header */}
        <div className="mob-drawer__head">
          <Link to="/" className="brand-logo" onClick={close}>alcrro</Link>
          <button className="mob-drawer__close" onClick={close}><CloseIcon /></button>
        </div>

        <div className="mob-drawer__body">
          {/* user block */}
          {user ? (
            <div className="mob-user-block">
              <div className="mob-avatar">{user.name[0].toUpperCase()}</div>
              <div>
                <p className="mob-user-name">{user.name}</p>
                <span className={`role-badge role-${user.role}`}>{ROLE_LABEL[user.role] || user.role}</span>
              </div>
            </div>
          ) : (
            <div className="mob-auth-block">
              <Link to="/auth/login"    className="btn-register mob-auth-btn" onClick={close}>Intră în cont</Link>
              <Link to="/auth/register" className="btn-login mob-auth-btn"    onClick={close}>Înregistrare</Link>
            </div>
          )}

          <div className="mob-divider" />

          {/* categories accordion */}
          <button className="mob-section-btn" onClick={() => setCatOpen(p => !p)}>
            <GridIcon />
            <span>Categorii</span>
            <span className={`mob-chevron${catOpen ? " mob-chevron--open" : ""}`}><ChevronIcon open={catOpen} /></span>
          </button>

          {catOpen && (
            <div className="mob-cat-list">
              {categories.map(cat => (
                <div key={cat._id} className="mob-cat-item">
                  <button
                    className="mob-cat-row"
                    onClick={() => setExpandedCat(expandedCat === cat._id ? null : cat._id)}
                  >
                    <span>{cat.icon} {cat.label}</span>
                    <span className={`mob-chevron${expandedCat === cat._id ? " mob-chevron--open" : ""}`}><ChevronRight /></span>
                  </button>
                  {expandedCat === cat._id && (
                    <div className="mob-sub-list">
                      {cat.sub?.map(sub => (
                        <Link
                          key={sub.label}
                          to={sub.tip ? `/products?kind=${cat.kind}&tip=${encodeURIComponent(sub.tip)}` : `/products?kind=${sub.kind || cat.kind || ""}`}
                          className="mob-sub-link"
                          onClick={close}
                        >
                          {sub.icon} {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mob-divider" />

          {/* promo links */}
          {PROMO_LINKS.map(({ label, to, accent }) => (
            <Link key={label} to={to} className="mob-nav-link" style={accent ? { color: accent } : undefined} onClick={close}>
              {label}
            </Link>
          ))}

          <div className="mob-divider" />

          {/* user links */}
          {user && (
            <>
              <Link to="/profile"         className="mob-nav-link" onClick={close}>👤 Profilul meu</Link>
              <Link to="/profile/orders"  className="mob-nav-link" onClick={close}>📦 Comenzile mele</Link>
              <Link to="/favorites"       className="mob-nav-link" onClick={close}>❤️ Favorite</Link>
              {(user.role === "admin" || user.role === "vendor") && (
                <Link to="/add/product"   className="mob-nav-link" onClick={close}>➕ Adaugă produs</Link>
              )}
              <button className="mob-logout-btn" onClick={() => { onLogout(); close(); }}>
                <LogoutIcon /> Deconectare
              </button>
            </>
          )}

          <Link to="/about" className="mob-nav-link" onClick={close}>ℹ️ Despre noi</Link>
        </div>
      </div>
    </>
  );
};

/* ── Header ───────────────────────────────────────────────── */
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { user }     = useSelector((state) => state.auth);
  const cartCount    = useSelector((state) => state.addToCart.cartTotalQuantity);
  const favCount     = useSelector((state) => state.favorites.items.length);
  const { data }     = useGetCategoriesQuery();
  const categories   = data?.categories ?? [];

  const [searchQuery,  setSearchQuery]  = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    toast.success("Ai fost delogat cu succes");
    setDropdownOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearch(false);
    }
  };

  return (
    <>
      <header className="main-header">
        {/* Announcement bar */}
        <div className="announcement-bar">
          <span className="ann-left">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            Livrare gratuită la comenzi peste 500 RON
          </span>
          <span className="ann-right">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-5-5 19.79 19.79 0 01-3.07-8.67A2 2 0 015.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9a16 16 0 006.29 6.29l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Suport 24/7: 0800 123 456
          </span>
        </div>

        {/* Main header row */}
        <div className="header-inner">
          {/* Hamburger — mobile only */}
          <button className="mob-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Meniu">
            <MenuIcon />
          </button>

          <Link to="/" className="brand-logo">alcrro</Link>

          {/* Search — hidden on mobile unless toggled */}
          <form className={`search-bar${mobileSearch ? " search-bar--mobile-open" : ""}`} onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Caută smartphone, brand sau model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={mobileSearch}
            />
            <button type="submit" className="search-btn" aria-label="Caută">
              <SearchIcon />
            </button>
          </form>

          <div className="header-actions">
            {/* Mobile search toggle */}
            <button className="mob-search-btn" onClick={() => setMobileSearch(p => !p)} aria-label="Caută">
              <SearchIcon />
            </button>

            {/* Favorites — desktop only */}
            <Link to="/favorites" className="fav-btn hide-mobile" aria-label="Favorite">
              <div className="fav-icon-wrap">
                <HeartIcon />
                {favCount > 0 && <span className="fav-badge">{favCount}</span>}
              </div>
              <span className="cart-label">Favorite</span>
            </Link>

            {/* Cart */}
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

            {/* User — desktop only */}
            {user ? (
              <div className="user-menu hide-mobile">
                <button className="avatar-btn" onClick={() => setDropdownOpen((p) => !p)}>
                  <span className="avatar-circle">{user.name[0].toUpperCase()}</span>
                  <span className="avatar-name">{user.name.split(" ")[0]}</span>
                  <ChevronIcon open={dropdownOpen} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <span className="avatar-circle">{user.name[0].toUpperCase()}</span>
                        <div>
                          <p className="dropdown-name">{user.name}</p>
                          <span className={`role-badge role-${user.role}`}>{user.role}</span>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <ul className="dropdown-links">
                        <li><Link to="/profile"        onClick={() => setDropdownOpen(false)}>Profilul meu</Link></li>
                        <li><Link to="/profile/orders" onClick={() => setDropdownOpen(false)}>Comenzile mele</Link></li>
                        {user.role === "admin" && (
                          <li><a href="/admin/adauga-categorii" onClick={() => setDropdownOpen(false)}>Categorii</a></li>
                        )}
                        {(user.role === "admin" || user.role === "vendor") && (
                          <li><Link to="/add/product" onClick={() => setDropdownOpen(false)}>Adaugă produs</Link></li>
                        )}
                      </ul>
                      <div className="dropdown-divider" />
                      <button className="dropdown-logout" onClick={onLogout}>
                        <LogoutIcon /> Deconectare
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="auth-actions hide-mobile">
                <Link to="/auth/login"    className="btn-login">Intră în cont</Link>
                <Link to="/auth/register" className="btn-register">Înregistrare</Link>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* Mobile search bar — fix deasupra bottom nav, în afara header-ului */}
      <form className={`mob-search-bar${mobileSearch ? " mob-search-bar--visible" : ""}`} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Caută smartphone, brand sau model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus={mobileSearch}
        />
        <button type="submit"><SearchIcon /></button>
        <button type="button" className="mob-search-close" onClick={() => setMobileSearch(false)}><CloseIcon /></button>
      </form>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={onLogout}
        categories={categories}
      />

      {/* Bottom nav — mobile only */}
      <nav className="mob-bottom-nav">
        <Link to="/" className={`mob-bot-item${pathname === "/" ? " mob-bot-item--active" : ""}`}>
          <HomeIcon /><span>Acasă</span>
        </Link>

        <button className="mob-bot-item" onClick={() => setMenuOpen(true)}>
          <GridIcon /><span>Categorii</span>
        </button>

        <button className={`mob-bot-item${mobileSearch ? " mob-bot-item--active" : ""}`} onClick={() => setMobileSearch(p => !p)}>
          <SearchIcon /><span>Caută</span>
        </button>

        <Link to="/cart" className={`mob-bot-item${pathname === "/cart" ? " mob-bot-item--active" : ""}`}>
          <span className="mob-bot-cart-wrap">
            <CartIcon />
            {cartCount > 0 && <span className="mob-bot-badge">{cartCount}</span>}
          </span>
          <span>Coș</span>
        </Link>

        <Link to={user ? "/profile" : "/auth/login"} className={`mob-bot-item${pathname.startsWith("/profile") || pathname.startsWith("/auth") ? " mob-bot-item--active" : ""}`}>
          {user
            ? <span className="mob-bot-avatar">{user.name[0].toUpperCase()}</span>
            : <UserIcon />}
          <span>{user ? user.name.split(" ")[0] : "Cont"}</span>
        </Link>
      </nav>
    </>
  );
};

export default Header;
