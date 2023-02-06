import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";

import AddProduct from "../products/AddProduct";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="container-header">
      <div className="container-brand">
        <div className="brand-inner">
          <Link to="/" className="brand-logo">
            Alcrro
          </Link>
        </div>
      </div>
      <div className="container-menu">
        <div className="menu-inner">
          <ul>
            {user ? (
              <>
                <li>
                  <div className="link-addProduct">
                    <Link to="/add/product">Add Product</Link>
                  </div>
                </li>
                <li>
                  <div className="bun-venit">Bun venit, {user.name}</div>
                </li>
                <li>
                  <button className="btn" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/user/auth/login">Login</Link>
                </li>
                <li>
                  <Link to="/user/auth/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
