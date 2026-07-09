import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles/dark.css";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Header from "./Layouts/header/Header";
import ProductsList from "./Components/products/products/Products";
import AddProductForm from "./Components/products/add-card-item/addProductForm";
import AddCategory from "./Components/administrator/category/AddCategory";
import PrivateRoutes from "./Utils/PrivateRoutes";
import SingleProducts from "./Components/products/singleProducts/SingleProducts";
import NoMatch from "./Pages/NoMatch/NoMatch";
import AddToCart from "./Components/products/add-to-Cart/Add-to-Cart";
import Cards from "./Components/products/cards/Cards";
import "./Components/UI/html-Scrollbar/HtmlScrollbar.css";
import Checkout from "./Components/UI/checkout/Checkout";
import NavbarAux from "./Components/nav/navbar-aux/NavbarAux";
import Breadcrumb from "./Components/UI/Breadcrumb/Breadcrumb";
import Profile from "./Pages/Profile/Profile";
import ProfileInfo from "./Pages/Profile/ProfileInfo";
import ProfileOrders from "./Pages/Profile/ProfileOrders";
import ProfileAddress from "./Pages/Profile/ProfileAddress";
import ProfileSettings from "./Pages/Profile/ProfileSettings";
import Favorites from "./Pages/Favorites/Favorites";
import Footer from "./Layouts/footer/Footer";

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
          <Route exact path="products" element={<ProductsList />} />
          <Route exact path="cards" element={<Cards />} />
          <Route exact path="product">
            <Route path=":id" element={<SingleProducts />} />
          </Route>
          <Route path="/cart" element={<AddToCart />} />
          <Route path="/cart/checkout" element={<Checkout />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />}>
              <Route index element={<Navigate to="info" replace />} />
              <Route path="info"     element={<ProfileInfo />} />
              <Route path="orders"   element={<ProfileOrders />} />
              <Route path="address"  element={<ProfileAddress />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>
            <Route exact path="/add/product" element={<AddProductForm />} />
            <Route exact path="admin/adauga-categorii" element={<AddCategory />} />
          </Route>

          <Route path="/favorites" element={<Favorites />} />
          <Route exact path="/about" element={<About />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/product/*" element={<NoMatch />} />
        </Routes>
        </main>
        {/* </UserAuthProvider> */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
