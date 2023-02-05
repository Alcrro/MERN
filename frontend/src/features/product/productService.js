import axios from "axios";

const API_URL = "/api/";

// Get all products
const getAllProducts = async (productsData) => {
  const response = await axios.get(API_URL + "products", productsData);
  return response.data;
};

// Get product by id
const getProductById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Create a product
const createProduct = async (product) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
};

export default productService;
