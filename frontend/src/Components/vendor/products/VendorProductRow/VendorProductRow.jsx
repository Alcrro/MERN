import { useNavigate } from "react-router-dom";
import { useDeleteVendorProductMutation } from "../../../../features/vendor/rtkVendor";
import ListingStatusBadge from "../../shared/ListingStatusBadge";
import "./VendorProductRow.css";

const VendorProductRow = ({ product }) => {
  const navigate = useNavigate();
  const [deleteProduct, { isLoading }] = useDeleteVendorProductMutation();
  const name = product.model || product.title || product.name || product.brand;

  const handleDelete = async () => {
    if (!window.confirm(`Ștergi "${name}"?`)) return;
    await deleteProduct(product._id);
  };

  return (
    <div className="vpr">
      {product.images?.[0] && (
        <img className="vpr__img" src={product.images[0]} alt={name} />
      )}
      <div className="vpr__info">
        <span className="vpr__name">{name}</span>
        <span className="vpr__brand">{product.brand}</span>
        <span className="vpr__kind">{product.kind}</span>
      </div>
      <div className="vpr__meta">
        <span className="vpr__price">{product.price} RON</span>
        <span className="vpr__qty">Stoc: {product.stock?.quantity ?? 0}</span>
      </div>
      <ListingStatusBadge status={product.listingStatus} reason={product.rejectionReason} />
      <div className="vpr__actions">
        <button
          type="button"
          className="vpr__btn vpr__btn--edit"
          onClick={() => navigate(`/vendor/dashboard/products/${product._id}/edit`)}
        >
          Editează
        </button>
        <button
          type="button"
          className="vpr__btn vpr__btn--delete"
          onClick={handleDelete}
          disabled={isLoading}
        >
          Șterge
        </button>
      </div>
    </div>
  );
};

export default VendorProductRow;
