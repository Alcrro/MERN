import { Link } from "react-router-dom";
import { ArrowRight } from "../homeIcons";

const CatSkeleton = () => (
  <div className="cat-card cat-card--skeleton">
    <div className="cat-card__icon skeleton-pulse" />
    <div className="skeleton-line skeleton-pulse" style={{ width: "60%", height: 12, borderRadius: 4 }} />
  </div>
);

const CategoriesSection = ({ categories, isLoading }) => {
  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="home-section home-categories" aria-label="Categorii">
      <div className="section-header">
        <h2 className="section-title">Navighează după categorie</h2>
        <Link to="/products" className="section-link">Toate <ArrowRight /></Link>
      </div>
      <div className="cat-grid">
        {isLoading
          ? [...Array(6)].map((_, i) => <CatSkeleton key={i} />)
          : categories.map((cat) => (
            <Link key={cat._id} to={`/products?kind=${cat.kind}`} className="cat-card" aria-label={cat.label}>
              <span className="cat-card__icon">{cat.icon}</span>
              <span className="cat-card__label">{cat.label}</span>
              <span className="cat-card__arrow"><ArrowRight /></span>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
