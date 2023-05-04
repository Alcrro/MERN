import React from "react";
import "./testFilter.css";
import {
  useGetAllProductsQuery,
  useGetProductsQuery,
} from "../../../../features/product/rtkProducts";

const TestFilter = () => {
  // console.log(props.products);
  const { data: allProductsData } = useGetAllProductsQuery();
  // console.log(allProductsData);

  // create an array of brands names
  let namesArray = [];
  allProductsData?.totalProducts.map((item) => namesArray.push(item.brand));
  let uniqueNamesArray = namesArray.filter((item, index) => namesArray.indexOf(item) === index);
  // console.log(uniqueNamesArray);

  return (
    <div className="">
      <a href="#" className="filter-head">
        <span></span>
      </a>
      <div className="collapse out">
        <div className="filter-body scrollable">
          {uniqueNamesArray.map((item, index) => {
            return (
              <div className="filter-inner" key={index}>
                <input type="checkbox" id={item} value={item} />
                <label htmlFor={item}>{item}</label>
                <div className="star-brand-text">
                  <span>
                    (
                    {
                      allProductsData?.totalProducts
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
    </div>
  );
};

export default TestFilter;
