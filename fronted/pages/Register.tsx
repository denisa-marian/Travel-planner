import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

export default function Register() {
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setErr(null);

    if (firstName.trim().length < 2) return setErr("Numele este prea scurt");
    if (lastName.trim().length < 2) return setErr("Prenumele este prea scurt");
    if (!email.trim()) return setErr("Email obligatoriu");
    if (password.length < 8) return setErr("Parola minim 8 caractere");
    if (password !== confirm) return setErr("Parolele nu coincid");
    if (!agree) return setErr("Acceptă termenii și condițiile");

    try {
      setLoading(true);

      await api.post("/auth/register", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
      });

      nav("/login");
    } catch (ex: any) {
      setErr(ex?.response?.data?.detail ?? "Eroare la înregistrare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Creează cont</h1>

        <div className="auth-grid">
          <div className="auth-field">
            <label>Nume</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label>Prenume</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

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
          <label>Parolă (minim 8 caractere)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="auth-field">
          <label>Confirmă parola</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <label className="auth-check">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            disabled={loading}
          />
          <span>Sunt de acord cu termenii</span>
        </label>

        {err && <div className="auth-error">{err}</div>}

        <button className="auth-btn" disabled={loading}>
          {loading ? "Se creează contul..." : "Register"}
        </button>

        <p className="auth-footer">
          Ai deja cont? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
