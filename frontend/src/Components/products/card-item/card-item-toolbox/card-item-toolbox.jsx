import React from "react";

const CardItemToolbox = (props) => {
  const { name } = props.toolbox;
  // console.log(name);
  return <div className="card-item-toolbox">{name}</div>;
};

export default CardItemToolbox;
