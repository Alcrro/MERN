import axios from "axios";

const postAddProductCategoryService = async (data) => {
  const response = await axios.post("http://localhost:5000/api/admin/add-category", data);
  // console.log(response.data);
  return response.data;
};

const postAddProductService = {
  postAddProductCategoryService,
};

export default postAddProductService;
