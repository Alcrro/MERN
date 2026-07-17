import { Link } from "react-router-dom";
import { useGetAddressesQuery } from "../../../features/address/rtkAddresses";
import "./SummaryAddressWidget.css";

const SummaryAddressWidget = () => {
  const { data, isLoading } = useGetAddressesQuery();
  const addr = (data?.addresses ?? []).find((a) => a.isDefault);

  return (
    <div className="sum-addr">
      <div className="sum-addr__header">
        <h3 className="sum-addr__title">Adresa implicită</h3>
        <Link to="/profile/address" className="sum-addr__link">Gestionează</Link>
      </div>

      {isLoading && <div className="sum-addr__skel" />}

      {!isLoading && !addr && (
        <div className="sum-addr__empty">
          <p>Nu ai o adresă salvată.</p>
          <Link to="/profile/address" className="sum-addr__cta">+ Adaugă adresă</Link>
        </div>
      )}

      {!isLoading && addr && (
        <div className="sum-addr__card">
          <span className="sum-addr__label-badge">{addr.label}</span>
          <p className="sum-addr__street">{addr.street}</p>
          <p className="sum-addr__city">{addr.city}, jud. {addr.county}, {addr.zip}</p>
          <p className="sum-addr__phone">{addr.phone}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryAddressWidget;
