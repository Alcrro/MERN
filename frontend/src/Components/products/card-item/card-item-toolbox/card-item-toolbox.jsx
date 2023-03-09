import React from "react";

const CardItemToolbox = (props) => {
  const { name, price } = props.toolbox;
  // console.log(name);
  return (
    <div>
      <div className="card-item-toolbox">{name}</div>
      <div className="card-item-toolbox">{price}</div>
    </div>
  );
};

export default CardItemToolbox;
