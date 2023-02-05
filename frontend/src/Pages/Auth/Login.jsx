import React, { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const Login = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log(response);
    //Check empty fields
  };

  return (
    <>
      <section>
        <form onSubmit={Login}>
          <div className="form-group">
            <label> Introdu email </label>
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

          <button>Login</button>
        </form>
      </section>
    </>
  );
};

export default Login;
