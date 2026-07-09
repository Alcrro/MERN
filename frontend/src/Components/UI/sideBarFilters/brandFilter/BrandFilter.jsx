/* eslint-disable */
import React from "react";
import "./brandFilter.css";
import { useGetAllProductsQuery } from "../../../../features/product/rtkProducts";

const BrandFilter = ({ brand, setBrand, setChecked, setPage, setRating }) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("active");

  const { data: allProductsData } = useGetAllProductsQuery();

  const namesArray = allProductsData?.totalProducts.map((item) => item.brand) ?? [];
  const uniqueNames = [...new Set(namesArray)];

  const handleOpen = () => {
    setOpen(!open);
    setActive(open ? "active" : "");
  };

  const checkHandler = (e) => {
    const val = e.target.value;
    if (e.target.checked) {
      const next = Array.isArray(brand) ? [...brand, val] : [val];
      setBrand(next);
      setChecked(true);
      setPage(1);
      setRating([]);
    } else {
      const next = Array.isArray(brand) ? brand.filter((b) => b !== val) : [];
      setBrand(next);
      if (next.length === 0) setChecked(false);
    }
  };

  return (
    <div className="sidebar-filter-brand">
      <a href="#" className="filter-head" onClick={handleOpen}>
        <span>Brand</span>
      </a>
      <div className={`sidebar-filter-brand-body ${active}`}>
        <div className="scrollable" style={{ padding: "4px" }}>
          {uniqueNames.map((item) => {
            const count = allProductsData?.totalProducts.filter((p) => p.brand === item).length ?? 0;
            const isChecked = Array.isArray(brand) && brand.includes(item);
            return (
              <label key={item} className="filter-inner">
                <input
                  type="checkbox"
                  name="brands"
                  value={item}
                  checked={isChecked}
                  onChange={checkHandler}
                />
                <span style={{ flex: 1, fontSize: ".82rem", color: "var(--text-medium)" }}>{item}</span>
                <span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>({count})</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandFilter;
