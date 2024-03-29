import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";

import "../header/header.css";
import { toast } from "react-toastify";
import AddToCartIcon from "../../Components/UI/add-to-cart-icon/AddToCartIcon";
import AddToCartModal from "../../Components/UI/add-to-cart-modal/AddToCartModal";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const activeClass = useSelector((state) => state.hoverLink.className);

  const onLogout = () => {
    dispatch(logout());
    toast.success("You have been logged out");
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="container-header">
      <div className="container-brand">
        <div className="brand-inner">
          <Link to="/" className="brand-logo">
            alcrro
          </Link>
        </div>
      </div>
      <div className="container-menu">
        <div className="menu-inner">
          <ul>
            <li className="products-cards">
              <Link to="/products">Products</Link>
            </li>

            <li
              className={`add-to-cart-li ${activeClass}`}
              // onMouseOver={handleMouseEnter}
              // onMouseOut={handleMouseLeave}
            >
              <Link to="/cart/products">
                <AddToCartIcon />
                <span>Cart</span>
              </Link>
              <AddToCartModal />
            </li>

            {user ? (
              <>
                <li className="user-profile">
                  <div className="bun-venit">
                    Bun venit, {user.name}
                    {user.isAdmin ? (
                      <div className="category-inner">
                        <ul>
                          <li>
                            <a href="/admin/adauga-categorii">Adauga Categorii</a>
                          </li>
                          <li className="add-products">
                            <div className="link-addProduct">
                              <Link to="/add/product">Add Product</Link>
                            </div>
                          </li>
                          {/* <li>
                            <a href="/">Adauga Categorii</a>
                          </li> */}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </li>
                <li>
                  <button className="btn btn-logout" onClick={onLogout}>
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
