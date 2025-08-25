import { NavLink } from "react-router-dom";
import { AuthContext, type IAuthContext } from "../App";
import { useContext, useState } from "react";

// NEW: A user icon for the logged-in view
const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#a259ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#a259ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function Navbar() {
  const { isAuth, roleState } = useContext<IAuthContext>(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Note: We no longer need isUserMenuOpen or userMenuRef logic

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand */}
          <div className="navbar-brand">
            <NavLink to="/" className="brand-link">
              {isAuth ? <UserIcon /> : <div className="brand-icon">🧠</div>}
              <span className="brand-text">BrainBuxx</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-menu">
            <div className="navbar-nav"  >
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ margin: '10px' }}>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
              
              {isAuth && (
                <>
                  <NavLink to="/questionset/list" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ margin: '10px' }}>Quizzes</NavLink>
                  {roleState === "admin" && (
                    <NavLink to="/admin/questionset/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Create Quiz</NavLink>
                  )}
                </>
              )}
            </div>

            {/* Auth Actions: This is where the main change happens */}
            <div className="navbar-actions">
              {isAuth ? (
                // === KEY CHANGE: LOGGED-IN VIEW ===
                // The dropdown is gone. "Profile" and "Logout" are now direct links/buttons.
                <>
                  <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ marginTop: '8px' }}>Profile</NavLink>
                  <button onClick={logoutHandler} className="navbar-logout-btn">Logout</button>
                </>
              ) : (
                // Logged-out view (no changes)
                <div className="auth-links">
                  <NavLink to="/login" className="btn btn-secondary btn-sm">Login</NavLink>
                  <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation (no changes needed here, it already works as requested) */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav">
            <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
            
            {isAuth ? (
              <>
                <NavLink to="/questionset/list" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Quizzes</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Profile</NavLink>
                {roleState === "admin" && (
                  <NavLink to="/admin/questionset/create" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Create Quiz</NavLink>
                )}
                <div className="mobile-user-info">
                  <span className="user-badge">{roleState === "admin" ? "Admin" : "User"}</span>
                  <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="btn btn-danger btn-sm w-full">Logout</button>
                </div>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <NavLink to="/login" className="btn btn-secondary w-full" onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink>
                <NavLink to="/register" className="btn btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;