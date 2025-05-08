import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddAnnouncement() {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await fetch('http://localhost:4000/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, course, message }),
    });
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Create Announcement</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course" />
      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}

export default AddAnnouncement;
