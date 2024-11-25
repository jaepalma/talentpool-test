import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  const interviewQuestions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why do you want to work here?",
    "Describe a challenging situation and how you handled it.",
    "Where do you see yourself in five years?",
    "Why should we hire you?",
    "What motivates you?",
    "What is your greatest achievement?",
    "How do you handle pressure?",
  ];

  const [cvFile, setCvFile] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState({});

  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCvFile(file);
      alert(`Curriculum Vitae uploaded: ${file.name}`);
    }
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  const handleVideoUpload = (question, file) => {
    setUploadedVideos((prev) => ({ ...prev, [question]: file }));
  };

  const handleSubmit = () => {
    if (selectedQuestions.length < 5) {
      alert("Please select at least 5 questions.");
      return;
    }
    alert("Application submitted successfully!");
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
                <h1>Submit Your Application</h1>
                <div className="form-container">
                  {/* Upload CV Section */}
                  <div className="cv-section">
                    <h2>Upload Curriculum Vitae</h2>
                    <label htmlFor="cv-upload">
                      Upload CV (PDF, DOCX):
                    </label>
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf, .doc, .docx"
                      onChange={handleCvUpload}
                    />
                    {cvFile && <p>Selected file: {cvFile.name}</p>}
                  </div>

                  {/* Video Upload Section */}
                  <div className="video-section">
                    <h2>Upload Interview Videos</h2>
                    <p>Select at least 5 questions and upload one video for each.</p>
                    <div className="questions-container">
                      {interviewQuestions.map((question, index) => (
                        <div
                          key={index}
                          className={`question-item ${
                            selectedQuestions.includes(question) ? "selected" : ""
                          }`}
                        >
                          <label>
                            <input
                              type="checkbox"
                              value={question}
                              onChange={() => handleQuestionSelect(question)}
                              checked={selectedQuestions.includes(question)}
                            />
                            {question}
                          </label>
                          {selectedQuestions.includes(question) && (
                            <div className="upload-section">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) =>
                                  handleVideoUpload(question, e.target.files[0])
                                }
                              />
                              {uploadedVideos[question] && (
                                <p>
                                  Uploaded: {uploadedVideos[question].name}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={selectedQuestions.length < 5}
                >
                  Submit Application
                </button>
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
