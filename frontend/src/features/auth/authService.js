import axios from "axios";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

const API_URL = "/api/auth/";

//Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  return response.data;
};

//Login	user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  let token = response.data.token;
  let decoded = jwt_decode(token);
  // console.log(decoded);

  return response.data;
};

// Logout user
const logout = async (userData) => {
  const response = axios.post(API_URL + "logout", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("token"));
};

const authService = {
  register,
  logout,
  login,
  getCurrentUser,
};

export default authService;
