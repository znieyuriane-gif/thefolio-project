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
  const [terms, setTerms] = useState(false);
  const [category, setCategory] = useState("");
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
    if (!terms) { newErrors.terms = "You must agree to the terms"; isValid = false; }
    if (!category) { newErrors.category = "Please select a category"; isValid = false; }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      await API.post("/auth/register", {
        name: fullname,
        email,
        password,
      });

      // Clear all fields
      setFullname("");
      setUsername("");
      setDate("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTerms(false);
      setCategory("");
      setErrors({});

      // Stay on page — show success with link to login
      setSuccessMsg("Registration successful! You can now login.");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
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

          <div className="terms-group">
            <label className="terms-label">
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              <p>I Agree to the Terms</p>
            </label>
            <span className="error1">{errors.terms}</span>
          </div>

          <div className="category-section">
            <p>What Category Are You Interested?</p>
          </div>
          <div className="category-group">
            <label>
              <input type="radio" name="category" value="manga" checked={category === "manga"} onChange={(e) => setCategory(e.target.value)} />
              Manga
            </label>
            <label>
              <input type="radio" name="category" value="manhwa" checked={category === "manhwa"} onChange={(e) => setCategory(e.target.value)} />
              Manhwa
            </label>
            <label>
              <input type="radio" name="category" value="manhua" checked={category === "manhua"} onChange={(e) => setCategory(e.target.value)} />
              Manhua
            </label>
          </div>
          <span className="error1">{errors.category}</span>

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