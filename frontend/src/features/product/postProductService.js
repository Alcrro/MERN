import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/admin/";

// Get product by id
const getProductById = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

// Create a product
const createProduct = async (product) => {
  const response = await axios.post(API_URL + "product", product);
  console.log(response);
  return response.data;
};

const postProductService = {
  getProductById,
  createProduct,
};

export default postProductService;
