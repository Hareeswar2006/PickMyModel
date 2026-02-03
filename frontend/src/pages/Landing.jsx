import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="gradient-sphere sphere-1"></div>
      <div className="gradient-sphere sphere-2"></div>

      <div className="landing-card">
        <div className="landing-header">
          <span className="badge">AI-Powered Training</span>
          <h1 className="hero-title">
            Train Your Data <br />
            <span className="text-gradient">In Seconds.</span>
          </h1>
        </div>

        <p className="hero-description">
          Upload your dataset and let our intelligent engine recommend, validate,
          and train the best machine learning models for you automatically.
        </p>

        <div className="action-area">
          <button className="btn-primary" onClick={() => navigate("/upload")}>
            Try Once
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;