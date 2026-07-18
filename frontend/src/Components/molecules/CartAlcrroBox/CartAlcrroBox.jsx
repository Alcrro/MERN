import { useDispatch, useSelector } from "react-redux";
import { useGetMyCardQuery } from "../../../features/shopCard/rtkShopCard";
import { setUseCredits, setUsePoints } from "../../../features/discount/discountSlice";
import { fmt } from "../../products/add-to-Cart/cartUtils";
import "./CartAlcrroBox.css";

const POINTS_TO_RON = 10;

const CardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const TIER_LABEL = { standard: "Standard", silver: "Silver", gold: "Gold" };

const CartAlcrroBox = ({ orderTotal }) => {
  const dispatch     = useDispatch();
  const useCredits   = useSelector((s) => s.discount.useCredits);
  const usePoints    = useSelector((s) => s.discount.usePoints);
  const { data, isError } = useGetMyCardQuery();

  const card = data?.data;
  if (isError || !card) return null;

  const credits     = card.credits ?? 0;
  const points      = card.points  ?? 0;
  const pointsInRon = Math.floor((points / POINTS_TO_RON) * 100) / 100;

  const hasCredits = credits > 0;
  const hasPoints  = points >= POINTS_TO_RON;

  if (!hasCredits && !hasPoints) return null;

  const creditsSaving = Math.min(credits, orderTotal).toFixed(2);

  return (
    <div className="cab">
      <div className="cab__head">
        <CardIcon />
        <span className="cab__title">AlcrroCard</span>
        <span className={`cab__tier cab__tier--${card.tier}`}>{TIER_LABEL[card.tier] ?? card.tier}</span>
      </div>

      {hasCredits && (
        <label className={`cab__row${useCredits ? " cab__row--on" : ""}`}>
          <input
            type="checkbox"
            className="cab__check"
            checked={useCredits}
            onChange={(e) => dispatch(setUseCredits(e.target.checked))}
          />
          <span className="cab__row-text">
            <span className="cab__row-label">Credite disponibile</span>
            <span className="cab__row-sub">{fmt(credits)} RON</span>
          </span>
          <span className="cab__row-saving">-{creditsSaving} RON</span>
        </label>
      )}

      {hasPoints && (
        <label className={`cab__row${usePoints ? " cab__row--on" : ""}`}>
          <input
            type="checkbox"
            className="cab__check"
            checked={usePoints}
            onChange={(e) => dispatch(setUsePoints(e.target.checked))}
          />
          <span className="cab__row-text">
            <span className="cab__row-label">Puncte disponibile</span>
            <span className="cab__row-sub">{points.toLocaleString("ro-RO")} puncte</span>
          </span>
          <span className="cab__row-saving">-{fmt(pointsInRon)} RON</span>
        </label>
      )}
    </div>
  );
};

export default CartAlcrroBox;
