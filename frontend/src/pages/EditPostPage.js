import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => {
        const post = res.data;
        // MEMBER: only owner can edit their own post
        // ADMIN: can edit any post
        if (post.author._id !== user?._id && user?.role !== "admin") {
          navigate("/home");
          return;
        }
        setTitle(post.title);
        setBody(post.body);
        setExistingImage(post.image);
      })
      .catch(() => setError("Post not found."))
      .finally(() => setFetching(false));
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("body", body);
    if (image) fd.append("image", image);

    try {
      await API.put(`/posts/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <>
      <Header />
      <main className="container"><p style={{ padding: "3rem", fontStyle: "italic" }}>Loading post...</p></main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="container">
        <section className="card-warm" style={{ marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "'Cinzel', serif" }}>Edit Post</h2>
          <p>Update your post details below.</p>
        </section>

        <section className="card-form">
          {error && <p className="error-msg" style={{ marginBottom: "12px" }}>{error}</p>}

          <form className="form-inner" style={{ paddingLeft: 0 }} onSubmit={handleSubmit}>

            <div className="form-field">
              <label htmlFor="title">Post Title:</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="Give your post a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="body">Post Content:</label>
              <textarea
                id="body"
                className="form-input"
                placeholder="Write your post here..."
                rows={12}
                style={{ width: "100%" }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            {/* Show existing image preview */}
            {existingImage && !image && (
              <div className="form-field">
                <label>Current Cover Image:</label>
                <img
                  src={`http://localhost:5000/uploads/${existingImage}`}
                  alt="Current cover"
                  style={{ maxWidth: "200px", borderRadius: "6px", marginTop: "6px" }}
                />
              </div>
            )}

            {/* ADMIN only: upload/replace cover image */}
            {user?.role === "admin" && (
              <div className="form-field">
                <label htmlFor="image">Replace Cover Image (Admin only):</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ marginTop: 6 }}
                />
                <span className="info-msg">JPG, PNG, GIF or WebP — max 5 MB</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ background: "#888" }}
                onClick={() => navigate(`/posts/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default EditPostPage;