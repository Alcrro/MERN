import { Link } from "react-router-dom";

const ProductNotFound = () => (
  <div className="sp-page sp-err">
    <div className="sp-err-icon">🔍</div>
    <h2>Produsul nu a fost găsit</h2>
    <Link to="/products" className="sp-btn-primary">← Înapoi la produse</Link>
  </div>
);

export default ProductNotFound;
