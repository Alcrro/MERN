```sh
npm install @reduxjs/toolkit react-redux
```

# @reduxjs/toolkit

- redux (core Library, state management)
- immer (allows to mutate state,immutable state management)
- redux-thunk (handles async actions, middleware, allows to dispatch functions)
- reselect (simplifies reducer functions, memoization, caching, performance)

# REDUX CAN BE USED WITH ANY FRONTEND FRAMEWORK

# 1. SETUP STORE

- create store.js

  ```js
  import { configureStore } from "@reduxjs/toolkit";

  export const store = configureStore({
    reducer: {},
  });
  ```

# 2 Setup Provider

- index.js

  ```js
  import React from "react";
  import ReactDOM from "react-dom/client";
  import "./index.css";
  import App from "./App";
  //import store and Provider
  import { store } from "./store";
  import { Provider } from "react-redux";

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
  ```
