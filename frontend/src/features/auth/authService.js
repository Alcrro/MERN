import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "/api/auth/";

//Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

//Login	user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response.data);

  if (response.data) {
    localStorage.setItem("token", JSON.stringify(response.data.token));

    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  if (localStorage.getItem("user")) {
    toast.success("You have been logged out");
    localStorage.removeItem("user");

    localStorage.removeItem("token");
  } else {
    toast.error("You are not logged in");
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  register,
  logout,
  login,
  getCurrentUser,
};

export default authService;
