import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAllProducts, reset } from "../../features/product/productSlice";
import { useNavigate } from "react-router-dom";
import "./products.css";

import CardItemBadges from "./card-item/card-item-badges/card-item-badges";
import CardItemToolbox from "./card-item/card-item-toolbox/card-item-toolbox";
import CardItemInfo from "./card-item/card-item-info/card-item-info";
import CardItemContent from "./card-item/card-item-content/card-item-content";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, count, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <>
      <div className="container-products-outer">
        <h1>Products Nr: {products.count}</h1>
        <div id="card-grid" className="js-products-container card-collection">
          {products.products &&
            products.products.map((item) => (
              <div className="card-item" key={item._id}>
                <div className="card-item-wrapper js-section-wrapper">
                  <CardItemBadges badges={"test"} />
                  <CardItemToolbox toolbox={item} />
                  <CardItemInfo info={item} />
                  <CardItemContent content={item} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Products;
