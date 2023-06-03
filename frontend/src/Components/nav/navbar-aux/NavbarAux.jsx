import React from "react";
import "./navbarAux.css";
import MegaMenu from "../../UI/megaMenu/MegaMenu";
import { Link, useLocation } from "react-router-dom";

const NavbarAux = () => {
  const location = useLocation();
  const loc = location.pathname;

  return (
    <>
      {loc === "/" ? (
        <nav className="nav navbar-aux-outer">
          <div className="container">
            <div className="navbar-aux-container">
              <div className="navbar-aux-body tick">
                <div className="navbar-aux-head">
                  <div className="navbar-aux-head-inner">
                    <span>Products</span>
                  </div>
                </div>

                <div className="navbar-box-inner">
                  <ul>
                    <li>
                      <Link to="#">Test 1</Link>
                      <Link to="#">Test 2</Link>
                      <Link to="#">Test 3</Link>
                      <Link to="#">Test 4</Link>
                      <Link to="#">Test 5</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="navbar-box-footer">
                <ul>
                  <li>
                    <Link to="#">Help</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="nav navbar-aux-outer">
          <div className="container">
            <div className="navbar-aux-container">
              <div className="navbar-aux-body">
                <div className="navbar-aux-head tick">
                  <div className="navbar-aux-head-inner tick">
                    <span>Products</span>
                  </div>
                </div>

                <div className="navbar-box-inner">
                  <ul>
                    <li>
                      <Link to="#">Test 1</Link>
                      <Link to="#">Test 2</Link>
                      <Link to="#">Test 3</Link>
                      <Link to="#">Test 4</Link>
                      <Link to="#">Test 5</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="navbar-box-footer">
                <ul>
                  <li>
                    <Link to="#">Help</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default NavbarAux;
