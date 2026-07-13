import "./tipAfisare.css";
import { useDispatch, useSelector } from "react-redux";
import { cardViewGrid, cardViewList } from "../../../../features/buttons/buttonsSlice";

const TipAfisare = () => {
  const cardViewListV = useSelector((state) => state.cardsView.cardViewList);
  const cardViewGridV = useSelector((state) => state.cardsView.cardViewGrid);
  const dispatch = useDispatch();

  const handleList = (e) => {
    e.preventDefault();
    if (!cardViewListV) {
      dispatch(cardViewList());
      dispatch(cardViewList());
    }
  };

  const handleGrid = (e) => {
    e.preventDefault();
    if (!cardViewGridV) {
      dispatch(cardViewList());
      dispatch(cardViewGrid());
    }
  };

  return (
    <div className="tip-afisare-container">
      <div className="tip-afisare-head">Tip Afisare: </div>

      <div className="tip-afisare-body">
        <div
          className={`cards-view-list${cardViewListV ? " card-v2-list" : ""}`}
          onClick={handleList}
        >
          <button type="button">
            <i className="bi bi-list"></i>
          </button>
        </div>
        <div
          className={`cards-view-grid${cardViewGridV ? " card-v2-grid" : ""}`}
          onClick={handleGrid}
        >
          <button type="button">
            <i className="bi bi-grid-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipAfisare;
