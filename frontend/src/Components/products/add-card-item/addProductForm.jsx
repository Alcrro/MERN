import React, { useState } from "react";
import { toast } from "react-toastify";
import "./addProductForm.css";
import { useAddProductMutation } from "../../../features/product/rtkProducts";
import { AVAILABILITY } from "../../../utils/constants";

const AddProductForm = () => {
  const [form, setForm] = useState({
    productBrand: "",
    productModel: "",
    productMemorieInterna: "",
    price: "",
    stock: "",
    availability: "In Stoc",
    description: "",
  });

  const [addProduct, { isLoading }] = useAddProductMutation();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(form).unwrap();
      toast.success("Produs adăugat cu succes!");
      setForm({
        productBrand: "",
        productModel: "",
        productMemorieInterna: "",
        price: "",
        stock: "",
        availability: "In Stoc",
        description: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Eroare la adăugarea produsului");
    }
  };

  return (
    <div className="container-add-product-outer">
      <div className="container-add-product-inner">
        <h1>Adaugă produs</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productBrand">Brand</label>
            <input
              type="text"
              name="productBrand"
              id="productBrand"
              value={form.productBrand}
              onChange={onChange}
              required
              placeholder="ex: Samsung"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productModel">Model</label>
            <input
              type="text"
              name="productModel"
              id="productModel"
              value={form.productModel}
              onChange={onChange}
              required
              placeholder="ex: Galaxy S24"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Preț ($)</label>
            <input
              type="number"
              name="price"
              id="price"
              value={form.price}
              onChange={onChange}
              required
              min="0"
              placeholder="ex: 999"
            />
          </div>

          <div className="form-group">
            <label htmlFor="productMemorieInterna">Memorie internă</label>
            <input
              type="text"
              name="productMemorieInterna"
              id="productMemorieInterna"
              value={form.productMemorieInterna}
              onChange={onChange}
              required
              placeholder="ex: 256GB"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stoc (bucăți)</label>
            <input
              type="number"
              name="stock"
              id="stock"
              value={form.stock}
              onChange={onChange}
              required
              min="0"
              placeholder="ex: 50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="availability">Disponibilitate</label>
            <select
              name="availability"
              id="availability"
              value={form.availability}
              onChange={onChange}
            >
              {Object.values(AVAILABILITY).map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descriere</label>
            <textarea
              name="description"
              id="description"
              rows="4"
              value={form.description}
              onChange={onChange}
              placeholder="Descriere produs (opțional — se generează automat din brand + model)"
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Se adaugă..." : "Adaugă produs"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
