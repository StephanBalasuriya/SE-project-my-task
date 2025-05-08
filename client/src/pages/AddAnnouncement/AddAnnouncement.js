import React, { useState, useEffect } from "react";
import "./AddAnnouncement.css";

const AnnouncementModal = ({ onClose }) => {
  const [course, setCourse] = useState("Complete Financial Analyst Course");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [sento, setSentTo] = useState(0);

  const courses = ["Complete Financial Analyst Course", "All Courses", "Other Courses"];

  useEffect(() => {
    console.log("Send To option changed:", sento);
    if (sento !== 3) {
      setShowDropdown(false); // hide dropdown unless "course" is selected
    }
  }, [sento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course, title, summary, sentTo: sento }),
      });

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

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
            <button
              type="button"
              className={`send-to-button ${sento === 1 ? "active" : ""}`}
              onClick={() => setSentTo(1)}
            >
              All
            </button>
            <button
              type="button"
              className={`send-to-button ${sento === 2 ? "active" : ""}`}
              onClick={() => setSentTo(2)}
            >
              Only for Batch
            </button>
            <button
              type="button"
              className={`send-to-button ${sento === 3 ? "active" : ""}`}
              onClick={() => setSentTo(3)}
            >
              Course
            </button>
          </div>

          {/* Show dropdown only if "Course" is selected */}
          {sento === 3 && (
            <>
              <label>Select Course</label>
              <div className="dropdown">
                <div
                  className="dropdown-selected"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {course || "Select a course..."}<span className="arrow">&#9660;</span>
                </div>
                {showDropdown && (
                  <ul className="dropdown-list">
                    {courses.map((c, i) => (
                      <li key={i} onClick={() => { setCourse(c); setShowDropdown(false); }}>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          <label>Announcement Title</label>
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Summary</label>
          <textarea
            placeholder="Summary..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />

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
