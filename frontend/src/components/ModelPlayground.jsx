import { useEffect, useState } from "react";
import { predict, getFeatures } from "../api/backend";
import "./ModelPlayground.css";

const CONFIDENCE_THRESHOLD = 0.6;

function ModelPlayground({ datasetId, problemType, targetColumn }) {
  const [features, setFeatures] = useState([]);
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

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

  const validateInputs = () => {
    const errors = {};

    features.forEach((f) => {
      const value = inputs[f.name];

      if (value === undefined || value === "" || value === null) {
        errors[f.name] = "This field is required";
        return;
      }

      if (f.type === "numeric") {
        const num = Number(value);
        if (Number.isNaN(num)) {
          errors[f.name] = "Must be a valid number";
          return;
        }
        if (f.min !== undefined && num < f.min) {
          errors[f.name] = `Minimum allowed is ${f.min}`;
          return;
        }
        if (f.max !== undefined && num > f.max) {
          errors[f.name] = `Maximum allowed is ${f.max}`;
          return;
        }
      }

      if (f.type === "categorical" && f.values) {
        if (!f.values.includes(value)) {
          errors[f.name] = "Invalid selection";
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function runPrediction() {
    if (features.length === 0) return;

    setHasSubmitted(true);
    setPrediction(null);
    setError(null);

    const isValid = validateInputs();
    if (!isValid) return;

    setLoading(true);

    try {
      const row = {};
      features.forEach((f) => {
        const v = inputs[f.name];
        row[f.name] = f.type === "numeric" ? Number(v) : v;
      });

      const res = await predict({
        datasetId,
        problemType,
        rows: [row],
      });

      if (res) {
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <div className="header-text">
          <h4>Model Playground</h4>
          <p>Real-time inference terminal.</p>
        </div>
      </div>

      <div className="playground-content">
        {features.length === 0 ? (
          <div className="empty-state">Waiting for features...</div>
        ) : (
          <div className="input-grid">
            {features.map((f) => {
              const hasError = hasSubmitted && validationErrors[f.name];
              return (
                <div key={f.name} className="pg-form-group">
                  <label>{f.name}</label>

                  {f.type === "numeric" ? (
                    <input
                      type="number"
                      className={`pg-input ${hasError ? "input-error" : ""}`}
                      min={f.min}
                      max={f.max}
                      placeholder={`e.g. ${f.example ?? ""}`}
                      value={inputs[f.name] ?? ""}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                    />
                  ) : (
                    <div className="pg-select-wrapper">
                      <select
                        className={`pg-input pg-select ${hasError ? "input-error" : ""}`}
                        value={inputs[f.name] ?? ""}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                      >
                        <option value="">Select Option</option>
                        {f.values?.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      <div className="pg-select-arrow">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {hasError && (
                    <div className="field-error">
                      {validationErrors[f.name]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="pg-actions">
          <button
            className="btn-predict"
            onClick={runPrediction}
            disabled={loading || features.length === 0}
          >
            {loading ? "Calculating..." : "Run Inference"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </div>

        {(prediction || error || loading) && (
          <div className={`result-terminal ${loading ? "pulse" : "visible"}`}>
            <span className="terminal-label">
              {targetColumn ? `OUTPUT: ${targetColumn}` : "OUTPUT"}
            </span>

            {loading ? (
              <span className="typing">Processing...</span>
            ) : error ? (
              <span className="error-text">{error}</span>
            ) : prediction?.probabilities ? (
              <>
                <div className="predicted-class">
                  Predicted: <strong>{prediction.prediction}</strong>
                </div>

                {(() => {
                  const maxProb = Math.max(...Object.values(prediction.probabilities));
                  return maxProb < CONFIDENCE_THRESHOLD ? (
                    <div className="confidence-warning">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Low Confidence ({(maxProb * 100).toFixed(1)}%)
                    </div>
                  ) : null;
                })()}

                <div className="probability-bars">
                  {Object.entries(prediction.probabilities).map(([label, prob]) => (
                    <div key={label} className="prob-row">
                      <div className="prob-header">
                        <span>{label}</span>
                        <span>{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="prob-bar-bg">
                        <div className="prob-bar-fill" style={{ width: `${prob * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="terminal-value">
                {typeof prediction.prediction === "number"
                  ? prediction.prediction.toFixed(4)
                  : prediction.prediction}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelPlayground;