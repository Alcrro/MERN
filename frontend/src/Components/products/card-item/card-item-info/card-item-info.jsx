import React from "react";
import CardItemThumbInner from "./card-item-thumb-inner";
import CardItemBadgeCmpHolder from "./card-item-badge-cmp-holder";
import CardItemTitle from "./pad-hrz-xs/card-v2-title-wrapper/card-item-title";
import "./style/card-item-info.css";

const CardItemInfo = (props) => {
  return (
    <div className="card-item-info">
      <a href={`/product/${props.info}`}>
        <CardItemThumbInner />
        <CardItemBadgeCmpHolder />
      </a>
      <div className="pad-hrz-xs">
        <CardItemTitle info={props.info} />
      </div>
    </div>
  );
};

export default CardItemInfo;
