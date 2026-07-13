import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetPublicVendorQuery } from "../../features/vendor/rtkVendor";
import VendorPageHeader from "../../Components/vendor/public/VendorPageHeader/VendorPageHeader";
import VendorPageProducts from "../../Components/vendor/public/VendorPageProducts/VendorPageProducts";
import VendorReviews from "../../Components/vendor/public/VendorReviews/VendorReviews";
import "./VendorPage.css";

const VendorNotFound = () => (
  <div className="vp-err">
    <p className="vp-err__icon">🏪</p>
    <h2>Vânzătorul nu a fost găsit</h2>
    <Link to="/products" className="vp-err__back">← Înapoi la produse</Link>
  </div>
);

const VendorPage = () => {
  const { vendorId } = useParams();
  const { data, isLoading, isError } = useGetPublicVendorQuery(vendorId, { skip: !vendorId });

  if (isError) return <div className="vp"><VendorNotFound /></div>;

  return (
    <div className="vp">
      <VendorPageHeader vendor={data?.vendor} isLoading={isLoading} />
      {!isLoading && data?.vendor && (
        <>
          <VendorPageProducts vendorId={vendorId} />
          <VendorReviews vendorId={vendorId} />
        </>
      )}
    </div>
  );
};

export default VendorPage;
