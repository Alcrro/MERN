/* eslint-disable */
import React from "react";
import { useGetAllProductsQuery } from "../../../../features/product/rtkProducts";
import "./modelfilter.css";

const ModelFilter = ({
  uniqueModelsArray,
  modelsFilterArray,
  model,
  setModel,
  setPage,
  setChecked,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = React.useState("active");

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setActive(isOpen ? "active" : "");
  };

  const { data: allProductsData } = useGetAllProductsQuery();
  const onOptionChangeModelNameHandler = (e) => {
    if (e.target.checked === true) {
      setModel(e.target.value);
      setChecked(true);
      const array = [...model];
      array.push(e.target.value);
      setModel(array);
      setPage(1);
    }
    if (e.target.checked === false) {
      setModel("");
      setChecked(false);
      const array = [...model];
      const index = array.indexOf(e.target.value);
      array.splice(index, 1);
      setModel(array);
    }
  };

  const modelsToShow = (model === "" ? uniqueModelsArray : modelsFilterArray) ?? [];

  return (
    <div className="model-title">
      <a href="#" className="filter-head" onClick={handleOpen}>
        <span>Model</span>
      </a>
      <div className={`model ${active}`}>
        <div className="scrollable">
          {modelsToShow.sort((a, b) => a.localeCompare(b)).map((item) => {
            const count = allProductsData?.totalProducts?.filter((p) => p.model === item).length ?? 0;
            const isChecked = Array.isArray(model) && model.includes(item);
            return (
              <label key={item} className="filter-inner">
                <input
                  type="checkbox"
                  name="model"
                  value={item}
                  checked={isChecked}
                  onChange={onOptionChangeModelNameHandler}
                />
                <span style={{ flex: 1, fontSize: ".82rem", color: "var(--text-medium)" }}>{item}</span>
                <div className="star-brand-text"><span>({count})</span></div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModelFilter;
