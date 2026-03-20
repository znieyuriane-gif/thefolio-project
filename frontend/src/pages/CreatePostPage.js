import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreatePostPage = () => {
  const [title,        setTitle]        = useState('');
  const [body,         setBody]         = useState('');
  const [image,        setImage]        = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error,        setError]        = useState('');
  const [loading,      setLoading]      = useState(false);

  const { user } = useAuth(); // eslint-disable-line no-unused-vars

  const navigate  = useNavigate();

  // Handle image selection + show preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);
    if (user) {
      fd.append('author', user.id);   // or user._id / user.username depending on your backend
    }
    try {
      const { data } = await API.post('/posts', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data?._id) {
        navigate(`/posts/${data._id}`);
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error("Post creation failed:", err);
      setError(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container">
        <section className="card-warm" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "Georgia, serif" }}>Write a New Post</h2>
          <p>Share your thoughts, stories, or recommendations with the community.</p>
          {user && <p>Posting as <strong>{user.name}</strong></p>}
        </section>

        <section className="card-form">
          {error && <p className="error-msg" style={{ marginBottom: '12px' }}>{error}</p>}

          <form className="form-inner" style={{ paddingLeft: 0 }} onSubmit={handleSubmit}>

            {/* Title */}
            <div className="form-field">
              <label htmlFor="title">Post Title:</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="Give your post a title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Body */}
            <div className="form-field">
              <label htmlFor="body">Post Content:</label>
              <textarea
                id="body"
                className="form-input"
                placeholder="Write your post here..."
                rows={12}
                style={{ width: '100%' }}
                value={body}
                onChange={e => setBody(e.target.value)}
                required
              />
            </div>

            {/* Image upload — ALL users (members + admins) */}
            <div className="form-field">
              <label>Cover Image (optional):</label>

              {/* Image preview */}
              {imagePreview && (
                <div className="create-post-preview">
                  <img src={imagePreview} alt="Preview" className="create-post-preview-img" />
                  <button type="button" className="create-post-remove-img" onClick={handleRemoveImage}>
                    ✕ Remove Image
                  </button>
                </div>
              )}

              {/* Upload button */}
              {!imagePreview && (
                <label className="create-post-upload-label">
                  📎 Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </label>
              )}

              <span className="info-msg">JPG, PNG, GIF or WebP — max 5 MB</span>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>

          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CreatePostPage;