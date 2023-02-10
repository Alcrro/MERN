import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const PrivateRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return user ? <Outlet /> : <Navigate to="/user/auth/login" />;
};

export default PrivateRoutes;
