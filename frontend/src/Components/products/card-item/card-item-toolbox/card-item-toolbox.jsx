import React from "react";

const CardItemToolbox = (props) => {
  const { brand, price } = props.toolbox;
  // console.log(name);
  return (
    <div>
      <div className="card-item-toolbox">{brand}</div>
      <div className="card-item-toolbox">{price}</div>
    </div>
  );
};

export default CardItemToolbox;
