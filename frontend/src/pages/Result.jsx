import { useLocation, Navigate } from "react-router-dom";
import AnalyticsSection from "../components/AnalyticsSection";
import ModelPlayground from "../components/ModelPlayground";
import DownloadSection from "../components/DownloadSection";
import "./Result.css";

function Result() {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const {
    dataset_id,
    problem_type,
    target_column,
    analytics,
    best_model,
    metrics,
    artifacts
  } = state;


  const isGuest = false;

  return (
    <div className="result-page">
      <div className="result-container">
        
        <div className="result-header">
          <div className="success-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Training Complete
          </div>
          <h1 className="result-title">Model Performance Report</h1>
          <p className="result-subtitle">
            Our model predicted the best performer for your dataset.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card highlight-card">
            <span className="stat-label">Recommended Model</span>
            <div className="stat-value-group">
              <svg className="model-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <span className="stat-value">{best_model}</span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Problem Type</span>
            <span className="stat-value capitalize">{problem_type}</span>
          </div>

          {metrics &&
            Object.entries(metrics).map(([key, value]) => (
              <div className="stat-card" key={key}>
                <span className="stat-label">{key.replace(/_/g, " ")}</span>
                <span className="stat-value metric-number">
                  {typeof value === "number" ? value.toFixed(4) : value}
                </span>
              </div>
            ))}
        </div>

        <hr className="divider" />

        {isGuest ? (
          <div className="locked-section">
            <div className="lock-icon-wrapper">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3>Unlock Full Analysis</h3>
            <p>
              Login to access detailed feature importance charts, the interactive model playground, 
              and download the trained .pkl artifacts.
            </p>
            <button className="btn-primary btn-lock-action">
              Login / Signup to Access
            </button>
          </div>
        ) : (
          <div className="detailed-analysis">
            <AnalyticsSection analytics={analytics} />
            <ModelPlayground
              datasetId={dataset_id}
              problemType={problem_type}
              targetColumn={target_column}
            />
            <DownloadSection datasetId={dataset_id} problemType={problem_type} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;