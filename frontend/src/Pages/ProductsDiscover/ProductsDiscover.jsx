import { Link } from "react-router-dom";
import { useGetProductsQuery, useGetCategoriesQuery } from "../../features/product/rtkProducts";
import { KIND_TO_CATEGORY_SLUG } from "../../utils/categorySlugMap";
import ProductCarousel from "../../Components/UI/ProductCarousel";
import "./ProductsDiscover.css";

const EMPTY_ARR = [];

const q = (overrides) => ({
  sort: "Newest", limit: 8, page: 1,
  brand: EMPTY_ARR, rating: EMPTY_ARR, model: EMPTY_ARR,
  availability: EMPTY_ARR, stocare: EMPTY_ARR, ram: EMPTY_ARR, culoare: EMPTY_ARR,
  kind: "", tip: "",
  ...overrides,
});

const ProductsDiscover = () => {
  const { data: newestData }   = useGetProductsQuery(q({ sort: "Newest",              limit: 8 }));
  const { data: promoData }    = useGetProductsQuery(q({ availability: ["Promotii"],  limit: 8 }));
  const { data: topData }      = useGetProductsQuery(q({ sort: "Rating: High to Low", limit: 8 }));
  const { data: cats }         = useGetCategoriesQuery();

  const newest  = newestData?.queryProducts  ?? EMPTY_ARR;
  const promotii = promoData?.queryProducts  ?? EMPTY_ARR;
  const top     = topData?.queryProducts     ?? EMPTY_ARR;
  const categories = cats ?? EMPTY_ARR;

  return (
    <div className="discover-page">
      {categories.length > 0 && (
        <div className="discover-categories">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={cat.kind ? `/products/${KIND_TO_CATEGORY_SLUG[cat.kind] ?? ""}` : "/products"}
              className="discover-cat-chip"
            >
              <span className="discover-cat-chip-icon">{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      )}

      <ProductCarousel title="Noutăți"             linkTo="/products/all?sort=Newest"                  data={newest}   isLoading={!newestData} />
      <ProductCarousel title="Reduceri & Promoții" linkTo="/products/all?availability=Promotii"         data={promotii} isLoading={!promoData} />
      <ProductCarousel title="Cele mai apreciate"  linkTo="/products/all?sort=Rating%3A+High+to+Low"   data={top}      isLoading={!topData} />
    </div>
  );
};

export default ProductsDiscover;
