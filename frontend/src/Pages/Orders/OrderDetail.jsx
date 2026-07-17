import { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../features/product/addToCart/addToCartSlice";
import { useGetOrderQuery } from "../../features/order/rtkOrders";
import OrderDetailPanel from "../../Components/organisms/OrderDetailPanel";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetOrderQuery(id);

  useEffect(() => {
    if (new URLSearchParams(search).get("payment") === "success") {
      dispatch(clearCart());
    }
  }, [search, dispatch]);

  if (isLoading) return (
    <div className="od-page">
      <div className="od-page__loader">Se încarcă comanda...</div>
    </div>
  );

  if (error) return (
    <div className="od-page">
      <div className="od-page__error">
        <p>Comanda nu a fost găsită sau nu ai acces.</p>
        <Link to="/profile/orders" className="od-page__back">← Comenzile mele</Link>
      </div>
    </div>
  );

  return (
    <div className="od-page">
      <Link to="/profile/orders" className="od-page__back">← Comenzile mele</Link>
      <OrderDetailPanel order={data.order} />
    </div>
  );
};

export default OrderDetail;
