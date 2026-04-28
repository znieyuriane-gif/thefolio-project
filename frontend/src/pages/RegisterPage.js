import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

import taeju from "../images/taeju.jpg";
import tgcf from "../images/tgcf.jpg";
import gojo from "../images/gojo.jpg";
import orv from "../images/orv.jpg";
import bomtoom from "../images/bomtoom.jpg";

function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ show: false, message: "", success: false });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let newErrors = {};
    let isValid = true;

    if (fullname.trim() === "") { newErrors.fullname = "Fullname is required"; isValid = false; }
    if (username.trim() === "") { newErrors.username = "Username is required"; isValid = false; }
    if (date === "") {
      newErrors.date = "Date of birth is required"; isValid = false;
    } else {
      let birthDate = new Date(date);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      let monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18) { newErrors.date = "You must be at least 18 years old"; isValid = false; }
    }
    if (email.trim() === "") { newErrors.email = "Email is required"; isValid = false; }
    else if (!isValidEmail(email)) { newErrors.email = "Invalid email format"; isValid = false; }
    if (password === "") { newErrors.password = "Password is required"; isValid = false; }
    else if (password.length < 8) { newErrors.password = "Password must be at least 8 characters"; isValid = false; }
    if (confirmPassword === "") { newErrors.confirmPassword = "Confirm password is required"; isValid = false; }
    else if (password !== confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; isValid = false; }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      await API.post("/auth/register", {
        name: fullname,
        email,
        password,
      });

      setFullname("");
      setUsername("");
      setDate("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      setModal({ show: true, message: "Registration Successful!!!", success: true });
    } catch (err) {
      console.error("Register error:", err.response?.data);
      setModal({
        show: true,
        message: err.response?.data?.message || "Registration failed. Please try again.",
        success: false,
      });
    }
  }

  function closeModal() {
    setModal({ show: false, message: "", success: false });
  }

  return (
    <div>
      <Header />
      <hr className="hori" />

      {/* MODAL */}
      {modal.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Notification</h3>
            <p>{modal.message}</p>
            {modal.success ? (
              <div className="modal-buttons">
                <Link to="/login">
                  <button className="modal-btn-cancel">Go to Login</button>
                </Link>
              </div>
            ) : (
              <div className="modal-buttons">
                <button className="modal-btn-cancel" onClick={closeModal}>OK</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="sign-up">
        <h2>SIGN UP!</h2>
        <p>Signing up in this website will let you know me deeper</p>
      </div>

      <hr className="hori" />
      <div className="regi-name">
        <h2>REGISTRATION FORM</h2>
      </div>

      <div className="regi-con">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Fullname: </label>
            <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
            <span className="error">{errors.fullname}</span>
          </div>

          <div>
            <label>Username: </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <span className="error">{errors.username}</span>
          </div>

          <div>
            <label>Date of Birth: </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <span className="error">{errors.date}</span>
          </div>

          <div>
            <label>Email: </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <span className="error">{errors.email}</span>
          </div>

          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className="error">{errors.password}</span>
          </div>

          <div>
            <label>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <span className="error">{errors.confirmPassword}</span>
          </div>

          <button type="submit" className="button">Register</button>
        </form>
      </div>

      <hr className="hori" />
      <div className="sign-up">
        <p>Once you sign-up you will know a brief of me.</p>
      </div>
      <hr className="hori" />

      <div id="con-images">
        <div className="item-grid"><img src={taeju} alt="img" /></div>
        <div className="item-grid"><img src={tgcf} alt="img" /></div>
        <div className="item-grid"><img src={gojo} alt="img" /></div>
        <div className="item-grid"><img src={orv} alt="img" /></div>
        <div className="item-grid"><img src={bomtoom} alt="img" /></div>
      </div>

      <Footer />
    </div>
  );
}

export default RegisterPage;