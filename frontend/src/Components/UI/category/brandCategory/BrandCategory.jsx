import FilterSection from "../filterSection/FilterSection";
import { getUniqueValues, countByField } from "../filterUtils";

const BrandCategory = ({ contextProducts = [], brand, setBrand, setPage, setRating }) => {
  const items = getUniqueValues(contextProducts, "brand").sort();

  const handleToggle = (value, isChecked) => {
    if (isChecked) {
      setBrand([...brand, value]);
      setPage(1);
      setRating([]);
    } else {
      setBrand(brand.filter((b) => b !== value));
    }
  };

  return (
    <FilterSection
      title="Brand"
      items={items}
      selected={brand}
      onToggle={handleToggle}
      getCount={(value) => countByField(contextProducts, "brand", value)}
    />
  );
};

export default BrandCategory;
