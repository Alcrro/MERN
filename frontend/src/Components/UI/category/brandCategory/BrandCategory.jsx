import React, { useState } from "react";
import "../allCategories/allCategories.css";
import { Link, Navigate, useLocation } from "react-router-dom";

const BrandCategory = ({
  data,
  brand,
  setBrand,
  checked,
  setChecked,
  setPage,
  setRating,
  model,
  limit,
  setLimit,
}) => {
  const dataQuery = data?.queryProducts;
  const dataAllProducts = data?.totalProducts;

  const [open, setOpen] = useState(true);

  // display unique brands
  let brandsArray = [];
  dataAllProducts?.map((item) => brandsArray.push(item.brand));
  let uniqueBrandsArray = brandsArray.filter((item, index) => brandsArray.indexOf(item) === index);

  // display filtered brands
  let brandsFilteredArray = [];
  dataQuery?.map((item) => brandsFilteredArray.push(item.brand));
  let filteredBrandsArray = brandsFilteredArray.filter(
    (item, index) => brandsFilteredArray.indexOf(item) === index
  );

  const checkHandler = (e) => {
    if (e.target.checked === true) {
      setBrand(e.target.value);
      setChecked(true);
      const array = [...brand];
      array.push(e.target.value);
      setBrand(array);
      setPage(1);
      setRating([]);
    }
    if (e.target.checked === false) {
      setBrand("");
      setChecked(false);
      const array = [...brand];
      const index = array.indexOf(e.target.value);
      array.splice(index, 1);
      setBrand(array);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="brand-v2-container">
      <a href="#" className="filter-head" onClick={handleOpen}>
        <span>Brand</span>
      </a>
      {open ? (
        <div className={`collapse out`}>
          <div className={`filter-body scrollable`}>
            {model.length === 0
              ? uniqueBrandsArray
                  ?.sort((a, b) => b.value - a.value)
                  .map((item, index) => {
                    return (
                      <div className="filter-inner" key={index}>
                        <input
                          type="checkbox"
                          id={item}
                          value={item}
                          className="bineMas"
                          onChange={checkHandler}
                        />

                        <label htmlFor={item}>{item}</label>

                        <div className="star-brand-text">
                          <span>
                            (
                            {
                              dataAllProducts
                                ?.map((item) => {
                                  return item;
                                })
                                .filter((filter) => filter.brand === item).length
                            }
                            )
                          </span>
                        </div>
                      </div>
                    );
                  })
              : filteredBrandsArray
                  ?.sort((a, b) => a.value - b.value)
                  .map((item, index) => {
                    return (
                      <div className="filter-inner" key={index}>
                        <input
                          type="checkbox"
                          id={item}
                          value={item}
                          className={brand === item ? "checked" : "unchecked"}
                          onChange={checkHandler}
                        />
                        <label htmlFor={item}>{item}</label>
                        <div className="star-brand-text">
                          <span>
                            (
                            {
                              dataAllProducts
                                ?.map((item) => {
                                  return item;
                                })
                                .filter((filter) => filter.brand === item).length
                            }
                            )
                          </span>
                        </div>
                      </div>
                    );
                  })}
          </div>
          <div className="filter-body">
            <div className="filter-body-separator"></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BrandCategory;
