import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
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

const App = () => {
  return (
    <Router>
      <div className="fPage">
        <Header />
        <NavbarAux />
        {/* <UserAuthProvider> */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/user/auth" element={<Login />}>
            <Route exact path="login" element={<Login />} />
            <Route exact path="register" element={<Register />} />
          </Route>
          <Route exact path="products" element={<ProductsList />} />
          <Route exact path="cards" element={<Cards />} />
          <Route exact path="product">
            <Route path=":id" element={<SingleProducts />} />
          </Route>
          <Route path="/cart/products" element={<AddToCart />} />
          <Route path="/cart/checkout" element={<Checkout />} />

          <Route element={<PrivateRoutes />}>
            <Route exact path="/add/product" element={<AddProductForm />} />
            <Route exact path="admin/adauga-categorii" element={<AddCategory />} />
          </Route>

          <Route exact path="/about" element={<About />} />
          <Route path="*" element={<NoMatch />} />
          <Route path="/product/*" element={<NoMatch />} />
        </Routes>
        {/* </UserAuthProvider> */}
      </div>
    </Router>
  );
};

export default App;
