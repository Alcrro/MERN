import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Header from "./Components/header/Header";
import Products from "./Components/products/Products";
import AddProduct from "./Components/products/AddProduct";
import AddProductForm from "./Components/products/add-card-item/addProductForm";

const App = () => {
  return (
    <Router>
      <Header />
      {/* <UserAuthProvider> */}
      <Routes>
        <Route exact path="/user/auth/login" element={<Login />}></Route>
        <Route exact path="/user/auth/register" element={<Register />}></Route>
        <Route exact path="/products" element={<Products />}></Route>

        <Route exact path="/add/product" element={<AddProductForm />}></Route>

        <Route exact path="/about" element={<About />}></Route>
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
      {/* </UserAuthProvider> */}
      <ToastContainer />
    </Router>
  );
};

export default App;
