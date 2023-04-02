import React from "react";
import "./pagination.css";

const Pagination = ({ pagesFilterArray, pagesArray, limit, setPage }) => {
  return (
    <div className="pagination-container">
      <div className="pagination-buttons">
        {limit >= 30
          ? pagesArray.map((item, key) => (
              <button key={key} onClick={() => setPage(item)}>
                {item}
              </button>
            ))
          : pagesFilterArray.map((item, key) => (
              <button key={key} onClick={() => setPage(item)}>
                {item}
              </button>
            ))}
      </div>
    </div>
  );
};

export default Pagination;
