import React, { useState } from "react";
import "./UploadVideos.css";

function UploadVideosPage({ onVideoUpload }) {
  const questionsByCategory = {
    "Personal and Background": [
      " Can you tell us a little about yourself?",
      " What made you choose this field of study?",
      " Why are you interested in pursuing a career in this industry?",
      " What do you think are your biggest strengths?",
      " What would you consider your weaknesses, and how are you working to improve them?",
      " Tell us about a time when you successfully handled a challenge.",
      " How do you stay organized and manage multiple tasks?",
      " What are your short-term and long-term career goals?",
      " How do you prioritize your tasks when you have multiple deadlines?",
      " What would you consider to be your biggest accomplishment so far?"
    ],
    "Academic and Skills-related": [
      " How has your academic experience prepared you for this internship/job?",
      " What specific skills or experiences do you hope to gain during this internship/job?",
      " Have you worked on any projects during your studies that are relevant to this position?",
      " What technical skills do you have that would benefit this role?",
      " Are you familiar with any industry-specific tools or software?",
      " What courses or subjects did you enjoy the most in your studies? Why?",
      " Can you describe any research you’ve conducted that is relevant to the work we do?",
      " How do you ensure the quality and accuracy of your work?",
      " Do you prefer working with data, or do you enjoy creative tasks more?",
      " What kind of learning resources do you prefer—books, online tutorials, or hands-on experience?"
    ],
    "Teamwork and Communication": [
      " How do you handle working in a team environment?",
      " Can you describe a time you worked on a team project? What was your role?",
      " How do you manage conflicts in a group setting?",
      " What strategies do you use to ensure effective communication with teammates?",
      " Have you ever had to resolve a disagreement with a peer? How did you handle it?",
      " What do you think is the most important quality in a team member?",
      " How do you ensure your ideas are heard in group discussions?",
      " Have you ever led a team or taken the lead in a project? How did you manage the group?",
      " How do you motivate yourself and others when facing a difficult task?",
      " How would you describe your communication style?"
    ],
    "Problem-Solving and Critical Thinking": [
      " Describe a situation where you had to think outside the box to solve a problem.",
      " How do you approach learning new things that are outside your comfort zone?",
      " Tell us about a time you identified an inefficiency or problem in a process and suggested an improvement.",
      " How would you approach a task you don’t know much about?",
      " How do you handle making mistakes at work or school?",
      " What do you do when faced with a task that you are not sure how to complete?",
      " Give an example of a problem you solved by working with others.",
      " What is the most difficult decision you’ve had to make recently?",
      " How do you handle working on multiple projects with competing priorities?",
      " If you received critical feedback from a manager or team member, how would you respond?"
    ],
    "Adaptability and Learning": [
      " How do you handle changes in priorities or unexpected situations?",
      " Can you describe a situation where you had to adapt to a new system or process?",
      " What motivates you to learn new things and take on new challenges?",
      " Tell us about a time when you had to quickly adjust to a new environment or team.",
      " How do you keep up with the latest trends and developments in your field?",
      " What new skills are you working on or would like to develop further?",
      " How do you manage your time when dealing with a steep learning curve?",
      " What strategies do you use to handle stress and pressure when learning something new?",
      " What’s the most important lesson you’ve learned during your academic or internship experience?",
      " Why should we hire you for this internship/entry-level role?"
    ],
    "Behavioral and Situational": [
      " Can you describe a situation where you had to meet a challenging deadline?",
      " Tell us about a time when you had to work independently without much guidance.",
      " What would you do if you were assigned a task that didn’t align with your skills or interests?",
      " Describe a time when you had to work with someone who was difficult to collaborate with.",
      " What would you do if you were given feedback that you didn’t agree with?",
      " Tell us about a time when you felt particularly proud of your contribution to a project.",
      " Have you ever worked on a project where things didn’t go as planned? How did you handle it?",
      " Can you describe a situation where you demonstrated leadership skills?",
      " How would you handle a situation where you need to meet the expectations of multiple supervisors?",
      " Have you ever been in a situation where you had to learn from your mistakes? How did you improve?"
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
  const [isUploading, setIsUploading] = useState(false);


  const handleVideoUpload = async (question, file) => {
    setIsUploading(true);
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
      alert("Video uploaded successfully!")
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Video upload failed. Please try again.");
    } finally {
      setFileToUpload(null);
      setIsUploading(false);
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
                      {isUploading ? (
                        <div className="loading-spinner">Uploading...</div>
                      ) : (
                        <>
                          <button
                            className="upload_button"
                            onClick={() => handleUploadClick(question)}
                          >
                            Upload
                          </button>
                          <input
                            type="file"
                            id={`video-upload-${question}`}
                            accept="video/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              setFileToUpload(e.target.files[0]);
                              setIsConfirmOpen(true);
                            }}
                          />
                        </>
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
