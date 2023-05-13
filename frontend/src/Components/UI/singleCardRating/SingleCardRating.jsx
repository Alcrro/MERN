import React from "react";

const SingleCardRating = (props) => {
  const data = props.data;
  // console.log(data);

  return (
    <>
      {data.rating === "1" ? (
        <>
          <div className="first-star-rating star-rating-read">
            <div className="star-rating-inner" style={{ width: "20%" }}></div>
          </div>
          <span> {data.rating}</span>
        </>
      ) : data.rating === "2" ? (
        <>
          <div className="first-star-rating star-rating-read">
            <div className="star-rating-inner" style={{ width: "40%" }}></div>
          </div>
          <span> {data.rating}</span>
        </>
      ) : data.rating === "3" ? (
        <>
          <div className="first-star-rating star-rating-read">
            <div className="star-rating-inner" style={{ width: "60%" }}></div>
          </div>
          <span> {data.rating}</span>
        </>
      ) : data.rating === "4" ? (
        <>
          <div className="first-star-rating star-rating-read">
            <div className="star-rating-inner" style={{ width: "80%" }}></div>
          </div>
          <span> {data.rating}</span>
        </>
      ) : data.rating === "5" ? (
        <>
          <div className="first-star-rating star-rating-read">
            <div className="star-rating-inner" style={{ width: "100%" }}></div>
          </div>
          <span> {data.rating}</span>
        </>
      ) : null}
    </>
  );
};

export default SingleCardRating;
