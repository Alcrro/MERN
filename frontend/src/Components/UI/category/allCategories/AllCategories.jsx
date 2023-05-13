import React from "react";
import BrandCategory from "../brandCategory/BrandCategory";
import ModelCategory from "../modelCategory/ModelCategory";
import RatingCategory from "../ratingCategory/RatingCategory";

const AllCategories = ({
  data,
  model,
  setModel,
  brand,
  setBrand,
  setPage,
  setLimit,
  checked,
  setChecked,
  setSort,
  rating,
  setRating,
}) => {
  return (
    <>
      <BrandCategory
        data={data}
        model={model}
        setModel={setModel}
        brand={brand}
        setBrand={setBrand}
        setPage={setPage}
        setLimit={setLimit}
        checked={checked}
        setChecked={setChecked}
        setSort={setSort}
        setRating={setRating}
      />
      <ModelCategory
        data={data}
        model={model}
        setModel={setModel}
        brand={brand}
        setBrand={setBrand}
        setPage={setPage}
        setLimit={setLimit}
        checked={checked}
        setChecked={setChecked}
        setSort={setSort}
        setRating={setRating}
      />
    </>
  );
};

export default AllCategories;
