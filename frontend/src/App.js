import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Header from "./Components/header/Header";
import ProductsList from "./Components/products/Products";
import AddProductForm from "./Components/products/add-card-item/addProductForm";
import AddCategory from "./Components/administrator/category/AddCategory";
import PrivateRoutes from "./Utils/PrivateRoutes";
import SingleProduct from "./Components/products/singleProduct/SingleProductUI";
import FisaCalitate from "./Components/UI/FisaCalitate/FisaCalitate";

const App = () => {
  return (
    <Router>
      {/* <Header /> */}
      {/* <UserAuthProvider> */}
      <Routes>
        <Route exact path="/user/auth/login" element={<Login />}></Route>
        <Route exact path="/user/auth/register" element={<Register />}></Route>
        <Route exact path="/products" element={<ProductsList />}></Route>
        <Route exact path="/product/:slug" element={<SingleProduct />}></Route>
        <Route exact path="/fisa-calitate" element={<FisaCalitate />}></Route>

        <Route exact path="admin/adauga-categorii" element={<AddCategory />}></Route>
        <Route element={<PrivateRoutes />}>
          <Route exact path="/add/product" element={<AddProductForm />}></Route>
        </Route>

        <Route exact path="/about" element={<About />}></Route>
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
      {/* </UserAuthProvider> */}
    </Router>
  );
};

export default App;
