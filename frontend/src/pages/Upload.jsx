import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Papa from "papaparse";
import ValidationPanel from "../components/ValidationPanel";
import { uploadDataset, validateDataset, analyzeDataset } from "../api/backend";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [problemType, setProblemType] = useState("");
  const [targetColumn, setTargetColumn] = useState("");
  const [tmpPath, setTmpPath] = useState(null);

  const [validationMessages, setValidationMessages] = useState([]);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const [columns, setColumns] = useState([]);
  const [columnTypes, setColumnTypes] = useState({});

  const hasErrors = validationMessages.some((m) => m.type === "error");
  const hasWarnings = validationMessages.some((m) => m.type === "warning");

  const resetValidation = () => {
    setIsValidated(false);
    setValidationMessages([]);
    setUserConfirmed(false);
  };

  const handleFileChange = (uploadedFile) => {
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    resetValidation();
    setTargetColumn("");
    setColumns([]);
    setColumnTypes({});

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fields = results.meta.fields || [];
        const sampleRow = results.data[0] || {};

        const inferredTypes = {};
        fields.forEach((col) => {
          const val = sampleRow[col];
          inferredTypes[col] =
            val !== undefined &&
            val !== "" &&
            !isNaN(Number(val))
              ? "numeric"
              : "categorical";
        });

        setColumns(fields);
        setColumnTypes(inferredTypes);
      },
      error: (err) => {
        setValidationMessages([{ type: "error", message: "Failed to parse CSV file." }]);
      }
    });
  };

  async function runValidator() {
    if (!file || !problemType || !targetColumn) {
      setValidationMessages([
        {
          type: "error",
          message: "File, problem type, and target column are required."
        }
      ]);
      return;
    }

    setLoading(true);
    setValidationMessages([]);
    setUserConfirmed(false);
    setIsValidated(false);

    try {
      const uploadRes = await uploadDataset(file);
      setTmpPath(uploadRes.tmp_path);

      const validateRes = await validateDataset({
        tmpPath: uploadRes.tmp_path,
        problemType,
        targetColumn
      });

      if (validateRes.status === "error") {
        setValidationMessages(
          validateRes.errors.map((e) => ({
            type: "error",
            message: e
          }))
        );
        return;
      }

      if (validateRes.status === "warning") {
        setValidationMessages(
          validateRes.warnings.map((w) => ({
            type: "warning",
            message: w
          }))
        );
        setIsValidated(true);
        return;
      }

      if (validateRes.status === "ok") {
        setValidationMessages([
          {
            type: "success",
            message:
              validateRes.message ||
              "Validation successful! You can proceed with analyzing."
          }
        ]);
        setIsValidated(true);
      }
    } catch (err) {
      setValidationMessages([
        {
          type: "error",
          message: err?.message || "Unexpected error occurred"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    if (!tmpPath) return;

    setLoading(true);

    try {
      const result = await analyzeDataset({
        tmpPath,
        problemType,
        targetColumn,
        isGuest: false
      });

      navigate("/result", { state: { ...result, target_column: targetColumn } });
    } catch (err) {
      setValidationMessages([
        {
          type: "error",
          message: err?.message || "Analysis failed"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-card">
        <div className="card-header">
          <h2>Configure Dataset</h2>
          <p className="card-subtitle">Upload your CSV and define your target.</p>
        </div>

        <div className="form-group file-group">
          <input
            id="dataset-file"
            name="dataset-file"
            type="file"
            accept=".csv"
            className="file-input-hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <label htmlFor="dataset-file" className={`file-drop-zone ${file ? "has-file" : ""}`}>
            <div className="icon-wrapper">
              {file ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              )}
            </div>
            <div className="file-info">
              <span className="file-name">{file ? file.name : "Click to Upload CSV"}</span>
              <span className="file-hint">{file ? "Change file" : "or drag and drop here"}</span>
            </div>
          </label>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="problem-type" className="input-label">Problem Type</label>
            <div className="select-wrapper">
              <select
                id="problem-type"
                name="problem-type"
                value={problemType}
                className="form-control"
                onChange={(e) => {
                  setProblemType(e.target.value);
                  setTargetColumn("");
                  resetValidation();
                }}
              >
                <option value="">Select Type</option>
                <option value="classification">Classification</option>
                <option value="regression">Regression</option>
              </select>
              <div className="select-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="target-column" className="input-label">Target Column</label>
            <div className="select-wrapper">
              <select
                id="target-column"
                name="target-column"
                value={targetColumn}
                className="form-control"
                disabled={!columns.length}
                onChange={(e) => {
                  setTargetColumn(e.target.value);
                  resetValidation();
                }}
              >
                <option value="">
                  {columns.length ? "Select Target" : "Upload file first..."}
                </option>

                {columns.map((col) => {
                  const isNumeric = columnTypes[col] === "numeric";
                  const disabled = problemType === "regression" && !isNumeric;

                  return (
                    <option key={col} value={col} disabled={disabled}>
                      {col} {disabled ? "(non-numeric)" : ""}
                    </option>
                  );
                })}
              </select>
              <div className="select-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="action-row">
          <button 
            className={`btn-secondary ${isValidated ? "btn-muted" : ""}`}
            onClick={runValidator} 
            disabled={loading}
          >
            {loading && !isValidated ? "Checking..." : isValidated ? "Re-Validate" : "Validate Data"}
          </button>
        </div>

        <div className="validation-section">
          <ValidationPanel messages={validationMessages} />
        </div>

        {hasWarnings && !hasErrors && (
          <div className="warning-confirmation">
            <label className="checkbox-label">
              <input
                id="warning-confirm"
                name="warning-confirm"
                type="checkbox"
                checked={userConfirmed}
                onChange={(e) => setUserConfirmed(e.target.checked)}
              />
              <span className="checkbox-text">I understand the data warnings and want to proceed</span>
            </label>
          </div>
        )}

        <button
          className="btn-primary btn-block btn-analyze"
          disabled={!isValidated || hasErrors || (hasWarnings && !userConfirmed) || loading}
          onClick={handleAnalyze}
        >
          {loading && isValidated ? (
             <>
               <span className="spinner"></span> Analyzing...
             </>
          ) : (
             <>
               Start Analysis 
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft:'8px'}}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
             </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Upload;