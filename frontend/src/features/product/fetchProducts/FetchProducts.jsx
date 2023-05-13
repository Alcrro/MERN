import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../addToCardSlice";
import { selectProductById } from "./productSlice";

const FetchProducts = () => {
  const [brand, setBrand] = useState([]);
  const products = useSelector((state) => state.products.products);

  let arrayBrands = products?.totalProducts?.map((item) => item.brand);

  const uniqueBrands = Array.from(new Set(arrayBrands));
  // console.log(uniqueBrands);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  let checkedBrand = [];
  const inputChange = (e) => {
    if (e.target.checked) {
      setBrand(e.target.value);
      const array = [...brand];
      array.push(e.target.value);
      setBrand(array);
    } else {
      setBrand([]);
    }
  };

  return (
    <div>
      {uniqueBrands?.map((item, key) => (
        <div key={key}>
          <input
            type="checkbox"
            value={item}
            onChange={inputChange}
            name="brands"
            id={item}
            className={brand === item ? "checked" : "unchecked"}
          />{" "}
          <label htmlFor={item}>
            {item}{" "}
            <span>
              (
              {
                products?.totalProducts
                  ?.map((item) => {
                    return item;
                  })
                  .filter((filter) => filter.brand === item).length
              }
              )
            </span>
          </label>
        </div>
      ))}

      <div>
        <h2>List of brands: </h2>
        {products?.totalProducts
          ?.filter((brands) => brands.brand.includes(brand))
          .map((item, key) => (
            <div key={key}>
              <div className="inner" style={{ display: "flex", justifyContent: "space-between" }}>
                {key}
                <div className="header">{item.description}</div>
                <div className="body">{item.rating}</div>
                <div className="footer">{item.price}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FetchProducts;
