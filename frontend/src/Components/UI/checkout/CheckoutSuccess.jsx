import { Link } from "react-router-dom";

const CheckoutSuccess = ({ order }) => (
  <div className="ck-page">
    <div className="ck-success">
      <div className="ck-success__icon">✓</div>
      <h2 className="ck-success__title">Comandă plasată!</h2>
      <p className="ck-success__ref">Ref. #{order._id.slice(-6).toUpperCase()}</p>
      <p className="ck-success__total">
        Total: {Number(order.totalPrice).toLocaleString("ro-RO")} RON
      </p>
      <p className="ck-success__info">
        Vei primi un email de confirmare. Poți urmări comanda din profilul tău.
      </p>
      <Link to="/products" className="ck-btn ck-btn--primary">Continuă cumpărăturile</Link>
    </div>
  </div>
);

export default CheckoutSuccess;
