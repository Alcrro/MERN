const getMenuDepartmentCategory = async (menuData) => {
  const response = await fetch("https://alcrro.onrender.com/menuDepartment", menuData);
  const data = await response.json();

  return data;
};

const menuDepartmentService = {
  getMenuDepartmentCategory,
};
export default menuDepartmentService;
