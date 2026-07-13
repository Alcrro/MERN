import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetSingleProductQuery, useGetProductBySkuQuery, useGetReviewsQuery } from "../../../features/product/rtkProducts";
import { useScrollSpy } from "./useScrollSpy";
import { TAB_KEYS } from "./singleProductConstants";
import { useAddProductToCart } from "./useAddProductToCart";
import { useBreadcrumbLabel } from "../../../hooks/useBreadcrumbLabel";
import SingleProductSkeleton from "./SingleProductSkeleton";
import ProductNotFound from "./ProductNotFound";
import ProductHero from "./ProductHero";
import ProductTabsNav from "./ProductTabsNav";
import ProductSections from "./ProductSections";
import SellerPicker from "../../vendor/shared/SellerPicker";
import VendorInfoBar from "./VendorInfoBar";
import ProductConfigurator from "../ProductConfigurator";
import "./singleProduct.css";

const SingleProducts = () => {
  const { id, sku }  = useParams();
  const authUser     = useSelector((s) => s.auth.user);
  const [selectedListing, setSelected] = useState(null);

  const { navRef, sectionRefs, activeTab, scrollTo } = useScrollSpy(TAB_KEYS);

  const { data: skuData, isLoading: skuLoad } = useGetProductBySkuQuery(sku,  { skip: !sku });
  const { data: idData,  isLoading: idLoad  } = useGetSingleProductQuery(id,   { skip: !!sku });

  const pd    = sku ? skuData : idData;
  const pLoad = sku ? skuLoad : idLoad;
  const productId = pd?.product?._id ?? id;

  const { data: rd, isLoading: rLoad } = useGetReviewsQuery(productId, { skip: !pd?.product });
  const { added, handleCart } = useAddProductToCart(selectedListing ?? pd?.product);

  const p           = pd?.product;
  const productName = p ? (p.model || p.name || p.brand) : null;
  useBreadcrumbLabel(productName);

  if (pLoad) return <SingleProductSkeleton />;
  if (!p) return <ProductNotFound />;

  const avg    = p.rating?.average ?? 0;
  const rcount = p.rating?.count ?? 0;

  return (
    <div className="sp-page">
      <ProductHero
        p={p} productName={productName} added={added}
        onAddToCart={handleCart} onScrollToReviews={() => scrollTo("recenzii")}
        listing={selectedListing}
      />
      {p.catalogRef
        ? <SellerPicker catalogRef={p.catalogRef} onSellerChange={setSelected} />
        : p.vendor?.shopName && <VendorInfoBar vendor={p.vendor} />
      }
      <ProductTabsNav navRef={navRef} activeTab={activeTab} scrollTo={scrollTo} rcount={rcount} />
      <ProductSections
        p={p} productName={productName} sectionRefs={sectionRefs}
        reviewData={{ reviews: rd?.reviews ?? [], isLoading: rLoad, authUser, productId, avg, rcount }}
      />
      <ProductConfigurator tip={p.tip} brand={p.brand} model={p.model} />
    </div>
  );
};

export default SingleProducts;
