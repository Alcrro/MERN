import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminSidebar from "../AdminSidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/auth/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="alayout">
      <aside className="alayout__aside">
        <AdminSidebar />
      </aside>
      <main className="alayout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
