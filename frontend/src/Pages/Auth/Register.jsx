import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import "./auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", password2: "",
  });
  const [showPass, setShowPass]   = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const { name, email, password, password2 } = formData;

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, isLoading, isError, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message || "A apărut o eroare. Încearcă din nou.");
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Parolele nu coincid.");
      return;
    }
    if (password.length < 6) {
      toast.error("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    dispatch(register({ name, email, password, role: "client" }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Cont nou</h1>
        <p className="auth-subtitle">Creează-ți contul gratuit</p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nume complet</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Ion Popescu"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="exemplu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Parolă</label>
            <div className="auth-pass-wrap">
              <input
                type={showPass ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Minim 6 caractere"
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye"
                onClick={() => setShowPass((v) => !v)} tabIndex={-1}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirmă parola</label>
            <div className="auth-pass-wrap">
              <input
                type={showPass2 ? "text" : "password"}
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                placeholder="Repetă parola"
                required
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye"
                onClick={() => setShowPass2((v) => !v)} tabIndex={-1}>
                {showPass2 ? "🙈" : "👁️"}
              </button>
            </div>
            {password2 && password !== password2 && (
              <span className="auth-field-err">Parolele nu coincid</span>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? "Se înregistrează…" : "Creează cont"}
          </button>
        </form>

        <p className="auth-link">
          Ai deja cont?{" "}
          <Link to="/auth/login">Conectează-te</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
