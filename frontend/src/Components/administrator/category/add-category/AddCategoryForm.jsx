import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postAddProductCategory } from "../../../../features/productCategory/postAddProductCategorySlice";

const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    const category = { categoryName, categoryDescription };
    console.log(category);
    dispatch(postAddProductCategory(category));
  };
  return (
    <div className="add-category-container-outer">
      <h1>Adauga Categorii</h1>
      <div className="add-category-container-inner">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">Nume Categorie</label>
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryDescription">Descriere Categorie</label>
            <input
              type="text"
              name="categoryDescription"
              id="categoryDescription"
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </div>
          <div className="add-category-button">
            <button>Adauga Categorie</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryForm;
