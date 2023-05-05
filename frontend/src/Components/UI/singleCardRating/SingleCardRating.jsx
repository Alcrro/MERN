import React from "react";

const SingleCardRating = (props) => {
  const data = props.data;

  return (
    <span>
      {data.rating === "1" ? (
        <div className="first-star-rating star-rating-read">
          <div className="star-rating-inner" style={{ width: "20%" }}></div>
        </div>
      ) : data.rating === "2" ? (
        <div className="first-star-rating star-rating-read">
          <div className="star-rating-inner" style={{ width: "40%" }}></div>
        </div>
      ) : data.rating === "3" ? (
        <div className="first-star-rating star-rating-read">
          <div className="star-rating-inner" style={{ width: "60%" }}></div>
        </div>
      ) : data.rating === "4" ? (
        <div className="first-star-rating star-rating-read">
          <div className="star-rating-inner" style={{ width: "80%" }}></div>
        </div>
      ) : data.rating === "5" ? (
        <div className="first-star-rating star-rating-read">
          <div className="star-rating-inner" style={{ width: "100%" }}></div>
        </div>
      ) : null}
    </span>
  );
};

export default SingleCardRating;
