import FilterSection from "../filterSection/FilterSection";
import { getUniqueValues, countByField } from "../filterUtils";

const ModelCategory = ({ contextProducts = [], model, setModel, brand, setPage, setRating }) => {
  const items = getUniqueValues(contextProducts, "model").filter(Boolean).sort((a, b) => a.localeCompare(b));

  const handleToggle = (value, isChecked) => {
    if (isChecked) {
      setModel([...model, value]);
      setPage(1);
      setRating([]);
    } else {
      setModel(model.filter((m) => m !== value));
    }
  };

  return (
    <FilterSection
      title="Model"
      items={items}
      selected={model}
      onToggle={handleToggle}
      getCount={(value) => countByField(contextProducts, "model", value)}
    />
  );
};

export default ModelCategory;
