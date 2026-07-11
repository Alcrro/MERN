import "./StatCard.css";

const StatCard = ({ label, value, sub }) => (
  <div className="stat-card">
    <span className="stat-card__value">{value ?? "—"}</span>
    <span className="stat-card__label">{label}</span>
    {sub && <span className="stat-card__sub">{sub}</span>}
  </div>
);

export default StatCard;
