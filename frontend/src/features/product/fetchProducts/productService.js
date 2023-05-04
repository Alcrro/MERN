import axios from "axios";

const API_URL = "http://localhost:5000/api/";

// Get all products
const getAllProducts = async (productsData) => {
  const response = await fetch(API_URL + `products`, productsData);
  // console.log(response);

  const data = await response.json();
  // console.log(data);

  // console.log(response);
  if (response.status === 200) {
    // console.log("merge");
  }
  return data;
};

// Get product by id
const getProductById = async (id) => {
  const response = await axios.get(API_URL + "product/", id);

  console.log(response);
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
