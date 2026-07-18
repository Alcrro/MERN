import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles/dark.css";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Header from "./Layouts/header/Header";
import ProductsList from "./Components/products/products/Products";
import ProductsDiscover from "./Pages/ProductsDiscover/ProductsDiscover";
import PrivateRoutes from "./utils/PrivateRoutes";
import SingleProducts from "./Components/products/singleProducts/SingleProducts";
import NoMatch from "./Pages/NoMatch/NoMatch";
import AddToCart from "./Components/products/add-to-Cart/Add-to-Cart";
import Cards from "./Components/products/cards/Cards";
import "./Components/UI/html-Scrollbar/HtmlScrollbar.css";
import Checkout from "./Components/UI/checkout/Checkout";
import NavbarAux from "./Components/nav/navbar-aux/NavbarAux";
import Breadcrumb from "./Components/UI/Breadcrumb/Breadcrumb";
import Profile from "./Pages/Profile/Profile";
import ProfileInfo from "./Components/profile/ProfileInfo";
import ProfileOrders from "./Components/profile/ProfileOrders";
import ProfileAddress from "./Components/profile/ProfileAddress";
import ProfileSettings from "./Components/profile/ProfileSettings";
import Favorites from "./Pages/Favorites/Favorites";
import Footer from "./Layouts/footer/Footer";
import VendorApply from "./Pages/Vendor/VendorApply/VendorApply";
import VendorDashboard from "./Pages/Vendor/VendorDashboard/VendorDashboard";
import VendorOverview from "./Components/vendor/dashboard/VendorOverview";
import VendorProductsPanel from "./Components/vendor/products/VendorProductsPanel";
import VendorProductForm from "./Components/vendor/products/VendorProductForm";
import VendorOrdersPanel from "./Components/vendor/dashboard/VendorOrdersPanel";
import VendorAnalyticsPanel from "./Components/vendor/dashboard/VendorAnalyticsPanel";
import VendorCatalog from "./Pages/Vendor/VendorCatalog/VendorCatalog";
import VendorProfilePanel from "./Components/vendor/dashboard/VendorProfilePanel";
import VendorVouchersPanel from "./Components/vendor/dashboard/VendorVouchersPanel";
import AdminDashboard from "./Pages/Admin/AdminDashboard/AdminDashboard";
import AdminOverview from "./Pages/Admin/AdminDashboard/AdminOverview";
import AdminListings from "./Pages/Admin/AdminListings/AdminListings";
import AdminCatalogPanel from "./Components/administrator/catalog/CatalogAdmin";
import AdminVendors from "./Pages/Admin/AdminVendors/AdminVendors";
import AdminCategories from "./Pages/Admin/AdminCategories/AdminCategories";
import AdminOrders from "./Pages/Admin/AdminOrders/AdminOrders";
import VendorPage from "./Pages/VendorPage/VendorPage";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Terms from "./Pages/Terms";
import GDPR from "./Pages/GDPR";
import CookieBanner from "./Components/CookieBanner";
import OrderDetail from "./Pages/Orders/OrderDetail";
import ShopCardPage from "./Pages/ShopCard/ShopCard";
import ProfilePaymentMethods from "./Components/profile/ProfilePaymentMethods/ProfilePaymentMethods";
import ProfileSummary from "./Components/profile/ProfileSummary";
import ProfileVouchers from "./Components/profile/ProfileVouchers";

const App = () => {
  return (
    <Router>
      <div className="fPage">
        <Header />
        <NavbarAux />
        <Breadcrumb />
        {/* <UserAuthProvider> */}
        <main className="app-main">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="products" element={<ProductsDiscover />} />
          <Route path="products/:categorySlug" element={<ProductsList />} />
          <Route path="products/:categorySlug/:tipSlug" element={<ProductsList />} />
          <Route exact path="cards" element={<Cards />} />
          <Route exact path="product">
            <Route path=":slug/:sku" element={<SingleProducts />} />
            <Route path=":id" element={<SingleProducts />} />
          </Route>
          <Route path="/cart" element={<AddToCart />} />
          <Route path="/cart/checkout" element={<Checkout />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />}>
              <Route index element={<ProfileSummary />} />
              <Route path="info"     element={<ProfileInfo />} />
              <Route path="orders"   element={<ProfileOrders />} />
              <Route path="address"  element={<ProfileAddress />} />
              <Route path="my-card"          element={<ShopCardPage />} />
              <Route path="payment-methods" element={<ProfilePaymentMethods />} />
              <Route path="vouchers"        element={<ProfileVouchers />} />
              <Route path="settings"        element={<ProfileSettings />} />
            </Route>
            <Route path="admin/dashboard" element={<AdminDashboard />}>
              <Route index element={<AdminOverview />} />
              <Route path="listings"   element={<AdminListings />} />
              <Route path="catalog"    element={<AdminCatalogPanel />} />
              <Route path="vendors"    element={<AdminVendors />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders"     element={<AdminOrders />} />
            </Route>
          </Route>

          <Route path="/vendor/apply" element={<VendorApply />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />}>
            <Route index element={<VendorOverview />} />
            <Route path="products" element={<VendorProductsPanel />} />
            <Route path="products/:id/edit" element={<VendorProductForm isEdit={true} />} />
            <Route path="orders" element={<VendorOrdersPanel />} />
            <Route path="analytics" element={<VendorAnalyticsPanel />} />
            <Route path="catalog" element={<VendorCatalog />} />
            <Route path="vouchers" element={<VendorVouchersPanel />} />
            <Route path="profile" element={<VendorProfilePanel />} />
          </Route>

          <Route path="/vendor/:vendorId" element={<VendorPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route exact path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/product/*" element={<NoMatch />} />
        </Routes>
        </main>
        {/* </UserAuthProvider> */}
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
};

export default App;
