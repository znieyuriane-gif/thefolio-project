import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success"); // "success" | "error"

  // Redirect guests — only MEMBER and ADMIN can access
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // MEMBER & ADMIN: update name, bio, profile picture
  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("bio", bio);
    if (pic) fd.append("profilePic", pic);
    try {
      const { data } = await API.put("/auth/profile", fd);
      setUser(data);
      setMsgType("success");
      setMsg("Profile updated successfully!");
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Error updating profile.");
    }
  };

  // MEMBER & ADMIN: change password
  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.put("/auth/change-password", {
        currentPassword: curPw,
        newPassword: newPw,
      });
      setMsgType("success");
      setMsg("Password changed successfully!");
      setCurPw("");
      setNewPw("");
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Error changing password.");
    }
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : "/default-avatar.png";

  return (
    <>
      <Header />
      <div className="profile-page">
        <h2>My Profile</h2>

        {/* Role badge */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span className={`status-badge ${user?.role === "admin" ? "published" : "active"}`}
            style={{ fontSize: "13px", padding: "4px 14px" }}>
            {user?.role === "admin" ? "Admin" : "Member"}
          </span>
        </div>

        <img src={picSrc} alt="Profile" className="profile-pic-preview" />

        {msg && (
          <p className={msgType === "success" ? "success-msg" : "error-msg"}
            style={{ textAlign: "center", marginBottom: "12px" }}>
            {msg}
          </p>
        )}

        {/* MEMBER & ADMIN: edit profile */}
        <form onSubmit={handleProfile}>
          <h3>Edit Profile</h3>
          <label>Display Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
          />
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio..."
            rows={3}
          />
          <label>Change Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
          />
          <button type="submit">Save Profile</button>
        </form>

        {/* MEMBER & ADMIN: change password */}
        <form onSubmit={handlePassword}>
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current password"
            value={curPw}
            onChange={(e) => setCurPw(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;