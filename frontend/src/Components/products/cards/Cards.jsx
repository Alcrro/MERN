import React from "react";
import "./cards.css";

const Cards = (props) => {
  console.log(props.products);
  return (
    <div className="card-item">
      <div className="card-v2">
        <div className="card-v2-wrapper">
          <div className="card-v2-info">
            <a href="#" className="card-v2-thumb">
              <div className="card-v2-thumb-inner">
                <img src="" alt="" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
