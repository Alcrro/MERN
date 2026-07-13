import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import "./auth.css";

const Login = () => {
  const [formData, setFormData]   = useState({ email: "", password: "" });
  const [showPass, setShowPass]   = useState(false);
  const { email, password }       = formData;

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, isLoading, isError, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Email sau parolă incorecte.");
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Bun venit!</h1>
        <p className="auth-subtitle">Conectează-te la contul tău</p>

        <form onSubmit={onSubmit}>
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
                placeholder="Parola ta"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? "Se conectează…" : "Conectează-te"}
          </button>
        </form>

        <p className="auth-link">
          Nu ai cont?{" "}
          <Link to="/auth/register">Înregistrează-te</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
