import React, { useState } from "react";
import "./UploadVideos.css";

function UploadVideosPage({ onVideoUpload }) {
  const questionsByCategory = {
    "General/Personal": [
      "Tell us about yourself.",
      "What are your strengths?",
      "What are your weaknesses?",
      "Why are you interested in this internship?",
      "What do you know about our company?",
    ],
    "Career Goals": [
      "What are your goals?",
      "Where do you see yourself in five years?",
      "What motivates you?",
    ],
    "Problem Solving": [
      "How do you approach learning something new?",
      "How do you handle pressure?",
      "Explain a time when you had to make a decision with limited information."
    ],
    "Achievements": [
      "What are your proudest achievements?",
      "What three words best describe you?",
    ],
    "Academic/Skills-Based": [
      "What are your favorite subjects in school?",
      "What technical skills do you bring to this role?",
      "Can you explain a complex concept you learned in a simple way?",
    ],
    "Behavioral": [
      "Give an example of a time when you took the initiative.",
      "How do you prioritize your tasks when working on multiple projects?",
      "Tell me about a situation where you had to adapt quickly to changes.",
    ],
    "Cultural Fit": [
      "Describe your ideal relationship with a supervisor.",
      "How do you contribute to building a collaborative work environment?",
    ],
    "Situational": [
      "If you were given a task with unclear instructions, what would you do?",
      "What would you do if a teammate was not contributing to a project?",
    ]
  };

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState({});
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [openCategories, setOpenCategories] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleVideoUpload = async (question, file) => {
    setUploadedVideos((prev) => ({ ...prev, [question]: file }));

    // Upload video to the backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Uploaded video details:", data);

      onVideoUpload(question, file);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Video upload failed. Please try again.");
    } finally {
      setFileToUpload(null);
    }
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
              className={`category-title ${openCategories[category] ? "open" : ""}`}
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
                          //style={{ display: "none" }}
                          onChange={(e) => {
                            setFileToUpload(e.target.files[0]);
                            setIsConfirmOpen(true);
                          }}
                        />
                        {/* {uploadedVideos[question] && (
                          <div className="uploaded-info">
                            <p>{uploadedVideos[question].name}</p>
                            <button
                              className="remove-button"
                              onClick={() => handleRemoveVideo(question)}
                            >
                              Remove
                            </button>
                          </div>
                        )} */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {isAgreementOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Data Privacy Agreement</h2>
            <p>Please read and accept the following data privacy agreement before proceeding.</p>
            <div className="agreement-text" style={{ height: "200px", overflowY: "scroll" }}>
              <p> Talentpool.ph shall protect all personal information you provide in compliance with the Data Privacy Act of 2012 and its implementing rules and regulations (“Data Privacy Laws”). Talentpool.ph shall not collect, disclose or process any such personal information unless you voluntarily choose to provide us with it, or give your consent, or unless such disclosure is required by applicable laws and regulations.

By signing this form, you confirm that you freely and voluntarily give consent to the collection and processing of your personal information, which may include personal information and/or sensitive personal information (hereafter the “Data”) set out in this form and/or otherwise provided by you or possessed by Talentpool.ph.

Talentpool.ph shall keep the Data for a period of ten (10) years for record purposes, among others. Talentpool.ph shall take appropriate and commercially reasonable technical and organizational measures to ensure the required data security to protect the Data against unauthorized disclosure, access or processing. Talentpool.ph shall require its affiliates, subsidiaries and third parties who process the Data to similarly comply with the requirements of the Data Privacy Laws.

You understand that you are given rights under the Data Privacy Laws, including the right to: object to the processing of your data, access your data, correct any inaccurate data, and erasure or blocking of your data. For more information on these rights, and for requests to exercise your rights under the Data Privacy Laws, please contact Talentpool.ph through +63987654321 or privacy.ph@talentpool.com.

By signing this form, your personal information will be collected and processed by Talentpool.ph, and you further agree and consent to its transfer, processing, use and disclosure as further stated in the terms and conditions which shall be considered an integral part of this form.</p>
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
