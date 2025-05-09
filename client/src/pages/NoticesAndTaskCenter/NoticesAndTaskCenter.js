import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './NoticesAndTaskCenter.css';

export default function NoticesAndAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [sortOrder, setSortOrder] = useState('DESC');
  const [courseFilter, setCourseFilter] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [openDetails, setOpenDetails] = useState(() => {
    const saved = localStorage.getItem('openDetails');
    return saved ? JSON.parse(saved) : {};
  });

  const cardRefs = useRef({});

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/announcements', {
        params: {
          sort: sortOrder,
          course: courseFilter,
          date: searchDate,
          fields: 'id,title,date,detail,created_by', // backend should honor this param
        },
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  }, [sortOrder, courseFilter, searchDate]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Save open states to localStorage
  useEffect(() => {
    localStorage.setItem('openDetails', JSON.stringify(openDetails));
  }, [openDetails]);

  const toggleDetail = (id) => {
    if (openDetails[id]) {
      // Save scroll position and collapse
      const scrollY = window.scrollY;
      setOpenDetails(prev => ({ ...prev, [id]: false }));
      setTimeout(() => window.scrollTo(0, scrollY), 0);
    } else {
      setOpenDetails(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div className="container">
      <div className="header">
        <img src="announcement.png" alt="announcement" className="annoouncement-image" />
        <h1>Notices and Announcements</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Create Announcement</h2>
          <button className="button" onClick={() => window.location.href = '/announcements/new'}>Add New Announcement</button>
        </div>
      </div>

      <div className="filters">
        <select onChange={(e) => setCourseFilter(e.target.value)} value={courseFilter}>
          {/* ///////////////////////////////////// this want to change according to cources/////////////////// */}
          <option value="All">All</option>
          <option value="Financial Analyst Course">Financial Analyst Course</option>
          <option value="Trello Fundamentals">Trello Fundamentals</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <div className="announcement-list">
        {announcements.map((item) => (
          <div
            key={item.id}
            ref={el => (cardRefs.current[item.id] = el)}
            className="card"
          >
            <div className="card-content">
              <div>
                <div className="meta">{format(new Date(item.date), 'MMMM dd, yyyy, h:mm a')}</div>
                <div className="title">{item.title}</div>
              </div>
              <button
                className="button-outline"
                onClick={() => toggleDetail(item.id)}
              >
                {openDetails[item.id] ? '▲ Hide' : 'Details ▼'}
              </button>
            </div>

            {openDetails[item.id] && (
              <div className="announcement-detail">
                <h4 className='-createdby'>Created by: {item.created_by}</h4>
                <p className='announcementcontain'>{item.detail}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
