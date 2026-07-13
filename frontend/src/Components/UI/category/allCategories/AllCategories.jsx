import BrandCategory from "../brandCategory/BrandCategory";
import ModelCategory from "../modelCategory/ModelCategory";
import { useFilters } from "../../../products/products/FilterContext";

const AllCategories = ({ hideBrand = false }) => {
  const { brand, setBrand, model, setModel, brandContext = [], modelContext = [], setPage, setRating } = useFilters();
  return (
  <>
    {!hideBrand && (
      <BrandCategory
        contextProducts={brandContext}
        brand={brand}
        setBrand={setBrand}
        setPage={setPage}
        setRating={setRating}
      />
    )}
    <ModelCategory
      contextProducts={modelContext}
      model={model}
      setModel={setModel}
      brand={brand}
      setPage={setPage}
      setRating={setRating}
    />
  </>
  );
};

export default AllCategories;
