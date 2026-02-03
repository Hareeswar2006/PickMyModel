import React from "react";
import "./ValidationPanel.css";

function ValidationPanel({ messages }) {
  if (!messages || messages.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case "error":
        return (
          <svg className="v-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case "warning":
        return (
          <svg className="v-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case "success":
        return (
          <svg className="v-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="validation-panel">
      {messages.map((item, index) => {
        const typeClass = item.type || "info"; 
        
        return (
          <div key={index} className={`validation-item ${typeClass}`}>
            <div className="v-icon-wrapper">
              {getIcon(item.type)}
            </div>
            <div className="v-content">
              <span className="v-title">
                {item.type === "error" ? "Error detected" : 
                 item.type === "warning" ? "Warning" : "Success"}
              </span>
              <p className="v-message">{item.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ValidationPanel;