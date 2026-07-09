import { useState } from "react";
import {
  useGetAllProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../features/product/rtkProducts";

const ProductRow = ({ val }) => {
  const [newBrand, setNewBrand] = useState("");
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  return (
    <div className="container">
      <div className="productName">Product Name: {val.brand}</div>
      <div className="productCount">Product Count: {val.count}</div>
      <div className="controls-container">
        <input
          type="text"
          className="newProductName"
          placeholder="New Product Name"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
        />
        <div className="buttons-container">
          <button className="btn btn-update"
            onClick={() => updateProduct({ id: val._id, newProductBrand: newBrand })}>
            Update
          </button>
          <button className="btn btn-delete" onClick={() => deleteProduct(val._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsList = () => {
  const [brand, setBrand] = useState("");
  const [count, setCount] = useState("");

  const { data, isLoading } = useGetAllProductsQuery();
  const [addProduct] = useAddProductMutation();

  const products = data?.products ?? data ?? [];

  const handleAdd = () => {
    if (!brand || !count) return;
    addProduct({ brand, count: Number(count) });
    setBrand("");
    setCount("");
  };

  if (isLoading) return <p>Se încarcă...</p>;

  return (
    <div className="App">
      <h1>Crud App with MERN</h1>
      <label>Product Name:</label>
      <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
      <label>Product Count:</label>
      <input type="number" value={count} onChange={(e) => setCount(e.target.value)} />
      <button onClick={handleAdd}>Add to List</button>

      <h1>Product List</h1>
      {products.map((val) => <ProductRow key={val._id} val={val} />)}
    </div>
  );
};

export default ProductsList;
