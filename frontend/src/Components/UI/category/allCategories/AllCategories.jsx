import React from "react";
import BrandCategory from "../brandCategory/BrandCategory";
import ModelCategory from "../modelCategory/ModelCategory";

const AllCategories = ({
  data,
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
        data={data}
        brand={brand}
        setBrand={setBrand}
        model={model}
        setPage={setPage}
        setRating={setRating}
      />
    )}
    <ModelCategory
      data={data}
      model={model}
      setModel={setModel}
      brand={brand}
      setPage={setPage}
      setRating={setRating}
    />
  </>
);

export default AllCategories;
