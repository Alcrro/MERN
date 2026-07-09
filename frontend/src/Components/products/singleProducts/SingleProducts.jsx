import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetSingleProductQuery, useGetReviewsQuery } from "../../../features/product/rtkProducts";
import { addToCart } from "../../../features/product/addToCart/addToCartSlice";
import { useScrollSpy } from "./useScrollSpy";
import { TAB_KEYS, TAB_LABELS } from "./singleProductConstants";
import { getSpecs } from "./singleProductUtils";
import SingleProductSkeleton from "./SingleProductSkeleton";
import ProductNotFound from "./ProductNotFound";
import ProductHero from "./ProductHero";
import ProductReviews from "./ProductReviews";
import Section from "./Section";
import "./singleProduct.css";

const SingleProducts = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const authUser = useSelector((s) => s.auth.user);
  const [added, setAdded] = useState(false);

  const { navRef, sectionRefs, activeTab, scrollTo } = useScrollSpy(TAB_KEYS);
  const { data: pd, isLoading: pLoad } = useGetSingleProductQuery(id);
  const { data: rd, isLoading: rLoad } = useGetReviewsQuery(id);

  const handleCart = () => {
    dispatch(addToCart({ data: pd.product }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  if (pLoad) return <SingleProductSkeleton />;
  if (!pd?.product) return <ProductNotFound />;

  const p           = pd.product;
  const productName = p.model || p.name || p.brand;
  const reviews     = rd?.reviews ?? [];
  const avg         = p.rating?.average ?? 0;
  const rcount      = p.rating?.count ?? 0;

  const tabLabel = (key) =>
    key === "recenzii" && rcount > 0 ? `${TAB_LABELS[key]} (${rcount})` : TAB_LABELS[key];

  return (
    <div className="sp-page">
      <nav className="sp-bc">
        <Link to="/">Acasă</Link><span>/</span>
        <Link to="/products">Produse</Link><span>/</span>
        <Link to={`/products?brand=${p.brand}`}>{p.brand}</Link><span>/</span>
        <span className="sp-bc-cur">{productName}</span>
      </nav>

      <ProductHero p={p} productName={productName} added={added}
        onAddToCart={handleCart} onScrollToReviews={() => scrollTo("recenzii")} />

      <nav className="sp-tabs-bar" ref={navRef}>
        <div className="sp-tabs-inner">
          {TAB_KEYS.map((key) => (
            <button key={key} className={`sp-tab${activeTab === key ? " sp-tab--active" : ""}`}
              onClick={() => scrollTo(key)}>{tabLabel(key)}</button>
          ))}
        </div>
      </nav>

      <div className="sp-sections">
        <Section id="descriere" sectionRef={sectionRefs.descriere} collapsedH={120}>
          <h2 className="sp-sec-title">Descriere</h2>
          <p className="sp-desc">{p.description || `${p.brand} ${productName} — produs de calitate superioară.`}</p>
        </Section>

        <Section id="specificatii" sectionRef={sectionRefs.specificatii} collapsedH={220}>
          <h2 className="sp-sec-title">Specificații tehnice</h2>
          <div className="sp-specs-grid">
            {getSpecs(p).map(({ label, value, icon }) => (
              <div key={label} className="sp-spec-card">
                <span className="sp-spec-icon">{icon}</span>
                <span className="sp-spec-label">{label}</span>
                <span className="sp-spec-value">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="howto" sectionRef={sectionRefs.howto} collapsedH={180}>
          <h2 className="sp-sec-title">Cum se folosește</h2>
          {p.howto?.length > 0 ? (
            <div className="sp-howto-grid">
              {p.howto.map((step, i) => (
                <div key={i} className="sp-howto-card">
                  <span className="sp-howto-num">{i + 1}</span>
                  <div>
                    <strong className="sp-howto-t">{step.title}</strong>
                    <p className="sp-howto-b">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="sp-no-rev">Instrucțiunile de utilizare vor fi disponibile în curând.</p>
          )}
        </Section>

        <Section id="recenzii" sectionRef={sectionRefs.recenzii} collapsedH={320}>
          <ProductReviews reviews={reviews} isLoading={rLoad} authUser={authUser}
            productId={id} avg={avg} rcount={rcount} />
        </Section>
      </div>
    </div>
  );
};

export default SingleProducts;
