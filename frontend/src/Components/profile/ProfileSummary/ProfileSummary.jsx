import { useSelector } from "react-redux";
import SummaryOrdersWidget from "../../molecules/SummaryOrdersWidget";
import SummaryAddressWidget from "../../molecules/SummaryAddressWidget";
import SummaryCardWidget from "../../molecules/SummaryCardWidget";
import SummaryPaymentWidget from "../../molecules/SummaryPaymentWidget";
import SummaryVendorWidget from "../../molecules/SummaryVendorWidget";
import "./ProfileSummary.css";

const ProfileSummary = () => {
  const { user } = useSelector((s) => s.auth);
  const firstName = user?.name?.split(" ")[0] ?? "tu";

  return (
    <div className="prf-summary">
      <div className="prf-summary__head">
        <h2 className="prf-summary__greeting">Bun venit, {firstName}</h2>
        <p className="prf-summary__sub">Contul tău la o privire</p>
      </div>

      {user?.role === "vendor" && <SummaryVendorWidget />}

      <div className="prf-summary__grid">
        <div className="prf-summary__col">
          <SummaryOrdersWidget />
          <SummaryAddressWidget />
        </div>
        <div className="prf-summary__col">
          <SummaryCardWidget />
          <SummaryPaymentWidget />
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
