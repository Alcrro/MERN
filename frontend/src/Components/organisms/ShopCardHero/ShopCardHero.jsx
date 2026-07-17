import AlcrroCard from "../../molecules/AlcrroCard";
import TierBadge from "../../molecules/TierBadge";
import "./ShopCardHero.css";

const TIER_NEXT = { standard: { label: "Silver", threshold: 500 }, silver: { label: "Gold", threshold: 2000 }, gold: null };

const ShopCardHero = ({ card, userName }) => {
  const next = TIER_NEXT[card.tier];
  const progress = next ? Math.min(100, Math.round((card.points / next.threshold) * 100)) : 100;

  return (
    <div className="sc-hero">
      <div className="sc-hero__card-wrap">
        <AlcrroCard card={card} userName={userName} />
      </div>

      <div className="sc-hero__info">
        <div className="sc-hero__tier-row">
          <TierBadge tier={card.tier} />
          {next && (
            <span className="sc-hero__tier-next">
              {card.points} / {next.threshold} pct pentru {next.label}
            </span>
          )}
          {!next && <span className="sc-hero__tier-next">Nivel maxim atins</span>}
        </div>

        {next && (
          <div className="sc-hero__progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="sc-hero__progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="sc-hero__stats">
          <div className="sc-hero__stat">
            <span className="sc-hero__stat-val">{card.credits.toLocaleString("ro-RO")}</span>
            <span className="sc-hero__stat-label">credite (RON)</span>
          </div>
          <div className="sc-hero__stat-sep" />
          <div className="sc-hero__stat">
            <span className="sc-hero__stat-val">{card.points.toLocaleString("ro-RO")}</span>
            <span className="sc-hero__stat-label">puncte</span>
          </div>
          <div className="sc-hero__stat-sep" />
          <div className="sc-hero__stat">
            <span className="sc-hero__stat-val">{(card.points / 10).toFixed(1)}</span>
            <span className="sc-hero__stat-label">credite din puncte</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCardHero;
