import React, { useState } from "react";
import {
  useGetAllProductsQuery,
  useGetProductsQuery,
} from "../../../../features/product/rtkProducts";
import "./sideBarFiltersRating.css";

const SideBarFilters = ({ rating, setRating, queryProduct, brand, setLimit }) => {
  const { data: allProductsData } = useGetAllProductsQuery();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("active");

  // method 2
  const rateArray = ["5", "4", "3", "2", "1"];

  const handleOpen = () => {
    setOpen(!open);
    setActive(open ? "active" : "");
  };

  const checkInput = (e) => {
    if (e.target.checked === true) {
      setRating(e.target.value);
      const array = [...rating];
      array.push(e.target.value);
      setRating(array);
      // console.log(array);
    }
    if (e.target.checked === false) {
      setRating("");
      const array = [...rating];
      const index = array.indexOf(e.target.value);
      array.splice(index, 1);
      setRating(array);
    }
  };
  // console.log(brand);

  return (
    <div className="sidebar-filter-rating">
      <div className={`sidebar-filter-rating-title ${active}`}>
        <a href="#" className="filter-head" onClick={handleOpen}>
          <span>Rating</span>
        </a>
      </div>
      <div className={`sidebar-filter-rating-body ${active}`}>
        <div className="sidebar-filter-rating-stars">
          <form className="form-rating">
            {rateArray.map((item, key) => (
              <div className={`rated-${item}`} key={key}>
                <input
                  type="checkbox"
                  className="stars"
                  name="stars"
                  id={item}
                  value={item}
                  onChange={checkInput}
                />
                <label htmlFor={item}>
                  <div className="star-rating-container">
                    <div className={`star-rating star-rating-read rated-${item}`}>
                      <div className="star-rating-inner"></div>
                    </div>
                  </div>
                </label>
                <div className="star-rating-text">
                  <span>
                    (
                    {
                      queryProduct
                        ?.map((item) => {
                          return item;
                        })
                        .filter((filter) => filter.rating === item).length
                    }
                    )
                  </span>
                </div>
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SideBarFilters;
