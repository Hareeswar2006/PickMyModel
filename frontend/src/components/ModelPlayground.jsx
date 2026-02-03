import { useEffect, useState } from "react";
import { predict, getFeatures } from "../api/backend";
import "./ModelPlayground.css";

function ModelPlayground({ datasetId, problemType }) {
  const [features, setFeatures] = useState([]);
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFeatures() {
      try {
        const res = await getFeatures(problemType, datasetId);
        setFeatures(res.features || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load model features");
      }
    }

    if (datasetId && problemType) {
      loadFeatures();
    }
  }, [datasetId, problemType]);

  const handleChange = (name, value) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function runPrediction() {
    if (features.length === 0) return;

    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const row = {};
      features.forEach((f) => {
        const v = inputs[f.name];
        row[f.name] =
          v === undefined || v === ""
            ? null
            : f.type === "numeric"
            ? Number(v)
            : v;
      });

      const res = await predict({
        datasetId,
        problemType,
        rows: [row],
      });

      if (res?.prediction !== undefined) {
        setPrediction(res);
      } else {
        setError("Unexpected prediction format");
      }
    } catch (err) {
      console.error(err);
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="playground-container">
      <div className="playground-header">
        <div className="playground-icon-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div>
          <h4>Model Playground</h4>
          <p>Try real-time predictions with your trained model.</p>
        </div>
      </div>

      <div className="playground-content">
        {features.length === 0 ? (
          <div className="empty-state">
            <p>No features available.</p>
          </div>
        ) : (
          <div className="input-grid">
            {features.map((f) => (
              <div key={f.name} className="pg-form-group">
                <label>{f.name}</label>

                {f.type === "numeric" ? (
                  <input
                    className="pg-input"
                    type="number"
                    min={f.min}
                    max={f.max}
                    placeholder={`e.g. ${f.example || 0}`}
                    value={inputs[f.name] ?? ""}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  />
                ) : (
                  <div className="pg-select-wrapper">
                    <select
                      className="pg-input pg-select"
                      value={inputs[f.name] ?? ""}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                    >
                      <option value="">Select</option>
                      {f.values.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <div className="pg-select-arrow">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pg-actions">
          <button
            className="btn-predict"
            onClick={runPrediction}
            disabled={loading}
          >
            {loading ? "Calculating..." : "Run Prediction"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </div>

        {(prediction !== null || error) && (
          <div className="result-terminal visible">
            <span className="terminal-label">Output</span>
            <div className="terminal-value">
              {error ? (
                <span className="error-text">{error}</span>
              ) : (
                <>
                  <span className="success-dot"></span>
                  {typeof prediction === "object" ? (
                    <div style={{ width: "100%" }}>
                      <div className="predicted-class">
                        Predicted: <strong>{prediction.prediction}</strong>
                      </div>
                      {prediction.probabilities && (
                        <div className="probability-list">
                          {Object.entries(prediction.probabilities).map(
                            ([label, prob]) => (
                              <div key={label} className="prob-row">
                                <span className="prob-label">{label}</span>
                                <span className="prob-value">
                                  {(prob * 100).toFixed(2)}%
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>
                      {typeof prediction === "number"
                        ? prediction.toFixed(4)
                        : prediction}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelPlayground;