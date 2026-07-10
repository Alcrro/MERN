import { useGetAllProductsQuery } from "../../../../features/product/rtkProducts";
import { getUniqueValues, countByField } from "../../category/filterUtils";

const BrandFilterPanel = () => {
  const { data } = useGetAllProductsQuery();
  const allProducts = data?.totalProducts ?? [];
  const brands = getUniqueValues(allProducts, "brand").sort();

  return (
    <div>
      <a href="#" className="filter-head">
        <span>Brand</span>
      </a>
      <div className="collapse out">
        <div className="filter-body scrollable">
          {brands.map((brand) => (
            <div className="filter-inner" key={brand}>
              <input type="checkbox" id={brand} value={brand} />
              <label htmlFor={brand}>{brand}</label>
              <div className="star-brand-text">
                <span>({countByField(allProducts, "brand", brand)})</span>
              </div>
            </div>
          ))}
        </div>
        <div className="filter-body">
          <div className="filter-body-separator" />
        </div>
      </div>
    </div>
  );
};

export default BrandFilterPanel;
