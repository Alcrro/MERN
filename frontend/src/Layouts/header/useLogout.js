import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, reset } from "../../features/auth/authSlice";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return () => {
    dispatch(logout());
    dispatch(reset());
    toast.success("Ai fost delogat cu succes");
    navigate("/");
  };
};
