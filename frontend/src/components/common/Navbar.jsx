import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="navbar-brand"
        aria-label="Classroom Management home"
      >
        <span className="navbar-brand-mark">CM</span>
        <span>Classroom Management</span>
      </Link>

      {user && (
        <div className="navbar-actions">
          <div className="navbar-user">
            <strong>{user.name}</strong>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;