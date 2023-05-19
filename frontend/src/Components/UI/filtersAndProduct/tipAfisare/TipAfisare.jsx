import React, { useState } from "react";
import "./tipAfisare.css";
import { useDispatch, useSelector } from "react-redux";
import { cardViewGrid, cardViewList } from "../../../../features/buttons/buttonsSlice";

const TipAfisare = () => {
  const [activeList, setActiveList] = useState(false);
  const [activeGrid, setActiveGrid] = useState(true);

  const cardViewListV = useSelector((state) => state.cardsView.cardViewList);
  const cardViewGridV = useSelector((state) => state.cardsView.cardViewGrid);
  console.log(cardViewListV);
  console.log(cardViewGridV);
  const dispatch = useDispatch();

  const isActiveList = (e) => {
    e.preventDefault();
    if (activeList) {
    } else {
      setActiveList(!activeList);
      setActiveGrid(!activeGrid);
    }
  };

  const isActiveGrid = (e) => {
    e.preventDefault();
    if (activeGrid) {
    } else {
      setActiveGrid(!activeGrid);
      setActiveList(!activeList);
    }
  };
  const isActiveListV2 = (e) => {
    e.preventDefault();

    if (!cardViewListV) {
      dispatch(cardViewList());
      dispatch(cardViewList());
    } else {
      // dispatch(cardViewList(!cardViewListV));
      // dispatch(cardViewGrid(cardViewGridV));
    }
  };
  const isActiveGridV2 = (e) => {
    e.preventDefault();

    if (!cardViewGridV) {
      dispatch(cardViewList());
      dispatch(cardViewGrid());
    } else {
    }
  };

  return (
    <div className="tip-afisare-container">
      <div className="tip-afisare-head">Tip Afisare: </div>

      <div className="tip-afisare-body">
        {!cardViewListV ? (
          <div className={`cards-view-list`} onClick={isActiveListV2}>
            <button>
              <i className="bi bi-list"></i>
            </button>
          </div>
        ) : (
          <div className={`cards-view-list card-v2-list`} onClick={isActiveListV2}>
            <button>
              <i className="bi bi-list"></i>
            </button>
          </div>
        )}
        {cardViewGridV ? (
          <div className={`cards-view-grid card-v2-grid`} onClick={isActiveGridV2}>
            <button>
              <i className="bi bi-grid-fill"></i>
            </button>
          </div>
        ) : (
          <div className={`cards-view-grid`} onClick={isActiveGridV2}>
            <button>
              <i className="bi bi-grid-fill"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TipAfisare;
