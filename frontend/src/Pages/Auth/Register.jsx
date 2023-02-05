import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    //Redirect when logged in
    if (isSuccess || user) {
      navigate("http://localhost:3000/");
    }
    dispatch(reset());
  }, [isError, message, isSuccess, user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name,
        email,
        password,
      };
      dispatch(register(userData));
    }
  };

  return (
    <>
      <section>
        <h1>Register {user}</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label> Introdu numele </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="on"
              onChange={onChange}
              value={name}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label> Introdu email </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="on"
              onChange={onChange}
              value={email}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label> Introdu password </label>
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
          <div className="form-group">
            <label> Introdu password2 </label>
            <input
              type="password"
              id="password2"
              name="password2"
              onChange={onChange}
              value={password2}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button>Register</button>
        </form>
      </section>
    </>
  );
};

export default Register;