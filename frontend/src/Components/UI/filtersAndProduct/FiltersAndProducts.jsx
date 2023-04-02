import "./productsv2.css";

const ProductsV2 = (props) => {
  // console.log(props.products);
  return (
    <div className="card">
      <div className="card-image">
        <img
          src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"
          alt="product"
          width={"100px"}
          height={"200px"}
        />
      </div>
      <div className="card-body">
        <div className="card-title">
          <h3>
            {props.products.description} ({props.products.memorieInterna})
          </h3>
        </div>
        <div className="card-rating">
          <span>Rating:{props.products.rating}</span>
        </div>
        <div className="card-price">
          <span>{props.products.price}</span>
        </div>
      </div>
      <div className="cart-button">
        <button type="button" className="btn btn-sm sort-control-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductsV2;
