import FilterSection from "../filterSection/FilterSection";
import { getUniqueValues, countByField } from "../filterUtils";

const ModelCategory = ({ data, model, setModel, brand, setPage, setRating }) => {
  const allProducts = data?.totalProducts;
  const queryProducts = data?.queryProducts;

  const source = brand.length === 0 ? allProducts : queryProducts;
  const items = getUniqueValues(source, "model").sort((a, b) => a.localeCompare(b));

  const handleToggle = (value, isChecked) => {
    if (isChecked) {
      setModel([...model, value]);
      setPage(1);
      setRating([]);
    } else {
      setModel(model.filter(m => m !== value));
    }
  };

  return (
    <FilterSection
      title="Model"
      items={items}
      selected={model}
      onToggle={handleToggle}
      getCount={(value) => countByField(allProducts, "model", value)}
    />
  );
};

export default ModelCategory;
