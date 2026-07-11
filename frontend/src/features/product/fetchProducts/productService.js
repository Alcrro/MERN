import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || ""}/`;

// Get all products
const getAllProducts = async (productsData) => {
  const response = await fetch(API_URL + `products`, productsData);
  const data = await response.json();
  return data;
};

// Get product by id
const getProductById = async (id) => {
  const response = await axios.get(API_URL + "product/", id);
  return response.data;
};

// Create a product
const createProduct = async (product) => {
  const response = await axios.post(API_URL + "admin/product", product);

  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
};

export default productService;
