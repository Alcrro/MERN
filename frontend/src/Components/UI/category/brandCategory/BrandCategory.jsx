import FilterSection from "../filterSection/FilterSection";
import { getUniqueValues, countByField } from "../filterUtils";

const BrandCategory = ({ data, brand, setBrand, model, setPage, setRating }) => {
  const allProducts = data?.totalProducts;
  const queryProducts = data?.queryProducts;

  const source = model.length === 0 ? allProducts : queryProducts;
  const items = getUniqueValues(source, "brand").sort();

  const handleToggle = (value, isChecked) => {
    if (isChecked) {
      setBrand([...brand, value]);
      setPage(1);
      setRating([]);
    } else {
      setBrand(brand.filter(b => b !== value));
    }
  };

  return (
    <FilterSection
      title="Brand"
      items={items}
      selected={brand}
      onToggle={handleToggle}
      getCount={(value) => countByField(allProducts, "brand", value)}
    />
  );
};

export default BrandCategory;
