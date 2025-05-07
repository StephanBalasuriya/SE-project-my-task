// NoticesAndTaskCenter.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NoticesAndTaskCenter.css';

const NoticesAndTaskCenter = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [noticeRes, taskRes] = await Promise.all([
        axios.get('/api/announcements'),
        axios.get('/api/tasks'),
      ]);
      setAnnouncements(noticeRes.data);
      setTasks(taskRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const filteredAnnouncements = filter === 'all'
    ? announcements
    : announcements.filter(a => a.type === filter);

  async function markTaskDone(id) {
    try {
      await axios.post(`/api/tasks/${id}/complete`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error marking task as done', error);
    }
  }

  return (
    <div className="notices-task-container">
      <div>
        <h2 className="section-title">Notices & Announcements</h2>
        <div className="filter-container">
          <select
            className="filter-select"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="university">University-wide</option>
            <option value="course">Course-specific</option>
          </select>
        </div>
        <div className="card-grid">
          {filteredAnnouncements.map((a, i) => (
            <div className="card" key={i}>
              <div className="card-content">
                <div className="card-title">{a.title}</div>
                <div className="card-subtitle">{a.course || 'University-wide'}</div>
                <div className="card-text">{a.message}</div>
                <div className="card-date">{new Date(a.date).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title">Task Center</h2>
        <div className="card-grid">
          {tasks.map((task, i) => (
            <div className="card" key={i}>
              <div className="card-content">
                <div className="card-task-header">
                  <div>
                    <div className="card-title">{task.title}</div>
                    <div className="card-subtitle">Due: {task.dueDate}</div>
                    <div className="card-text">{task.description}</div>
                  </div>
                  <button className="mark-done-btn" onClick={() => markTaskDone(task.id)}>
                    Mark Done
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticesAndTaskCenter;
