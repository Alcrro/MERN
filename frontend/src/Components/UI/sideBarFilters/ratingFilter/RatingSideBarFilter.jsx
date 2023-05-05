import React, { useState } from "react";
import {
  useGetAllProductsQuery,
  useGetProductsQuery,
} from "../../../../features/product/rtkProducts";
import "./sideBarFiltersRating.css";
import "../../../../Pages/Home/Home.css";
import { useNavigate } from "react-router-dom";

const SideBarFilters = ({ rating, setRating, queryProduct, brand, setLimit }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("active");
  console.log(queryProduct);

  const { data: allProductsData } = useGetAllProductsQuery();

  // method 2
  const rateObject = [
    {
      id: 1,
      style: 20,
    },
    {
      id: 2,
      style: 40,
    },
    {
      id: 3,
      style: 60,
    },
    {
      id: 4,
      style: 80,
    },
    {
      id: 5,
      style: 100,
    },
  ];

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

  return (
    <div className="sidebar-filter-rating">
      <div className={`sidebar-filter-rating-title ${active}`}>
        <a href="#" className="filter-head" onClick={handleOpen}>
          <span>Rating</span>
        </a>
      </div>
      <div className={`sidebar-filter-rating-body ${active}`}>
        <div className="sidebar-filter-rating-stars">
          <form className="star-rating-body">
            {rateObject
              .sort((a, b) => b.id - a.id)
              .map((rate, key) => (
                <a href="#" key={rate.id} className={`star-rating-link rate-${rate.id}`}>
                  <input
                    type="checkbox"
                    className="star-rating-checkbox"
                    name="stars"
                    value={rate.id}
                    onChange={checkInput}
                  />
                  <div className="first-star-rating star-rating-read" htmlFor={rate.id}>
                    <div className="star-rating-inner" style={{ width: `${rate.style}%` }}></div>
                  </div>
                  <span>
                    (
                    {
                      allProductsData?.totalProducts.filter(
                        (item) => Number(item.rating) === rate.id
                      ).length
                    }
                    )
                  </span>
                </a>
              ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SideBarFilters;
