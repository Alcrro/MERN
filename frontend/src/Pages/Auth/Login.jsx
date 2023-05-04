import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { login } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const { name, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    //Redirect when logged in
    if (isSuccess || user) {
      navigate("/");
      toast.success(message);
    }
  }, [isError, isSuccess, message, user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      password,
    };
    dispatch(login(userData));
  };

  return (
    <div className="container-login">
      <section>
        <h1>Login</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label> Introdu name: </label>
            <input
              type="name"
              id="name"
              name="name"
              onChange={onChange}
              value={name}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label> Introdu password: </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={onChange}
              value={password}
              required
              placeholder="Enter your password"
            />
          </div>

          <button>Login</button>
        </form>
      </section>
    </div>
  );
};

export default Login;
