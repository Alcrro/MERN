import { Link } from "react-router-dom";

const EcosystemItem = ({ label, icon, slug, reason }) => (
  <Link to={slug} className="ecosystem-item">
    <span className="ecosystem-item__icon">{icon}</span>
    <span className="ecosystem-item__text">
      <span className="ecosystem-item__label">{label}</span>
      {reason && <span className="ecosystem-item__reason">{reason}</span>}
    </span>
  </Link>
);

export default EcosystemItem;
