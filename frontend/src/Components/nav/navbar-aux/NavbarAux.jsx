import { Link, useLocation } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../features/product/rtkProducts";
import { PROMO_LINKS } from "../../../Utils/constants";
import CategoryDropdown from "./CategoryDropdown";
import "./navbarAux.css";

const NavbarAux = () => {
  const { pathname } = useLocation();
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.categories ?? [];

  return (
    <nav className="category-nav">
      <div className="category-nav-inner">
        <CategoryDropdown categories={categories} isLoading={isLoading} isActive={pathname === "/products"} />
        {PROMO_LINKS.map(({ label, to, accent }) => (
          <Link key={label} to={to} className="cat-link cat-promo"
            style={accent ? { color: accent } : undefined}>
            {label}
          </Link>
        ))}
        <span className="cat-sep" />
        <Link to="/about" className="cat-link cat-help">Ajutor</Link>
      </div>
    </nav>
  );
};

export default NavbarAux;
