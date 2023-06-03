import React, { useEffect, useState } from "react";
import "./megaMenu.css";
import { Link, useLocation } from "react-router-dom";
import {
  getMenuDepartment,
  getAllCategories,
  getSelected,
} from "../../../features/menu-department/menuDepartmentSlice";
import { useDispatch, useSelector } from "react-redux";
import MegaMenuDetails from "../megaMenuDetails/MegaMenuDetails";

const MegaMenu = () => {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState([]);
  console.log(value);
  useEffect(() => {
    dispatch(getMenuDepartment());
  }, []);

  const dispatch = useDispatch();
  const location = useLocation();
  const categories = useSelector(getAllCategories);

  // console.log(categories);

  const handleClick = (item) => {
    dispatch(getMenuDepartment(item));
    // console.log(item.category);
    setValue(item.category);
  };

  return (
    <div className="megamenu-container megamenu-always-open">
      <div className="megamenu-body">
        <ul>
          {categories?.map((item, key) => (
            <div key={key}>
              <li className={`merge`} onClick={() => handleClick(item)}>
                <Link to={`/${item.category.slug}`}>{item.category.name}</Link>
              </li>
              <MegaMenuDetails setValue={setValue} value={value} item={item} />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MegaMenu;
