import axios from "axios";
import React, { useState, useEffect } from "react";

const ProductsList = () => {
  const [productBrand, setProductName] = useState("");
  const [productCount, setProductCount] = useState("");
  const [newProductBrand, setNewProductBrand] = useState("");
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/read").then((res) => {
      setProductList(res.data);
    });
  }, []);

  const addToList = () => {
    axios.post("http://localhost:5000/insert", {
      productBrand,
      productCount,
    });
  };

  const updateProduct = (id) => {
    axios.put("http://localhost:5000/update", {
      id: id,
      newProductBrand: newProductBrand,
    });
  };

  const deleteProduct = (id) => {
    axios.delete(`http://localhost:5000/delete/${id}`).then((res) => {
      setProductList(res.data);
    });
  };
  return (
    <div className="App">
      <h1>Crud App with MERN</h1>

      <label htmlFor="">Product Name:</label>
      <input
        type="text"
        onChange={(e) => {
          setProductName(e.target.value);
        }}
      />
      <label htmlFor="">Product Count:</label>
      <input
        type="number"
        onChange={(e) => {
          setProductCount(e.target.value);
        }}
      />
      <button onClick={addToList}> Add to List</button>
      <h1>Product List</h1>
      {productList.map((val, key) => {
        return (
          <div key={key}>
            <div className="container">
              <div className="productName">Product Name: {val.brand}</div>
              <div className="productCount">Product Count: {val.count}</div>
              <div className="controls-container">
                <input
                  type="text"
                  className="newProductName"
                  placeholder="New Product Name"
                  onChange={(e) => {
                    setNewProductBrand(e.target.value);
                  }}
                />
                <div className="buttons-container">
                  <button className="btn btn-update" onClick={() => updateProduct(val._id)}>
                    Update
                  </button>
                  <button className="btn btn-delete" onClick={() => deleteProduct(val._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;
