import "./TierBadge.css";

const LABELS = { standard: "Standard", silver: "Silver", gold: "Gold" };

const TierBadge = ({ tier = "standard" }) => (
  <span className={`tier-badge tier-badge--${tier}`} aria-label={`Nivel ${LABELS[tier]}`}>
    {LABELS[tier]}
  </span>
);

export default TierBadge;
