import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCvFile(file);
      alert(`Curriculum Vitae uploaded: ${file.name}`);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      alert(`Video answer uploaded: ${file.name}`);
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="ribbon">
          <div className="logo">MySite</div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <div className="container">
                <h1>Upload Your Documents</h1>
                <div className="upload-container">
                  <div className="upload-section">
                    <label htmlFor="cv-upload">
                      Upload Curriculum Vitae (PDF, DOCX):
                    </label>
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf, .doc, .docx"
                      onChange={handleCvUpload}
                    />
                    {cvFile && <p>Selected file: {cvFile.name}</p>}
                  </div>

                  <div className="upload-section">
                    <label htmlFor="video-upload">
                      Upload Video Answer (MP4, MOV):
                    </label>
                    <input
                      type="file"
                      id="video-upload"
                      accept=".mp4, .mov"
                      onChange={handleVideoUpload}
                    />
                    {videoFile && <p>Selected file: {videoFile.name}</p>}
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/about"
            element={<h2 className="page-content">About Us</h2>}
          />
          <Route
            path="/contact"
            element={<h2 className="page-content">Contact Us</h2>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
