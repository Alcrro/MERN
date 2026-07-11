import { NavLink } from "react-router-dom";
import { VENDOR_LINKS } from "../../../../utils/constants";
import "./VendorSidebar.css";

const VendorSidebar = () => (
  <nav className="vsidebar">
    <p className="vsidebar__title">Contul meu de vânzător</p>
    {VENDOR_LINKS.map(({ to, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => `vsidebar__link${isActive ? " vsidebar__link--active" : ""}`}
      >
        {label}
      </NavLink>
    ))}
  </nav>
);

export default VendorSidebar;
