import { NavLink } from "react-router-dom";
import { ADMIN_LINKS } from "../../../../utils/constants";
import "./AdminSidebar.css";

const AdminSidebar = () => (
  <nav className="asidebar">
    <p className="asidebar__title">Panou administrare</p>
    {ADMIN_LINKS.map(({ to, label, icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => `asidebar__link${isActive ? " asidebar__link--active" : ""}`}
      >
        <span className="asidebar__icon">{icon}</span>
        {label}
      </NavLink>
    ))}
  </nav>
);

export default AdminSidebar;
