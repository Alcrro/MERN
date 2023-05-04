import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { productsApi } from "./features/products/productsApiSlice";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
