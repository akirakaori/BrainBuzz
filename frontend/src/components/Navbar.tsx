import { NavLink } from "react-router-dom";
import { AuthContext, type IAuthContext } from "../App";
import { useContext, useState, useRef, useEffect } from "react";

function Navbar() {
  const { isAuth, roleState } = useContext<IAuthContext>(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand */}
          <div className="navbar-brand">
            <NavLink to="/" className="brand-link">
              <div className="brand-icon">🧠</div>
              <span className="brand-text">BrainBuxx</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-menu">
            <div className="navbar-nav">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                About
              </NavLink>
              
              {isAuth && (
                <>
                  <NavLink 
                    to="/questionset/list" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Quizzes
                  </NavLink>
                  {roleState === "admin" && (
                    <NavLink 
                      to="/admin/questionset/create" 
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      Create Quiz
                    </NavLink>
                  )}
                </>
              )}
            </div>

            {/* Auth Actions */}
            <div className="navbar-actions">
              {isAuth || localStorage.getItem("accessToken") ? (
                <div className="user-menu-container" ref={userMenuRef}>
                  <button 
                    className="user-menu-button nav-link"
                    onClick={toggleUserMenu}
                    aria-label="User menu"
                  >
                    <span>{roleState === "admin" ? "ADMIN" : "USER"}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="user-dropdown">
                      <NavLink 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={closeUserMenu}
                      >
                        👤 View Profile
                      </NavLink>
                      {roleState === "admin" && (
                        <NavLink 
                          to="/admin/questionset/create" 
                          className="dropdown-item"
                          onClick={closeUserMenu}
                        >
                          ➕ Create Quiz
                        </NavLink>
                      )}
                      <hr className="dropdown-divider" />
                      <button 
                        onClick={() => {
                          logoutHandler();
                          closeUserMenu();
                        }} 
                        className="dropdown-item logout-btn"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-links">
                  <NavLink to="/login" className="btn btn-secondary btn-sm">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn btn-primary btn-sm">
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav">
            <NavLink 
              to="/" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>
            
            {isAuth ? (
              <>
                <NavLink 
                  to="/questionset/list" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Quizzes
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
                {roleState === "admin" && (
                  <NavLink 
                    to="/admin/questionset/create" 
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Quiz
                  </NavLink>
                )}
                <div className="mobile-user-info">
                  <span className="user-badge">
                    {roleState === "admin" ? "Admin" : "User"}
                  </span>
                  <button 
                    onClick={() => {
                      logoutHandler();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="btn btn-danger btn-sm w-full"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="mobile-auth-actions">
                <NavLink 
                  to="/login" 
                  className="btn btn-secondary w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="btn btn-primary w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
