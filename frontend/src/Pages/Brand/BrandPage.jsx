import { useParams, Navigate, Link } from "react-router-dom";
import { useGetProductsQuery } from "../../features/product/rtkProducts";
import { useSeo } from "../../hooks/useSeo";
import ProductCarousel from "../../Components/UI/ProductCarousel/ProductCarousel";
import { BRANDS } from "./brandData";
import "./BrandPage.css";

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const BrandHero = ({ brand, totalCount }) => (
  <div
    className="brand-hero"
    style={{
      "--brand-accent":       brand.accent,
      "--brand-accent-light": brand.accentLight,
    }}
  >
    <div className="brand-hero__content">
      <div className="brand-hero__badge">Brand oficial</div>
      <h1 className="brand-hero__name">{brand.name}</h1>
      <p className="brand-hero__tagline">{brand.tagline}</p>
      <p className="brand-hero__desc">{brand.description}</p>
      <div className="brand-hero__meta">
        {totalCount > 0 && (
          <span className="brand-hero__count">
            <strong>{totalCount}</strong> produse disponibile
          </span>
        )}
        <Link to="/products" className="brand-hero__cta">
          Toate produsele <ArrowRight />
        </Link>
      </div>
    </div>
    <div className="brand-hero__glyph" aria-hidden>{brand.name[0]}</div>
  </div>
);

const BrandPageInner = ({ slug }) => {
  const brand = BRANDS[slug];

  const { data: newest,   isLoading: loadingNewest }   = useGetProductsQuery({ limit: 10, page: 1, sort: "Newest",               brand: [brand.name], rating: [], model: [], availability: [], stocare: [], ram: [] });
  const { data: topRated, isLoading: loadingTopRated } = useGetProductsQuery({ limit: 10, page: 1, sort: "Rating: High to Low",  brand: [brand.name], rating: [], model: [], availability: [], stocare: [], ram: [] });

  const totalCount = newest?.totalProductsNumberQuery ?? 0;

  useSeo({
    title:       `Telefoane ${brand.name}`,
    description: `${brand.tagline} ${brand.description}`,
    path:        `/products/${slug}`,
  });

  return (
    <div className="brand-page">
      <BrandHero brand={brand} totalCount={totalCount} />

      <div className="brand-products">
        <div className="brand-carousel-wrap">
          <ProductCarousel
            title={`Cele mai noi ${brand.name}`}
            linkTo="/products"
            data={newest?.queryProducts}
            isLoading={loadingNewest}
          />
        </div>
        <div className="brand-carousel-wrap">
          <ProductCarousel
            title={`Top vânzări ${brand.name}`}
            linkTo="/products"
            data={topRated?.queryProducts}
            isLoading={loadingTopRated}
          />
        </div>
      </div>
    </div>
  );
};

const BrandPage = () => {
  const { brand: slug } = useParams();
  const normalized = slug?.toLowerCase();
  if (!BRANDS[normalized]) return <Navigate to="/products" replace />;
  return <BrandPageInner key={normalized} slug={normalized} />;
};

export default BrandPage;
