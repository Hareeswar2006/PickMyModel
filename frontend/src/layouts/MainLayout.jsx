import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MainLayout.css";

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === "/";

  return (
    <div className="app-layout">
      {/* Ambient Background Mesh */}
      <div className="ambient-mesh" />

      <header className={`app-header ${isLanding ? "header-transparent" : ""}`}>
        <div className="header-content">
          <div className="logo-container" onClick={() => navigate("/")}>
            <div className="logo-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <span className="logo-text">PickMyModel</span>
          </div>

          <nav className="nav-actions">
            <button
              className="nav-btn-primary"
              onClick={() => navigate("/upload")}
            >
              Upload Dataset
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: "6px"}}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} PickMyModel. AI-Powered AutoML.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;