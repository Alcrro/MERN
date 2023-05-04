import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./limit.css";

const ListingPanel = ({
  queryProduct,
  limit,
  setLimit,
  brand,
  model,
  setBrand,
  setModel,
  checked,
  setChecked,
  sort,
  setSort,
}) => {
  const [limitOpen, setLimitOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const limitArray = [30, 60, 90];

  const sortListArray = ["Price: Low to High", "Price: High to Low", "Newest", "Oldest"];

  const srote = [];

  const sortHandleOpen = () => {
    setSortOpen(!sortOpen);
  };

  const sortButton = (e) => {
    e.preventDefault();
    setSort(e.currentTarget.textContent);
    setSortOpen(!sortOpen);
    console.log(e.currentTarget.textContent);
  };

  const limitHandleOpen = () => {
    setLimitOpen(!limitOpen);
  };

  const limitButton = (e) => {
    setLimit(e.currentTarget.value);
    setLimitOpen(!limitOpen);
  };

  const removeFilter = (e) => {
    e.preventDefault();
    if (brand) {
      setChecked(false);
      setBrand([]);
    }
    if (model) {
      setModel([]);
      setChecked(false);
    }
  };

  const removeAllFilters = (e) => {
    e.preventDefault();
    setBrand([]);
    setModel([]);
    setChecked(false);
  };

  let combineFilter = [...brand, ...model];
  return (
    <>
      <div className="listing-panel-container">
        <div className="listing-panel-heading">
          <div className="listing-page-title">
            <h4 className="title-phrasing"> de facut trecerea datelor de la un url la altu </h4>
            Phone{combineFilter.length > 0 ? " - " : null}
            {brand.length > 0 ? (
              <div className="phrasing">
                <span>{brand.length > 0 ? `Brand: ${brand}` : null}</span>
              </div>
            ) : null}
            {model.length > 0 ? (
              <div className="phrasing">
                <span>{model.length > 0 ? `Model: ${model}` : null}</span>
              </div>
            ) : null}
          </div>
        </div>
        {combineFilter.length > 1 ? (
          <div className="quick-filter-as-value-container">
            <div className="quick-filter-as-value-inner">
              <div className="quick-filter-buttons-container">
                <h4>Remove filters :</h4>

                <button className="quick-filter-button" onClick={removeAllFilters}>
                  Remove all filters
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="listing-panel-footer sort-option">
          <div className="sort-control-group"></div>

          <div className="control-group">
            <div className="sort-control-item">
              <span>Sort by:</span>
            </div>
            <div className="sort-control-btn-dropdown">
              <button type="button" onClick={sortHandleOpen}>
                <span onChange={setSort}>{sort}</span>
              </button>
              {sortOpen ? (
                <div className="listing-sort-dropdown">
                  <ul className="dropdown-menu">
                    {sortListArray.map((item, key) => {
                      return (
                        <li
                          key={key}
                          value={item}
                          className={item === item ? "active" : ""}
                          onClick={sortButton}
                        >
                          <Link to="#">{item}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="limit-control-item">
              <span>Limit:</span>
            </div>
            <div className="limit-control-btn-dropdown">
              <button type="button" onClick={limitHandleOpen}>
                <span onChange={limitButton}>Limit {limit}</span>
              </button>
              {limitOpen ? (
                <div className="listing-limit-dropdown">
                  <ul className="dropdown-menu">
                    {limitArray.map((item, key) => (
                      <li
                        key={key}
                        value={item}
                        className={limit === item ? "active" : ""}
                        onClick={limitButton}
                      >
                        <Link to="#">Limit {item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingPanel;
