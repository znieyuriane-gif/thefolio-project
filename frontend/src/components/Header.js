import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Theme from "../components/Theme";
import logo from "../images/madea2.jpg";
import "../App.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => setShowModal(true);

  const handleConfirmLogout = () => {
    setShowModal(false);
    logout();
    navigate("/login");
  };

  const handleCancelLogout = () => setShowModal(false);

  return (
    <>
      <header>
        <div className="header">
          <div className="head-logo">
            <img src={logo} alt="logo" className="logo" />
            <h1>What Saved My Life</h1>
          </div>

          <div className="nav-wrapper">
            <nav className="menu">

              {/* ALL ROLES: always visible */}
              <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                About
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                Contact
              </NavLink>

              {/* GUEST */}
              {!user && (
                <>
                  <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                    Register
                  </NavLink>
                  <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                    Login
                  </NavLink>
                </>
              )}

              {/* MEMBER */}
              {user && user.role === "member" && (
                <>
                  <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
                    Posts
                  </NavLink>
                  <NavLink to="/create-post" className={({ isActive }) => (isActive ? "active" : "")}>
                    Write Post
                  </NavLink>
                  <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                    Profile
                  </NavLink>
                  <button onClick={handleLogoutClick} className="logout-btn">
                    Logout
                  </button>
                </>
              )}

              {/* ADMIN */}
              {user && user.role === "admin" && (
                <>
                  <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
                    Posts
                  </NavLink>
                  <NavLink to="/create-post" className={({ isActive }) => (isActive ? "active" : "")}>
                    Write Post
                  </NavLink>
                  <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                    Profile
                  </NavLink>
                  <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                    Admin
                  </NavLink>
                  <button onClick={handleLogoutClick} className="logout-btn">
                    Logout
                  </button>
                </>
              )}

            </nav>
            <Theme />
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="logout-overlay" onClick={handleCancelLogout}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="logout-title">Leaving so soon?</h3>
            <p className="logout-subtitle">
              Hi <strong>{user?.name}</strong>, are you sure you want to logout?
            </p>
            <div className="logout-actions">
              <button className="logout-confirm-btn" onClick={handleConfirmLogout}>
                Yes, Logout
              </button>
              <button className="logout-cancel-btn" onClick={handleCancelLogout}>
                Stay
              </button>
            </div>
            <button className="logout-close" onClick={handleCancelLogout}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;