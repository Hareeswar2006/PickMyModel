import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Animated Background Elements */}
      <div className="gradient-sphere sphere-1"></div>
      <div className="gradient-sphere sphere-2"></div>
      <div className="noise-overlay"></div>

      <div className="landing-content">
        <div className="landing-header">
          <div className="badge-wrapper">
            <span className="badge">
              <span className="badge-dot"></span> AI-Powered AutoML
            </span>
          </div>
          
          <h1 className="hero-title">
            Train Your Data <br />
            <span className="text-gradient">In Seconds.</span>
          </h1>
        </div>

        <p className="hero-description">
          Upload your dataset and let our 
          intelligent engine recommend, validate, and train the best 
          machine learning models for you automatically.
        </p>

        <div className="action-area">
          <button className="btn-hero" onClick={() => navigate("/upload")}>
            Start Building Now
            <div className="btn-icon-bg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </button>
          
          <p className="helper-text">Free for research</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;