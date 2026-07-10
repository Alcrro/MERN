import BrandFilterPanel from "../../Components/UI/sideBarFilters/brandFilterPanel/BrandFilterPanel";
import { useGetAllProductsQuery } from "../../features/product/rtkProducts";
import { getUniqueValues } from "../../Components/UI/category/filterUtils";

const EXCLUDE_COLUMNS = ["_id", "description", "createdAt", "__v", "slug"];

const Products = () => {
  const { data: apiProducts } = useGetAllProductsQuery();
  const allProducts = apiProducts?.totalProducts ?? [];

  const columns = getUniqueValues(allProducts, null).length
    ? [...new Set(allProducts.flatMap(item => Object.keys(item).filter(k => !EXCLUDE_COLUMNS.includes(k))))]
    : [];

  return (
    <div>
      <BrandFilterPanel products={allProducts} columns={columns} />
    </div>
  );
};

export default Products;
