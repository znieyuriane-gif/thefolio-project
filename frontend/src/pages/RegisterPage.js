```jsx
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    let newErrors = {};
    let isValid = true;

    if (fullname.trim() === "") {
      newErrors.fullname = "Full name is required";
      isValid = false;
    }
    if (email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (password === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    if (confirmPassword === "") {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      await API.post("/auth/register", {
        name: fullname,
        email,
        password,
      });

      setFullname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      setSuccessMsg("Registration successful! You can now login.");
    } catch (err) {
      console.error("Register error:", err.response?.data);
      setErrorMsg(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }

  return (
    <div>
      <Header />
      <hr className="hori" />

      <div className="sign-up">
        <h2>SIGN UP!</h2>
        <p>Signing up in this website will let you know me deeper</p>
      </div>

      <hr className="hori" />
      <div className="regi-name">
        <h2>REGISTRATION FORM</h2>
      </div>

      <div className="regi-con">
        {errorMsg && (
          <p className="error-msg" style={{ textAlign: "center", marginBottom: "10px" }}>
            {errorMsg}
          </p>
        )}
        {successMsg && (
          <p style={{ textAlign: "center", marginBottom: "10px", color: "#27ae60", fontWeight: "bold" }}>
            {successMsg} <Link to="/login">Click here to Login</Link>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name: </label>
            <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
            <span className="error">{errors.fullname}</span>
          </div>

          <div>
            <label>Email: </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <span className="error">{errors.email}</span>
          </div>

          <div>
            <label>Password: </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <span className="error">{errors.password}</span>
          </div>

          <div>
            <label>Confirm Password: </label>
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
```