import React from "react";
import {
  useGetAllProductsQuery,
  useGetProductsQuery,
} from "../../../../features/product/rtkProducts";

const ModelFilter = ({
  uniqueModelsArray,
  modelsFilterArray,
  model,
  setModel,
  setPage,
  setChecked,
}) => {
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

  return (
    <div>
      <h4>ModelFilter</h4>
      <div className="form">
        <form>
          <div>
            {model === ""
              ? uniqueModelsArray
                  ?.sort((a, b) => {
                    return a.localeCompare(b);
                  })
                  .map((item, key) => (
                    <div key={key}>
                      <input
                        type="checkbox"
                        className={model === item ? "checked" : "unchecked"}
                        name="model"
                        id={item}
                        value={item}
                        onChange={onOptionChangeModelNameHandler}
                      />
                      <label htmlFor={item}> {item}</label>
                      <div className="star-brand-text">
                        <span>
                          (
                          {
                            allProductsData?.totalProducts
                              ?.map((item) => {
                                return item;
                              })
                              .filter((filter) => filter.model === item).length
                          }
                          )
                        </span>
                      </div>
                    </div>
                  ))
              : modelsFilterArray
                  ?.sort((a, b) => {
                    return a.localeCompare(b);
                  })
                  .map((item, key) => {
                    return (
                      <div key={key}>
                        <input
                          type="checkbox"
                          className={model === item ? "checked" : "unchecked"}
                          name="model"
                          id={item}
                          value={item}
                          onChange={onOptionChangeModelNameHandler}
                        />
                        <label htmlFor={item}> {item}</label>
                        <div className="star-brand-text">
                          <span>
                            (
                            {
                              allProductsData?.totalProducts
                                ?.map((item) => {
                                  return item;
                                })
                                .filter((filter) => filter.model === item).length
                            }
                            )
                          </span>
                        </div>
                      </div>
                    );
                  })}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModelFilter;
