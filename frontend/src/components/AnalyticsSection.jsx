import React from "react";
import "./AnalyticsSection.css";

function AnalyticsSection({ analytics }) {
  if (!analytics) return null;

  const rows = analytics.num_rows ?? analytics.n_rows ?? 0;
  const features = analytics.num_features ?? analytics.n_cols ?? 0;
  const missingRatio = analytics.total_missing_ratio ?? analytics.missing_ratio ?? 0;
  const heavyMissingness = analytics.heavyMissingness ?? analytics.missing_ratio > 0.3 ?? analytics.total_missing_ratio > 0.3 ?? false;
  const skewness = analytics.avg_skew ?? analytics.mean_numeric_skewness ?? null;
  const classBalance = analytics.classBalance ?? analytics.imbalance_ratio ?? null;

  const formatPercent = (val) => {
    if (typeof val !== "number") return "0%";
    return `${(val * 100).toFixed(2)}%`;
  };

  return (
    <div className="analytics-container">
      <div className="section-header">
        <h3>Dataset Analytics</h3>
        <p className="section-desc">Technical breakdown of your data profile.</p>
      </div>

      <div className="analytics-grid">
        {/* Dataset Profile */}
        <div className="analytics-card">
          <div className="card-icon-bg blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
          <div className="card-content">
            <span className="card-label">Dataset Profile</span>
            <div className="metric-group">
              <div className="metric">
                <span className="metric-val">
                  {rows.toLocaleString()}
                </span>
                <span className="metric-key">Rows</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric">
                <span className="metric-val">{features}</span>
                <span className="metric-key">Features</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Quality */}
        <div className="analytics-card">
          <div className={`card-icon-bg ${heavyMissingness ? "red" : "green"}`}>
            {heavyMissingness ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            )}
          </div>
          <div className="card-content">
            <span className="card-label">Data Quality</span>
            <div className="quality-row">
              <span className="quality-val">
                {formatPercent(missingRatio)} <span className="text-muted">Missing Ratio</span>
              </span>
              <span className={`status-badge ${heavyMissingness ? "danger" : "success"}`}>
                {heavyMissingness ? "Heavy Loss" : "Clean"}
              </span>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="analytics-card">
          <div className="card-icon-bg purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="card-content">
            <span className="card-label">Distribution</span>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-name">Average Skewness</span>
                <span className="stat-number">
                  {typeof skewness === "number" ? skewness.toFixed(3) : "N/A"}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-name">Imbalance Ratio</span>
                <span className="stat-number" style={{ textTransform: "capitalize" }}>
                  {classBalance || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsSection;