import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { setAuth } from "../services/auth";
import "./Auth.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErr(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      setAuth({
        user_id: res.data.user_id,
        role: res.data.role,
      });

      nav("/");
    } catch (ex: any) {
      const status = ex?.response?.status;
      const detail = ex?.response?.data?.detail;

      if (status === 401 || detail === "Invalid credentials") {
        setErr("Email sau parolă greșite"); // sau "Date de autentificare incorecte"
      } else {
        setErr(detail ?? "Eroare la autentificare");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Autentificare</h1>

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="auth-field">
          <label>Parolă</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {err && <div className="auth-error">{err}</div>}

        <button className="auth-btn" disabled={loading}>
          {loading ? "Se autentifică..." : "Login"}
        </button>

        <p className="auth-footer">
          Nu ai cont? <Link to="/register">Înregistrează-te</Link>
        </p>
      </form>
    </div>
  );
}
