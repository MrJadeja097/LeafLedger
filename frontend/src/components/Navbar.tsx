import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "navbar-link active" : "navbar-link";

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link to="/" className="navbar-brand" style={{ textDecoration: "none" }}>
          🌳 Leaf Ledger
        </Link>

      <div className="navbar-links">
        <Link to="/map" className={isActive("/map")}>
          🗺 Map
        </Link>
        {user && (
          <Link
            to="/dashboard"
            className={`${isActive("/dashboard")} hide-mobile`}
          >
            📊 Dashboard
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt="avatar"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "2px solid var(--color-green-primary)",
                }}
              />
            )}
            <span
              style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}
              className="hide-mobile"
            >
              {user.displayName}
            </span>
            <button
              onClick={logout}
              className="btn"
              style={{ 
                padding: "0.4rem 1rem", 
                fontSize: "0.85rem",
                background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                color: "#ffffff",
                border: "none",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                boxShadow: "0 4px 12px rgba(225, 29, 72, 0.3)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(225, 29, 72, 0.45)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(225, 29, 72, 0.3)";
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary"
            style={{
              padding: "0.4rem 1rem",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
