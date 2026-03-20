import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentErr, setCommentErr] = useState("");

  useEffect(() => {
    Promise.all([API.get(`/posts/${id}`), API.get(`/comments/${id}`)])
      .then(([postRes, commentRes]) => {
        setPost(postRes.data);
        setComments(commentRes.data);
      })
      .catch(() => setError("Post not found."))
      .finally(() => setLoading(false));
  }, [id]);

  // MEMBER or ADMIN: add comment
  const handleAddComment = async () => {
    if (!commentBody.trim()) { setCommentErr("Comment cannot be empty."); return; }
    setCommentErr("");
    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      setComments((prev) => [...prev, data]);
      setCommentBody("");
    } catch (err) {
      setCommentErr(err.response?.data?.message || "Failed to post comment.");
    }
  };

  // MEMBER (own comment) or ADMIN: delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment.");
    }
  };

  // MEMBER (own post) or ADMIN: delete post
  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post.");
    }
  };

  if (loading) return <><Header /><main className="container"><p style={{ padding: "3rem", fontStyle: "italic" }}>Loading post...</p></main><Footer /></>;
  if (error)   return <><Header /><main className="container"><p className="error-msg" style={{ padding: "2rem" }}>{error}</p></main><Footer /></>;

  const isOwner        = user && post.author?._id === user._id;
  const isAdmin        = user?.role === "admin";
  const isMemberOrAdmin = user && (user.role === "member" || user.role === "admin");

  return (
    <>
      <Header />
      <main className="container">

        {/* Post Content — GUEST, MEMBER, ADMIN: all can read */}
        <article className="card-warm" style={{ marginBottom: "30px" }}>
          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt={post.title}
              style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: "8px", margin: "0 0 20px" }}
            />
          )}

          <h2 style={{ fontFamily: "'Cinzel', serif", marginBottom: "10px" }}>{post.title}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "#6E3482", fontSize: "0.88rem" }}>
            {post.author?.profilePic && (
              <img
                src={`http://localhost:5000/uploads/${post.author.profilePic}`}
                alt=""
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", margin: 0 }}
              />
            )}
            <span>By <strong>{post.author?.name}</strong></span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{post.body}</div>

          {/* MEMBER (own post) or ADMIN: edit & delete buttons */}
          {(isOwner || isAdmin) && (
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <Link
                to={`/edit-post/${post._id}`}
                className="btn-primary"
                style={{ textDecoration: "none", padding: "8px 20px" }}
              >
                Edit
              </Link>
              <button
                className="btn-primary"
                onClick={handleDeletePost}
                style={{ background: "#c0392b" }}
              >
                Delete
              </button>
            </div>
          )}
        </article>

        {/* Comments Section */}
        <section className="card-warm">
          <h3 style={{ fontFamily: "'Cinzel', serif", marginBottom: "20px" }}>
            Comments ({comments.length})
          </h3>

          {comments.length === 0 && (
            <p style={{ fontStyle: "italic", color: "#A56ABD", marginBottom: "16px" }}>
              No comments yet. Be the first!
            </p>
          )}

          {comments.map((comment) => (
            <div key={comment._id} style={{ borderBottom: "1px solid #e8d5f5", paddingBottom: "14px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", color: "#6E3482" }}>
                  {comment.author?.profilePic && (
                    <img
                      src={`http://localhost:5000/uploads/${comment.author.profilePic}`}
                      alt=""
                      style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover", margin: 0 }}
                    />
                  )}
                  <strong>{comment.author?.name}</strong>
                  <span>· {new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>

                {/* MEMBER (own comment) or ADMIN: delete comment */}
                {user && (user._id === comment.author?._id || isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{ background: "transparent", border: "none", color: "#c0392b", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p style={{ marginTop: "6px" }}>{comment.body}</p>
            </div>
          ))}

          {/* MEMBER or ADMIN: comment box */}
          {isMemberOrAdmin ? (
            <div style={{ marginTop: "16px" }}>
              <label style={{ fontFamily: "'Cinzel', serif", fontSize: "0.85rem", fontWeight: 700 }}>
                Leave a Comment:
              </label>
              <textarea
                className="form-input"
                rows={3}
                style={{ width: "100%", marginTop: "8px" }}
                placeholder="Write your comment..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
              />
              {commentErr && <span className="error-msg">{commentErr}</span>}
              <button className="btn-primary" onClick={handleAddComment} style={{ marginTop: "8px" }}>
                Post Comment
              </button>
            </div>
          ) : (
            // GUEST: read comments only, prompted to login
            <p style={{ marginTop: "16px", fontStyle: "italic", color: "#6E3482" }}>
              <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to leave a comment.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PostPage;