import React from "react";
import "./card-item-badges.css";

const CardItemBadges = (props) => {
  const { product } = props.badges;
  return <div className="card-item-badges">{product}</div>;
};

export default CardItemBadges;
