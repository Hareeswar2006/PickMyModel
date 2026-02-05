import React from "react";
import "./DownloadSection.css";

function DownloadSection({ datasetId, problemType }) {
  if (!datasetId || !problemType) return null;

  const API_BASE = "https://pickmymodel.onrender.com";

  return (
    <div className="downloads-container">
      <div className="section-header">
        <h3>Training Artifacts</h3>
        <p className="section-desc">
          Download your final trained model and the preprocessed dataset.
        </p>
      </div>

      <div className="artifacts-grid">
        
        {/* MODEL CARD */}
        <div className="artifact-card">
          <div className="artifact-icon-wrapper model-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="artifact-content">
            <h5 className="artifact-title">Trained Model</h5>
            <p className="artifact-meta">.pkl Format • Optimized</p>
          </div>
          <a
            href={`${API_BASE}/download/${datasetId}/model?problem_type=${problemType}`}
            className="btn-download primary"
            download
          >
            Download Model
          </a>
        </div>

        {/* DATASET CARD */}
        <div className="artifact-card">
          <div className="artifact-icon-wrapper csv-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <div className="artifact-content">
            <h5 className="artifact-title">Processed Data</h5>
            <p className="artifact-meta">.csv Format • Cleaned</p>
          </div>
          <a
            href={`${API_BASE}/download/${datasetId}/dataset?problem_type=${problemType}`}
            className="btn-download"
            download
          >
            Download CSV
          </a>
        </div>
        
      </div>
    </div>
  );
}

export default DownloadSection;