import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import UploadVideosPage from "./UploadVideosPage";
import "./App.css";

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // For confirmation modal
  const [pendingUpload, setPendingUpload] = useState(null); // Store pending upload action
  const navigate = useNavigate();

  const handleCvUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCvFile(file);
      alert(`Curriculum Vitae uploaded: ${file.name}`);
    }
  };

  const handleRemoveCv = () => {
    setCvFile(null);
  };

  const handleUploadClick = () => {
    if (!isAgreed) {
      setIsAgreementOpen(true);
    } else {
      setPendingUpload(() => () => document.getElementById("cv-upload").click());
      setIsConfirmOpen(true); // Show confirmation modal
    }
  };

  const handleAgree = () => {
    setIsAgreed(true);
    setIsAgreementOpen(false);
    setPendingUpload(() => () => document.getElementById("cv-upload").click());
    setIsConfirmOpen(true); // Show confirmation modal
  };

  const handleDisagree = () => {
    setIsAgreementOpen(false);
  };

  const confirmUpload = () => {
    if (pendingUpload) {
      pendingUpload();
    }
    setIsConfirmOpen(false); // Close confirmation modal
  };

  const cancelUpload = () => {
    setIsConfirmOpen(false); // Close confirmation modal without action
  };

  return (
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
              <h1 className="title">Get internship opportunities in 15 days!</h1>
              <div className="form-container">
                
                  <button className="upload-button" onClick={handleUploadClick}>
                    Upload your CV here
                  </button>
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf, .doc, .docx"
                    style={{ display: "none" }}
                    onChange={handleCvUpload}
                  />
                  {cvFile && (
                    <div className="uploaded-info">
                      <p>{cvFile.name}</p>
                      <button className="remove-button" onClick={handleRemoveCv}>
                        Remove
                      </button>
                    </div>
                  )}
                

                <button
                  className="upload-button"
                  onClick={() => navigate("/upload-videos")}
                >
                  Upload Interview Videos
                </button>
              </div>
            </div>
          }
        />

        <Route
          path="/upload-videos"
          element={
            <UploadVideosPage
              onVideoUpload={() => {}}
            />
          }
        />

        <Route path="/about" element={<h2>About Us</h2>} />
        <Route path="/contact" element={<h2>Contact Us</h2>} />
      </Routes>

      {isAgreementOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Data Privacy Agreement</h2>
            <div className="agreement-text">
              <p>Please read and accept the following data privacy agreement before proceeding with the upload.</p>
              <p style={{ height: "200px", overflowY: "scroll" }}>
              Talentpool.ph shall protect all personal information you provide in compliance with the Data Privacy Act of 2012 and its implementing rules and regulations (“Data Privacy Laws”). Talentpool.ph shall not collect, disclose or process any such personal information unless you voluntarily choose to provide us with it, or give your consent, or unless such disclosure is required by applicable laws and regulations.

              By signing this form, you confirm that you freely and voluntarily give consent to the collection and processing of your personal information, which may include personal information and/or sensitive personal information (hereafter the “Data”) set out in this form and/or otherwise provided by you or possessed by Talentpool.ph.

              Talentpool.ph shall keep the Data for a period of ten (10) years for record purposes, among others. Talentpool.ph shall take appropriate and commercially reasonable technical and organizational measures to ensure the required data security to protect the Data against unauthorized disclosure, access or processing. Talentpool.ph shall require its affiliates, subsidiaries and third parties who process the Data to similarly comply with the requirements of the Data Privacy Laws.

              You understand that you are given rights under the Data Privacy Laws, including the right to: object to the processing of your data, access your data, correct any inaccurate data, and erasure or blocking of your data. For more information on these rights, and for requests to exercise your rights under the Data Privacy Laws, please contact Talentpool.ph through +63987654321 or privacy.ph@talentpool.com.

              By signing this form, your personal information will be collected and processed by Talentpool.ph, and you further agree and consent to its transfer, processing, use and disclosure as further stated in the terms and conditions which shall be considered an integral part of this form.
              </p>
            </div>
            <div className="modal-footer">
              <label>
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={() => setIsAgreed(!isAgreed)}
                />
                I agree to the data privacy policy
              </label>
              <div>
                <button onClick={handleAgree} disabled={!isAgreed}>
                  Agree
                </button>
                <button onClick={handleDisagree}>Disagree</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to upload?</h2>
            <div className="modal-buttons">
              <button onClick={confirmUpload}>Yes</button>
              <button onClick={cancelUpload}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
