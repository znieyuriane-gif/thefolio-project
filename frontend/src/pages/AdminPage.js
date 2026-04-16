import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tab, setTab] = useState("users");

  // ADMIN only — redirect anyone else
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/home");
      return;
    }
    API.get("/admin/users").then((r) => setUsers(r.data));
    API.get("/admin/posts").then((r) => setPosts(r.data));
    API.get("/admin/contacts").then((r) => setContacts(r.data)); // NEW
  }, [user, navigate]);

  // ADMIN: activate or deactivate a member
  const toggleStatus = async (id) => {
    const { data } = await API.put(`/admin/users/${id}/status`);
    setUsers(users.map((u) => (u._id === id ? data.user : u)));
  };

  // ADMIN: remove an inappropriate post
  const removePost = async (id) => {
    await API.put(`/admin/posts/${id}/remove`);
    setPosts(posts.map((p) => (p._id === id ? { ...p, status: "removed" } : p)));
  };

  return (
    <>
      <Header />
      <div className="admin-page">
        <h2>Admin Dashboard</h2>
        <p style={{ textAlign: "center", color: "#A56ABD", marginBottom: "20px", fontStyle: "italic" }}>
          Manage members, moderate posts, and view contact messages
        </p>

        <div className="admin-tabs">
          <button onClick={() => setTab("users")} className={tab === "users" ? "active" : ""}>
            Members ({users.length})
          </button>
          <button onClick={() => setTab("posts")} className={tab === "posts" ? "active" : ""}>
            All Posts ({posts.length})
          </button>
          <button onClick={() => setTab("contacts")} className={tab === "contacts" ? "active" : ""}>
            Contact Messages ({contacts.length})
          </button>
        </div>

        {/* ADMIN: view and toggle member active/inactive status */}
        {tab === "users" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>No members found.</td></tr>
              )}
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="status-badge published">{u.role}</span></td>
                  <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                  <td>
                    <button
                      onClick={() => toggleStatus(u._id)}
                      className={u.status === "active" ? "btn-danger" : "btn-success"}
                    >
                      {u.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ADMIN: view all posts and remove inappropriate ones */}
        {tab === "posts" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th><th>Author</th><th>Date</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>No posts found.</td></tr>
              )}
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.author?.name}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                  <td>
                    {p.status === "published" && (
                      <button className="btn-danger" onClick={() => removePost(p._id)}>Remove</button>
                    )}
                    {p.status === "removed" && (
                      <span style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}>Removed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ADMIN: view contact messages */}
        {tab === "contacts" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Message</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>No messages found.</td></tr>
              )}
              {contacts.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.message}</td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminPage;
