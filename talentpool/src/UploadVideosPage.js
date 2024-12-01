import React, { useState } from "react";
import "./UploadVideos.css"

function UploadVideosPage({ onVideoUpload }) {
  const questionsByCategory = {
    "Personal Information": [
      "Tell us about yourself.",
      "What are your strengths?",
      "What are your weaknesses.",
    ],
    "Career Goals": [
      "What are your goals?",
      "Where do you see yourself in five years?",
      "What motivates you?",
    ],
    "Problem Solving": [
      "Describe a challenging situation and how you handled it.",
      "How do you handle pressure?",
    ],
    "Achievements": [
      "What are your proudest achievements?",
      "What three words best describe you?",
    ],
  };

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState({});
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleVideoUpload = (question, file) => {
    setUploadedVideos((prev) => ({ ...prev, [question]: file }));
    onVideoUpload(question, file);
    setFileToUpload(null);
  };

  const handleRemoveVideo = (question) => {
    setUploadedVideos((prev) => {
      const updatedVideos = { ...prev };
      delete updatedVideos[question];
      return updatedVideos;
    });
  };

  const handleUploadClick = (question) => {
    setCurrentQuestion(question);
    if (!isAgreed) {
      setIsAgreementOpen(true);
    } else {
      document.getElementById(`video-upload-${question}`).click();
    }
  };

  const handleAgree = () => {
    setIsAgreed(true);
    setIsAgreementOpen(false);
    // Immediately show the file input once agreed
    document.getElementById(`video-upload-${currentQuestion}`).click();
  };

  const handleConfirmUpload = () => {
    if (fileToUpload) {
      handleVideoUpload(currentQuestion, fileToUpload);
      setIsConfirmOpen(false);
    }
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="container_">
      <h2 className="vid">Upload Interview Videos</h2>
      <p>Select categories and upload one video for each question.</p>
      <div className="categories-container">
        {Object.keys(questionsByCategory).map((category) => (
          <div key={category} className="category-item">
            <div
              key={category}
              className={`category-title ${openCategories[category] ? 'open' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </div>

            {openCategories[category] && (
              <div className="questions-dropdown">
                {questionsByCategory[category].map((question, index) => (
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
                          onClick={() => handleUploadClick(question)}
                        >
                          Upload Video
                        </button>
                        <input
                          type="file"
                          id={`video-upload-${question}`}
                          accept="video/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            setFileToUpload(e.target.files[0]);
                            setIsConfirmOpen(true); // Open confirmation after file is selected
                          }}
                        />
                        {uploadedVideos[question] && (
                          <div className="uploaded-info">
                            <p>{uploadedVideos[question].name}</p>
                            <button
                              className="remove-button"
                              onClick={() => handleRemoveVideo(question)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data Privacy Agreement Modal */}
      {isAgreementOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Data Privacy Agreement</h2>
            <div className="agreement-text">
              <p>Please read and accept the following data privacy agreement before proceeding.</p>
              <p style={{ height: "200px", overflowY: "scroll" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <label>
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
              />
              I agree to the data privacy policy
            </label>
            <button onClick={handleAgree} disabled={!isAgreed}>
              Agree
            </button>
            <button onClick={() => setIsAgreementOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Upload</h2>
            <p>Are you sure you want to upload the selected video for this question?</p>
            <div className="modal-buttons">
            <button onClick={handleConfirmUpload}>Yes, Upload</button>
            <button onClick={() => setIsConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadVideosPage;
