// AnnouncementModal.jsx
import React, { useState, useEffect } from "react";
import "./AddAnnouncement.css";

const AnnouncementModal = ({ onClose }) => {
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [sento, setSentTo] = useState(0); // 1 = all, 2 = batch, 3 = course
  const [batch, setBatch] = useState("");

  const courses = ["Complete Financial Analyst Course", "All Courses", "Other Courses"];

  useEffect(() => {
    if (sento !== 3) setShowDropdown(false);
  }, [sento]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      summary,
      targetType: sento === 1 ? "all" : sento === 2 ? "batch" : "course",
      batch: sento === 2 ? batch : null,
      course: sento === 3 ? course : null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
            <button type="button" onClick={() => setSentTo(1)} className={sento === 1 ? "active" : ""}>All</button>
            <button type="button" onClick={() => setSentTo(2)} className={sento === 2 ? "active" : ""}>Only for Batch</button>
            <button type="button" onClick={() => setSentTo(3)} className={sento === 3 ? "active" : ""}>Course</button>
          </div>

          {sento === 2 && (
            <>
              <label>Batch</label>
              <input type="text" placeholder="Batch Name or ID" value={batch} onChange={(e) => setBatch(e.target.value)} required />
            </>
          )}

          {sento === 3 && (
            <>
              <label>Select Course</label>
              <div className="dropdown">
                <div onClick={() => setShowDropdown(!showDropdown)} className="dropdown-selected">
                  {course || "Select a course..."} <span className="arrow">&#9660;</span>
                </div>
                {showDropdown && (
                  <ul className="dropdown-list">
                    {courses.map((c, i) => (
                      <li key={i} onClick={() => { setCourse(c); setShowDropdown(false); }}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          <label>Announcement Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />

          <label>Summary</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary..." required />

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
            <button type="submit" className="publish">Publish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
