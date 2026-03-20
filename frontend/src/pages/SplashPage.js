import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import madea2 from "../images/madea2.jpg";
import "../App.css";

function SplashPage() {

  const navigate = useNavigate();
  const [dots, setDots] = useState("");

  useEffect(() => {

    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(dotInterval);
      navigate("/home");
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timer);
    };

  }, [navigate]);

  return (
    <div className="loader-body">
      <div className="loader-container">

        <div className="splash-logo">
          <img src={madea2} alt="Madea" />
        </div>

        <h1>What Saved My Life</h1>

        <div className="spinner"></div>

        <div className="loading-text">
          Loading{dots}
        </div>

      </div>
    </div>
  );
}

export default SplashPage;