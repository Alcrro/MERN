const getMenuDepartmentCategory = async (menuData) => {
  const response = await fetch("http://localhost:3001/menuDepartment", menuData);
  const data = await response.json();

  return data;
};

const menuDepartmentService = {
  getMenuDepartmentCategory,
};
export default menuDepartmentService;
