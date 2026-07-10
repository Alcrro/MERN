/* eslint-disable */
import React, { useState } from "react";
import { useGetAllProductsQuery } from "../../../../features/product/rtkProducts";
import "./sideBarFiltersRating.css";
import "../../singleCardRating/starRating.css";

const rateObject = [
  { id: 5, style: 100 },
  { id: 4, style: 80 },
  { id: 3, style: 60 },
  { id: 2, style: 40 },
  { id: 1, style: 20 },
];

const SideBarFilters = ({ rating, setRating }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("active");

  const { data: allProductsData } = useGetAllProductsQuery();

  const handleOpen = () => {
    setOpen(!open);
    setActive(open ? "active" : "");
  };

  const checkInput = (e) => {
    const val = e.target.value;
    const arr = Array.isArray(rating) ? [...rating] : [];
    if (e.target.checked) {
      setRating([...arr, val]);
    } else {
      setRating(arr.filter((r) => r !== val));
    }
  };

  return (
    <div className="sidebar-filter-rating">
      <a href="#" className="filter-head" onClick={handleOpen}>
        <span>Rating</span>
      </a>
      <div className={`filter-body scrollable ${active}`}>
        {rateObject.map((rate) => {
          const count = allProductsData?.totalProducts.filter(
            (item) => Math.floor(item.rating?.average || 0) >= rate.id
          ).length ?? 0;
          const isChecked = Array.isArray(rating) && rating.includes(String(rate.id));
          return (
            <label key={rate.id} className="filter-inner">
              <input
                type="checkbox"
                name="stars"
                value={rate.id}
                checked={isChecked}
                onChange={checkInput}
              />
              <div className="first-star-rating star-rating-read">
                <div className="star-rating-inner" style={{ width: `${rate.style}%` }} />
              </div>
              <span className="rating-filter-and-up">& up</span>
              <div className="star-brand-text"><span>({count})</span></div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default SideBarFilters;
