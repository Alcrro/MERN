// How to use Redux Toolkit:
//Step 1: Install Redux Toolkit
//Step 2: Create a store
//Step 3: Create a reducer
//Step 4: Create an action
//Step 5: Create a selector
//Step 6: Create a component
//Step 7: Dispatch an action
//Step 8: Subscribe to the store
//Step 9: Use a selector
//Step 10: Use a selector with a component

//Create a folder with name store and a file with name store.js in src folder

//Step 1: Install Redux Toolkit
//need to import the configureStore function from the Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";

// create a store by calling store and passing in an object with a reducer property
// the reducer property will be set to the root reducer
// the root reducer is the result of calling combineReducers and passing in an object with all of the reducers
// the object with all of the reducers will be called the "reducer object"
// the reducer object will be passed to combineReducers
// the root reducer will be passed to configureStore
// the root reducer will be passed to the store
// the store will be passed to the Provider
// the Provider will be passed to the App

//Step 2: Create a store
const store = configureStore({
  reducer: userSlice.reducer,
});

// export the store
export default store;

//Step 3: Add store and Provider to App.js
//App.js
// import the store
// import the Provider from react-redux
// wrap the App in the Provider and pass in the store as a prop

import store from "./app/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <div className="App"></div>
    </Provider>
  );
}

//Create a folder with name features and a file with name userSlice.js in src folder
//import the createSlice function from the Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// create a slice by calling createSlice and passing in an object with the following properties:
// name: the name of the slice
// initialState: the initial state of the slice
// reducers: an object with all of the reducers
// the object with all of the reducers will be called the "reducer object"
// the reducer object will be passed to createSlice
// the root reducer will be passed to configureStore
// the root reducer will be passed to the store

const initialState = {
  value: {
    username: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

// export the reducer
// export the actions
export const { login, logout } = userSlice.actions;
// export default userSlice.reducer

//create login.jsx file in src folder
//import the useDispatch hook from react-redux
//import the login action from the userSlice
//import the useState hook from react
//import the useSelector hook from react-redux

import { useDispatch } from "react-redux";
import { login } from "../features/userSlice";
import { useState } from "react";
import { useSelector } from "react-redux";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(
      login({
        email,
        password,
      })
    );
  };

  return (
    <div>
      <form>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
