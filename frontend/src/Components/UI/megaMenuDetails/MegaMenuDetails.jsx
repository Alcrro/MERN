import React, { useState } from "react";
import "./MegaMenuDetails.css";
import { Link } from "react-router-dom";

const MegaMenuDetails = ({ value, item }) => {
  const [active, setActive] = useState(false);

  return (
    <div className={`subcategories ${active}`}>
      <ul>
        <li>
          {value?.subcategory?.map((test, key) => (
            <Link to={`/${item.category.slug}/${test.slug}`} key={key}>
              <>{test.name}</>
            </Link>
          ))}
        </li>
      </ul>
    </div>
  );
};

export default MegaMenuDetails;
