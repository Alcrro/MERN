import React from "react";
import BrandCategory from "../brandCategory/BrandCategory";
import ModelCategory from "../modelCategory/ModelCategory";

const AllCategories = ({
  brandContext = [],
  modelContext = [],
  model,
  setModel,
  brand,
  setBrand,
  setPage,
  setRating,
  hideBrand = false,
}) => (
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

export default AllCategories;
