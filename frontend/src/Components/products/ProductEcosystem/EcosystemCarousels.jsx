import { useParams } from "react-router-dom";
import { useGetEcosystemQuery, useGetProductsQuery } from "../../../features/product/rtkProducts";
import { CATEGORY_SLUG_TO_KIND, TIP_SLUG_TO_TIP } from "../../../utils/categorySlugMap";
import ProductCarousel from "../../UI/ProductCarousel";

const EMPTY = [];

const base = (kind, tips) => ({
  sort: "Newest", limit: 8, page: 1,
  brand: EMPTY, rating: EMPTY, model: EMPTY,
  availability: EMPTY, stocare: EMPTY, ram: EMPTY, culoare: EMPTY,
  kind, tips,
});

const EcosystemCarousels = () => {
  const { categorySlug, tipSlug } = useParams();
  const kind = CATEGORY_SLUG_TO_KIND[categorySlug] || "";
  const tip  = TIP_SLUG_TO_TIP[tipSlug]            || "";

  const { data: eco } = useGetEcosystemQuery(tip, { skip: !tip });

  const criticalTips    = eco?.data?.critical?.map((i) => i.label)    ?? EMPTY;
  const recommendedTips = eco?.data?.recommended?.map((i) => i.label) ?? EMPTY;

  const { data: criticalData,    isLoading: criticalLoading    } = useGetProductsQuery(base(kind, criticalTips),    { skip: !criticalTips.length });
  const { data: recommendedData, isLoading: recommendedLoading } = useGetProductsQuery(base(kind, recommendedTips), { skip: !recommendedTips.length });

  const criticalProducts    = criticalData?.queryProducts    ?? EMPTY;
  const recommendedProducts = recommendedData?.queryProducts ?? EMPTY;

  if (!tip) return null;
  if (!criticalLoading && !recommendedLoading && !criticalProducts.length && !recommendedProducts.length) return null;

  return (
    <div className="ecosystem-carousels">
      <ProductCarousel
        title="Esențiale pentru acest produs"
        linkTo={`/products/${categorySlug}`}
        data={criticalProducts}
        isLoading={criticalLoading}
      />
      <ProductCarousel
        title="Recomandate împreună"
        linkTo={`/products/${categorySlug}`}
        data={recommendedProducts}
        isLoading={recommendedLoading}
      />
    </div>
  );
};

export default EcosystemCarousels;
