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

              {/* GUEST */}
              {!user && (
                <>
                  <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                    Contact
                  </NavLink>
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
                  <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                    Contact
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
                  <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
                    Contact
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
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="modal-btn-confirm" onClick={handleConfirmLogout}>
                Yes, Logout
              </button>
              <button className="modal-btn-cancel" onClick={handleCancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;