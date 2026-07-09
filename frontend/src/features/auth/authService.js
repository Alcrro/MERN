import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || ""}/api/auth/`;
const cfg = { withCredentials: true };

const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData, cfg);
  const user = response.data.user;
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData, cfg);
  const user = response.data.user;
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

const logout = async () => {
  await axios.get(API_URL + "logout", cfg);
  localStorage.removeItem("user");
};

const authService = { register, login, logout };

export default authService;
