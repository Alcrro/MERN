import axios from "axios";

const postAddProductCategoryService = async (data) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL || ""}/api/admin/add-category`, data);
  // console.log(response.data);
  return response.data;
};

const postAddProductService = {
  postAddProductCategoryService,
};

export default postAddProductService;
