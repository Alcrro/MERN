import { useState } from "react";
import React from "react";
import "../allCategories/allCategories.css";

const ModelCategory = ({
  data,
  brand,
  setBrand,
  setModel,
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
  let modelsArray = [];
  dataAllProducts?.map((item) => modelsArray.push(item.model));
  let uniqueModelsArray = modelsArray.filter((item, index) => modelsArray.indexOf(item) === index);

  // display filtered brands
  let modelsFilteredArray = [];
  dataQuery?.map((item) => modelsFilteredArray.push(item.model));
  let filteredModelsArray = modelsFilteredArray.filter(
    (item, index) => modelsFilteredArray.indexOf(item) === index
  );

  const checkHandler = (e) => {
    if (e.target.checked === true) {
      setModel(e.target.value);
      setChecked(true);
      const array = [...model];
      array.push(e.target.value);
      setModel(array);
      setPage(1);
      setRating([]);
    }
    if (e.target.checked === false) {
      setModel("");
      setChecked(false);
      const array = [...model];
      const index = array.indexOf(e.target.value);
      array.splice(index, 1);
      setModel(array);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="model-v2-container">
      <a href="#" className="filter-head" onClick={handleOpen}>
        <span>Model</span>
      </a>
      {open ? (
        <div className="collapse out">
          <div className="filter-body scrollable">
            {brand.length === 0
              ? uniqueModelsArray
                  ?.sort((a, b) => {
                    return a.localeCompare(b);
                  })
                  .map((item, index) => {
                    return (
                      <div className="filter-inner" key={index}>
                        <input
                          type="checkbox"
                          id={item}
                          value={item}
                          className={model === item ? "checked" : "unchecked"}
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
                                .filter((filter) => filter.model === item).length
                            }
                            )
                          </span>
                        </div>
                      </div>
                    );
                  })
              : filteredModelsArray
                  ?.sort((a, b) => {
                    return a.localeCompare(b);
                  })
                  .map((item, index) => {
                    return (
                      <div className="filter-inner" key={index}>
                        <input
                          type="checkbox"
                          id={item}
                          value={item}
                          className={model === item ? "checked" : "unchecked"}
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
                                .filter((filter) => filter.model === item).length
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

export default ModelCategory;
