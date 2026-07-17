import TierBadge from "../TierBadge";
import "./AlcrroCard.css";

const AlcrroCard = ({ card, userName }) => {
  const masked = card.cardNumber.replace(/([A-F0-9]{4})-([A-F0-9]{4})$/, "••••-$2");

  return (
    <div className={`alcrro-card alcrro-card--${card.tier}`} role="img" aria-label="Alcrro Shop Card">
      <div className="alcrro-card__inner">
        <div className="alcrro-card__top">
          <span className="alcrro-card__brand">ALCRRO SHOP</span>
          <TierBadge tier={card.tier} />
        </div>

        <div className="alcrro-card__chip" aria-hidden="true">
          <div className="alcrro-card__chip-lines" />
        </div>

        <div className="alcrro-card__number">{masked}</div>

        <div className="alcrro-card__bottom">
          <div className="alcrro-card__holder">
            <span className="alcrro-card__label">Titular</span>
            <span className="alcrro-card__name">{userName}</span>
          </div>
          <div className="alcrro-card__balance">
            <span className="alcrro-card__label">Credite</span>
            <span className="alcrro-card__credits">{card.credits.toLocaleString("ro-RO")} RON</span>
          </div>
        </div>
      </div>
      <div className="alcrro-card__glow" aria-hidden="true" />
    </div>
  );
};

export default AlcrroCard;
