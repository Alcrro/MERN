import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

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
      email,
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
            <label> Introdu email: </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={onChange}
              value={email}
              required
              placeholder="Enter your email"
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
