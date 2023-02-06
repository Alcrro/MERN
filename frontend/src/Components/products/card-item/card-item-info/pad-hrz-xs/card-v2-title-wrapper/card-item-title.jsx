import React from "react";

const CardItemTitle = (props) => {
  const { description } = props.info;

  return <a className="card-v2-title semibold mrg-btm-xxs js-product-url">{description}</a>;
};

export default CardItemTitle;
