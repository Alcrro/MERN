import React from "react";

const ProductItemDescription = (props) => {
  const { name, slug } = props.productDescription;
  return (
    <div className="card-name">
      <a href={`http://localhost:3000/product/${slug}`}>{name}</a>
    </div>
  );
};

export default ProductItemDescription;
