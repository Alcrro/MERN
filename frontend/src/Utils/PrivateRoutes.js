import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../features/product/postProductSlice";
import { useEffect } from "react";

const PrivateRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return user ? <Outlet /> : <Navigate to="/user/auth/login" />;
};

export default PrivateRoutes;
