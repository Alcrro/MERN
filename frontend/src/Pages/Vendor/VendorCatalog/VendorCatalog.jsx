import { useSearchParams } from "react-router-dom";
import VendorCatalogPanel from "../../../Components/vendor/catalog/VendorCatalogPanel";
import VendorProductForm  from "../../../Components/vendor/products/VendorProductForm";

const VendorCatalog = () => {
  const [params] = useSearchParams();
  if (params.get("view") === "add") return <VendorProductForm isEdit={false} />;
  return <VendorCatalogPanel />;
};

export default VendorCatalog;
