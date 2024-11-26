import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  const interviewQuestions = [
    "Tell us about yourself.",
    "What are your strengths?",
    "What are your weaknesses?",
    "What are your goals?",
    "Describe a challenging situation and how you handled it.",
    "Where do you see yourself in five years?",
    "What three words best describe you?",
    "What motivates you?",
    "What are your proudest achievements?",
    "How do you handle pressure?",
  ];

  const [cvFile, setCvFile] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState({});
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState(null);
  const [pendingUpload, setPendingUpload] = useState(null);

  const handleUploadClick = (type, callback) => {
    setCurrentUploadType(type);
    setPendingUpload(() => callback);
    setShowPrivacyModal(true);
  };

  const handlePrivacyAgreement = () => {
    setShowPrivacyModal(false);
    if (pendingUpload) pendingUpload();
  };

  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCvFile(file);
      alert(`Curriculum Vitae uploaded: ${file.name}`);
    }
  };

  const handleVideoUpload = (question, file) => {
    setUploadedVideos((prev) => ({ ...prev, [question]: file }));
  };

  const handleVideoRemove = (question) => {
    setUploadedVideos((prev) => {
      const updatedVideos = { ...prev };
      delete updatedVideos[question];
      return updatedVideos;
    });
  };

  const uploadedCount = Object.keys(uploadedVideos).length;
  const progressPercentage = Math.min((uploadedCount / 5) * 100, 100);

  return (
    <Router>
      <div className="app">
        <header className="ribbon">
          <div className="logo">talentpool.ph</div>
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
                <h1>Get internship opportunities in 15 minutes!</h1>
                <div className="form-container">
                  <div className="cv-section">
                    <h2>Upload Curriculum Vitae</h2>
                    <button
                      className="upload-button"
                      onClick={() =>
                        handleUploadClick("cv", () =>
                          document.getElementById("cv-upload").click()
                        )
                      }
                    >
                      Upload CV
                    </button>
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf, .doc, .docx"
                      style={{ display: "none" }}
                      onChange={handleCvUpload}
                    />
                    {cvFile && <p>Selected file: {cvFile.name}</p>}
                  </div>

                  <div className="video-section">
                    <h2>Upload Interview Videos</h2>
                    <p>Select at least 5 questions and upload one video for each.</p>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                      <p className="progress-text">
                        {uploadedCount}/5 Videos Uploaded
                      </p>
                    </div>
                    <div className="questions-container">
                      {interviewQuestions.map((question, index) => (
                        <div key={index} className="question-item">
                          <label>
                            <input
                              type="checkbox"
                              value={question}
                              onChange={() =>
                                setSelectedQuestions((prev) =>
                                  prev.includes(question)
                                    ? prev.filter((q) => q !== question)
                                    : [...prev, question]
                                )
                              }
                            />
                            {question}
                          </label>
                          {selectedQuestions.includes(question) && (
                            <div className="upload-section">
                              <button
                                className="upload-button"
                                onClick={() =>
                                  handleUploadClick("video", () =>
                                    document.getElementById(
                                      `video-upload-${index}`
                                    ).click()
                                  )
                                }
                              >
                                Upload Video
                              </button>
                              <input
                                type="file"
                                id={`video-upload-${index}`}
                                accept="video/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handleVideoUpload(question, e.target.files[0])
                                }
                              />
                              {uploadedVideos[question] ? (
                                <div className="uploaded-info">
                                  <p>{uploadedVideos[question].name}</p>
                                  <button
                                    className="remove-button"
                                    onClick={() => handleVideoRemove(question)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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

        {showPrivacyModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Data Privacy Agreement</h2>
              <p>
                By uploading your files, you agree to our data privacy
                policies, including the safe and secure handling of your data.
              </p>
              <div className="modal-buttons">
                <button onClick={handlePrivacyAgreement}>I Agree</button>
                <button onClick={() => setShowPrivacyModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
