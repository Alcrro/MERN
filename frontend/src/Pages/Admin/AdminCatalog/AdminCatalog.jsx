import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import CatalogAdmin from "../../../Components/administrator/catalog/CatalogAdmin";

const AdminCatalog = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user || user.role !== "admin") return <Navigate to="/" />;
  return <CatalogAdmin />;
};

export default AdminCatalog;
