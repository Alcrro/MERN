import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VendorApplyForm from "../../../Components/vendor/apply/VendorApplyForm";
import "./VendorApply.css";

const VendorApply = () => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/auth/login" />;
  if (user.role === "vendor") return <Navigate to="/vendor/dashboard" />;

  return (
    <div className="vapply-page">
      <VendorApplyForm />
    </div>
  );
};

export default VendorApply;
