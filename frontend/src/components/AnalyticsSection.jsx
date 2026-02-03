import React from "react";
import "./AnalyticsSection.css";

function AnalyticsSection({ analytics }) {
  if (!analytics) return null;

  const rows = analytics.num_rows ?? analytics.n_rows ?? 0;
  const features = analytics.num_features ?? analytics.n_cols ?? 0;
  const missingRatio = analytics.total_missing_ratio ?? analytics.missing_ratio ?? 0;
  const heavyMissingness = analytics.heavyMissingness ?? analytics.missing_ratio>0.3 ?? analytics.total_missing_ratio>0.3 ??false;
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
            📊
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
            ✅
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
            📈
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
