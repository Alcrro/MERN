import React, { useState } from "react";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";

const RatingFilter = ({ rating, setRating }) => {
  const handleTest = (e) => {
    if (e.target.checked === true) {
      setRating(e.target.value);
      const array = [...rating];
      array.push(e.target.value);
      setRating(array);
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
    <div>
      <h3>Rating</h3>
      <ul>
        <li>
          <input type="checkbox" name="rating" value="5" onChange={handleTest} />
          <label htmlFor="rating">5</label>
        </li>
        <li>
          <input type="checkbox" name="rating" value="4" onChange={handleTest} />
          <label htmlFor="rating">4</label>
        </li>
        <li>
          <input type="checkbox" name="rating" value="3" onChange={handleTest} />
          <label htmlFor="rating">3</label>
        </li>
        <li>
          <input type="checkbox" name="rating" value="2" onChange={handleTest} />
          <label htmlFor="rating">2</label>
        </li>
        <li>
          <input type="checkbox" name="rating" value="1" onChange={handleTest} />
          <label htmlFor="rating">1</label>
        </li>
      </ul>
    </div>
  );
};

export default RatingFilter;
