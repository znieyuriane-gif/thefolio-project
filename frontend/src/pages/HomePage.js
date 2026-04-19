import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

import m1 from "../images/m1.jpg";
import m2 from "../images/m2.jpg";
import m3 from "../images/m3.jpg";
import potManga from "../images/potManga.jpg";
import sololev from "../images/sololev.jpg";
import manhua from "../images/manhua.jpg";
import queen from "../images/queen.jpg";
import "../App.css";

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    API.get("/posts")
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (postId, e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post.");
    }
  };

  return (
    <div>
      <Header />
      <hr className="hori" />

      {/* Banner images */}
      <div className="images">
        <img src={m1} alt="Manga 1" />
        <img src={m2} alt="Manga 2" />
        <img src={m3} alt="Manga 3" />
      </div>

      {/* Hero section */}
      <section className="hero">
        <h2>Welcome To What Saved My Life</h2>
        <p>
          <span>W</span>elcome to my webpage, this page will introduce what saved
          my life and these are what I call "The Three Ms" which means Manga,
          Manhwa, and Manhua. These are something that I will be keeping and
          doing my entire life.
        </p>
      </section>

      <hr className="hori" />
      <div id="three-m">THE THREE Ms</div>
      <hr className="hori" />

      {/* Info section */}
      <section id="info">
        <div className="container">
          <h3>MANGA, MANHWA, and MANHUA</h3>
          <p>
            Manga, manhwa, and manhua are all types of comics from different countries.
            Manga is Japanese and usually read right to left, covering a wide range of genres.
            Manhwa is Korean, read left to right, often in digital webtoon format.
            Manhua comes from China, Taiwan, or Hong Kong, also read left to right.
          </p>
        </div>
        <div id="con-below">
          <p>Below there's one example each, these are few of the books I've read.</p>
        </div>
      </section>

      {/* Three Ms cards */}
      <div id="mmm-flex">
        <div className="the-mmm">
          <img src={potManga} className="img-border" alt="The Prince of Tennis" />
          <div className="text">
            <h4>The Prince of Tennis - Manga</h4>
            <p>Popular Japanese manga following tennis prodigy Ryoma Echizen.</p>
          </div>
        </div>

        <div className="the-mmm">
          <img src={sololev} className="img-border" alt="Solo Leveling" />
          <div className="text">
            <h4>Solo Leveling - Manhwa</h4>
            <p>South Korean webtoon about Sung Jinwoo, a hunter who levels up beyond human limits.</p>
          </div>
        </div>

        <div className="the-mmm">
          <img src={manhua} className="img-border" alt="The Real Daughter of The Qin Family" />
          <div className="text">
            <h4>The Real Daughter of The Qin Family - Manhua</h4>
            <p>Pei Yunge reclaims her rightful place after being wronged by her family.</p>
          </div>
        </div>
      </div>

      {/* Key highlights */}
      <div className="key"><p>Key highlights</p></div>
      <section className="highlights">
        <img src={queen} alt="butterfly" className="img-highlights" />
        <div className="highlights-txt">
          <ul>
            <li>Diverse Story Telling</li>
            <li>Digital Platform Accessibility</li>
            <li>Cultural Origins</li>
            <li>Unique Reading Formats</li>
          </ul>
        </div>
      </section>

      <hr className="hori" />
      <br></br>
      {/* Latest Posts */}
      <div className="home-page">
        <div className="posts-header">
          <h2>Latest Posts</h2>
          {user && (user.role === "member" || user.role === "admin") && (
            <Link to="/create-post" className="btn-primary">+ Write a Post</Link>
          )}
          {!user && (
            <p className="guest-msg">
              <Link to="/register">Register</Link> or <Link to="/login">Login</Link> to write a post.
            </p>
          )}
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet. Be the first to write one!</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => {
              const isOwner = user && post.author?._id === user._id;
              const isAdmin = user?.role === "admin";

              return (
                <div key={post._id} className="post-card">
                  {post.image && (
                    <img
                      src={`${API_BASE_URL}/uploads/${post.image}`}
                      alt={post.title}
                    />
                  )}
                  <h3>{post.title}</h3>
                  <p>{post.body.substring(0, 120)}...</p>
                  <small>
                    By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                  </small>

                  <div className="post-card-actions">
                    <Link to={`/posts/${post._id}`} className="post-card-btn post-card-view">
                      👁 View
                    </Link>
                    {(isOwner || isAdmin) && (
                      <Link to={`/edit-post/${post._id}`} className="post-card-btn post-card-edit">
                        ✏ Edit
                      </Link>
                    )}
                    {(isOwner || isAdmin) && (
                      <button
                        className="post-card-btn post-card-delete"
                        onClick={(e) => handleDelete(post._id, e)}
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
