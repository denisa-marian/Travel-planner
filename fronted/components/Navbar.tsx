import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../services/auth";
import {
  MapPin,
  Heart,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
  Moon,
} from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const auth = getAuth();

  const logout = () => {
    clearAuth();
    nav("/");
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const next =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
  };

  const navBtn = ({ isActive }: { isActive: boolean }) =>
    `nav-btn${isActive ? " nav-btn-active" : ""}`;

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <MapPin />
        <span>TravelPlanner</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" className={navBtn} end>
          <MapPin /> <span className="nav-text">Explorează</span>
        </NavLink>

        <NavLink to="/favorites" className={navBtn}>
          <Heart /> <span className="nav-text">Favorite</span>
        </NavLink>

        <NavLink to="/admin" className={navBtn}>
          <Shield /> <span className="nav-text">Admin</span>
        </NavLink>
      </div>

      <div className="nav-actions">
        <button className="nav-btn" onClick={toggleTheme}>
          <Moon />
        </button>

        {!auth ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav-btn nav-btn-outline${isActive ? " nav-btn-active" : ""}`
              }
            >
              <LogIn /> <span className="nav-text">Login</span>
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `nav-btn nav-btn-solid${isActive ? " nav-btn-active" : ""}`
              }
            >
              <UserPlus /> <span className="nav-text">Register</span>
            </NavLink>
          </>
        ) : (
          <button className="nav-btn nav-btn-solid" onClick={logout}>
            <LogOut /> <span className="nav-text">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
