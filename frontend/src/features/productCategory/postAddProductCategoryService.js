import axios from "axios";

const postAddProductCategoryService = async (data) => {
  const response = await axios.post("http://localhost:5000/api/admin/adauga-categorii", data);
  return response;
};

const postAddProductService = {
  postAddProductCategoryService,
};

export default postAddProductService;
