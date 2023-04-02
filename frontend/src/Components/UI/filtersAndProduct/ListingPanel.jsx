import React, { useState } from "react";
import { Link } from "react-router-dom";

const ListingPanel = () => {
  const [limit, setLimit] = useState(30);
  const [open, setOpen] = useState(false);
  const limitArray = [30, 60, 90];

  // console.log(limit);

  // console.log(limit);
  const handleOpen = () => {
    setOpen(!open);
  };

  const aButton = (e) => {
    setLimit(e.currentTarget.value);

    setOpen(!open);
  };
  return (
    <div className="limit-container">
      <button type="button" onClick={handleOpen}>
        <span onChange={aButton}>Limit {limit}</span>
      </button>
      {open ? (
        <div className="listing-sorting-dropdown">
          <ul className="dropdown-menu">
            {limitArray.map((item, key) => (
              <li
                key={key}
                value={item}
                className={limit === item ? "active" : ""}
                onClick={aButton}
              >
                <Link to="#">Limit {item}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default ListingPanel;
