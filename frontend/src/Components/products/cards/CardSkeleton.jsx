import "./CardSkeleton.css";

const CardSkeleton = () => (
  <div className="card-item">
    <div className="sk-card">
      <div className="sk-img sk-pulse" />
      <div className="sk-body">
        <div className="sk-chips">
          <div className="sk-chip sk-pulse" style={{ width: 48 }} />
          <div className="sk-chip sk-pulse" style={{ width: 36 }} />
        </div>
        <div className="sk-title sk-pulse" />
        <div className="sk-desc1 sk-pulse" />
        <div className="sk-desc2 sk-pulse" />
        <div className="sk-rating sk-pulse" />
      </div>
      <div className="sk-foot">
        <div className="sk-price sk-pulse" />
        <div className="sk-btn sk-pulse" />
      </div>
    </div>
  </div>
);

export default CardSkeleton;
