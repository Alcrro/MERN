import { Link } from "react-router-dom";
import { useGetMyCardQuery } from "../../../features/shopCard/rtkShopCard";
import "./PointsBadge.css";

const PointsBadge = () => {
  const { data, isLoading } = useGetMyCardQuery();
  if (isLoading || !data?.data) return null;

  return (
    <Link to="/profile/my-card" className="points-badge" aria-label="Cardul meu de puncte">
      <span className="points-badge__star">★</span>
      <span className="points-badge__value">{data.data.points.toLocaleString("ro-RO")} pct</span>
    </Link>
  );
};

export default PointsBadge;
