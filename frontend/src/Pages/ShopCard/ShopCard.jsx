import { useSelector } from "react-redux";
import { useGetMyCardQuery } from "../../features/shopCard/rtkShopCard";
import ShopCardHero from "../../Components/organisms/ShopCardHero";
import CreditPackages from "../../Components/organisms/CreditPackages";
import PointsConverter from "../../Components/organisms/PointsConverter";
import CardTransactions from "../../Components/organisms/CardTransactions";
import ReferralPanel from "../../Components/organisms/ReferralPanel";
import "./ShopCard.css";

const ShopCard = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetMyCardQuery();

  if (isLoading) return <div className="shop-card-page__loading">Se încarcă cardul…</div>;

  const card = data?.data;
  if (!card) return <div className="shop-card-page__loading">Cardul tău va fi disponibil în câteva momente.</div>;

  return (
    <div className="shop-card-page">
      <ShopCardHero card={card} userName={user?.name ?? ""} />
      <CreditPackages />
      <div className="shop-card-page__bottom">
        <PointsConverter availablePoints={card.points} />
        <ReferralPanel referralCode={card.referralCode} hasUsedReferral={card.hasUsedReferral} />
      </div>
      <CardTransactions />
    </div>
  );
};

export default ShopCard;
