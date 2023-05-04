import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import SingleProducts from "../../../Components/products/singleProducts/SingleProducts";
import AddToCartButton from "../add-to-cart-button/Add-to-cart-button";

import "./productsv2.css";

const ProductsV2 = (props) => {
  // console.log(props.products);
  const data = props.products;

  return (
    <div className="card">
      <div className="card-image">
        <img
          src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"
          alt="product"
          width={"100px"}
          height={"200px"}
        />
      </div>
      <div className="card-body">
        <div className="card-title">
          <Link to={`/product/${data.slug}`}>{data.description}</Link>
        </div>
        <div className="card-rating">
          <span>Rating:{data.rating}</span>
        </div>
        <div className="card-price">
          <span>{data.price}</span>
        </div>
      </div>
      <AddToCartButton />
    </div>
  );
};

export default ProductsV2;
