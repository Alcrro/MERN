import React from "react";
import "./brandFilter.css";
import {
  useGetAllProductsQuery,
  useGetProductsQuery,
} from "../../../../features/product/rtkProducts";

const BrandFilter = ({
  brand,
  setBrand,
  checked,
  setChecked,
  setPage,
  setRating,
  model,
  limit,
  setLimit,
  queryProducts,
}) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("active");

  const { data: allProductsData } = useGetAllProductsQuery();

  // console.log(queryProducts);

  // create an array of brands names
  let namesArray = [];
  allProductsData?.totalProducts.map((item) => namesArray.push(item.brand));
  let uniqueNamesArray = namesArray.filter((item, index) => namesArray.indexOf(item) === index);

  const handleOpen = () => {
    setOpen(!open);
    setActive(open ? "active" : "");
  };

  const checkHandler = (e) => {
    if (e.target.checked === true) {
      setBrand(e.target.value);
      setChecked(true);
      const array = [...brand];
      array.push(e.target.value);
      setBrand(array);
      setPage(1);
      setRating([]);
    }
    if (e.target.checked === false) {
      setBrand("");
      setChecked(false);
      const array = [...brand];
      const index = array.indexOf(e.target.value);
      array.splice(index, 1);
      setBrand(array);
    }
  };
  return (
    <div className="sidebar-filter-brand">
      <div className={`sidebar-filter-brand-title ${active}`}>
        <a href="#" className="filter-head" onClick={handleOpen}>
          <span>Brand</span>
        </a>
      </div>
      <div className={`sidebar-filter-rating-body ${active}`}>
        <div className="sidebar-filter-rating-stars">
          <form>
            {uniqueNamesArray?.map((item, key) => (
              <div key={key}>
                <input
                  type="checkbox"
                  className={brand === item ? "checked" : "unchecked"}
                  name="brands"
                  id={item}
                  value={item}
                  onChange={checkHandler}
                />
                <label htmlFor={item}> {item}</label>
                <div className="star-brand-text">
                  <span>
                    (
                    {
                      allProductsData?.totalProducts?.filter((filter) => filter.brand === item)
                        .length
                    }
                    )
                  </span>
                </div>
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandFilter;
