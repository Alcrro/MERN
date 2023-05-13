import React from "react";
import "./tipAfisare.css";

const TipAfisare = () => {
  return (
    <div className="tip-afisare-container">
      <div className="tip-afisare-head">Tip Afisare: </div>
      <div className="tip-afisare-body">
        <div className="cards-view-list">
          <button>
            <i class="bi bi-list"></i>
          </button>
        </div>
        <div className="cards-view-grid active">
          <button>
            <i class="bi bi-grid-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipAfisare;
