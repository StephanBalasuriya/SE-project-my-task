import React, { useState, useEffect } from "react";
import "./AddAnnouncement.css";
import { useLocation } from 'react-router-dom';

const AnnouncementModal = ({ onClose }) => {
  // const location = useLocation();
  // const userId = location.state?.userId;
const userId="2ed1647a-7be1-422c-8ca7-d556aaab68ea"
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [sendTo, setSendTo] = useState(0); // 1 = all, 2 = batch, 3 = course
  const [batch, setBatch] = useState("");
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showBatchForCourse, setShowBatchForCourse] = useState(false);

  const courses = [1, 2];
  const batches = [1, 2, 3];

  useEffect(() => {
    setShowCourseDropdown(false);
    setShowBatchDropdown(false);
    setShowBatchForCourse(false);
  }, [sendTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: userId,
      title:title,
      summary:summary,
      targetType: sendTo === 1 ? "all" : sendTo === 2 ? "batch" : "course",
      all: sendTo === 1,
      batch: sendTo === 2 || (sendTo === 3 && showBatchForCourse) ? batch : null,
      course: sendTo === 3 ? course : null,
    };

    try {
      console.log("Payload:", payload);

      
      // const response = await fetch(`http://localhost:5000/api/announcements/addAnnouncement?userID=${userId}`, {
      const response = await fetch(`http://localhost:5000/api/announcements/addAnnouncement`, {
         method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Payload:", payload);
      // console.log("userId:", userId);

      if (!response.ok) throw new Error("Failed to create announcement");
      const result = await response.json();
      console.log("Announcement created:", result);
      onClose();
    } catch (error) {
      console.error("Error submitting announcement:", error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Announcement</h2>
        <form onSubmit={handleSubmit}>
          <label>Send To</label>
          <div className="send-to-buttons-container">
            <button type="button" onClick={() => setSendTo(1)} className={sendTo === 1 ? "active" : ""}>All</button>
            <button type="button" onClick={() => setSendTo(2)} className={sendTo === 2 ? "active" : ""}>Only for Batch</button>
            <button type="button" onClick={() => setSendTo(3)} className={sendTo === 3 ? "active" : ""}>Course</button>
          </div>

          {sendTo === 2 && (
            <>
              <label>Batch</label>
              <div className="dropdown">
                <div onClick={() => setShowBatchDropdown(!showBatchDropdown)} className="dropdown-selected">
                  {batch || "Select a batch..."} <span className="arrow">&#9660;</span>
                </div>
                {showBatchDropdown && (
                  <ul className="dropdown-list">
                    {batches.map((b, i) => (
                      <li key={i} onClick={() => { setBatch(b); setShowBatchDropdown(false); }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {sendTo === 3 && (
            <>
              <label>Select Course</label>
              <div className="dropdown">
                <div onClick={() => setShowCourseDropdown(!showCourseDropdown)} className="dropdown-selected">
                  {course || "Select a course..."} <span className="arrow">&#9660;</span>
                </div>
                {showCourseDropdown && (
                  <ul className="dropdown-list">
                    {courses.map((c, i) => (
                      <li key={i} onClick={() => { setCourse(c); setShowCourseDropdown(false); }}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>

              <button type="button" onClick={() => setShowBatchForCourse(!showBatchForCourse)}>
                {showBatchForCourse ? "Hide Batch Filter" : "Add Batch Filter"}
              </button>

              {showBatchForCourse && (
                <>
                  <label>Batch</label>
                  <div className="dropdown">
                    <div onClick={() => setShowBatchDropdown(!showBatchDropdown)} className="dropdown-selected">
                      {batch || "Select a batch..."} <span className="arrow">&#9660;</span>
                    </div>
                    {showBatchDropdown && (
                      <ul className="dropdown-list">
                        {batches.map((b, i) => (
                          <li key={i} onClick={() => { setBatch(b); setShowBatchDropdown(false); }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          <label>Announcement Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />

          <label>Summary</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary..." required />

          <div className="modal-buttons">
            <button type="button" onClick={() => window.location.href = '/notices'} className="cancel">Cancel</button>
            <button type="submit" className="publish">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
