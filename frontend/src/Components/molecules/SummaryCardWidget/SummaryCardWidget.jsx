import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMyCardQuery } from "../../../features/shopCard/rtkShopCard";
import AlcrroCard from "../AlcrroCard";
import TierBadge from "../TierBadge";
import "./SummaryCardWidget.css";

const SummaryCardWidget = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetMyCardQuery();
  const card = data?.data;

  return (
    <div className="sum-shopcard">
      <div className="sum-shopcard__header">
        <h3 className="sum-shopcard__title">Cardul meu Alcrro</h3>
        <Link to="/profile/my-card" className="sum-shopcard__link">Detalii</Link>
      </div>

      {isLoading && <div className="sum-shopcard__skel" />}

      {!isLoading && !card && (
        <div className="sum-shopcard__empty">
          <p>Nu ai un card Alcrro activ.</p>
          <Link to="/profile/my-card" className="sum-shopcard__cta">Activează cardul</Link>
        </div>
      )}

      {!isLoading && card && (
        <>
          <AlcrroCard card={card} userName={user?.name ?? ""} />
          <div className="sum-shopcard__stats">
            <div className="sum-shopcard__stat">
              <span className="sum-shopcard__stat-val">{card.credits.toLocaleString("ro-RO")}</span>
              <span className="sum-shopcard__stat-key">credite RON</span>
            </div>
            <div className="sum-shopcard__stat">
              <span className="sum-shopcard__stat-val">{card.points.toLocaleString("ro-RO")}</span>
              <span className="sum-shopcard__stat-key">puncte</span>
            </div>
            <div className="sum-shopcard__stat">
              <TierBadge tier={card.tier} />
              <span className="sum-shopcard__stat-key">nivel</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SummaryCardWidget;
