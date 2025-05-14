

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import NoticesAndTaskCenter from './pages/NoticesAndTaskCenter/NoticesAndTaskCenter';
import AddAnnouncement from './pages/AddAnnouncement/AddAnnouncement';

import { useLocation, useNavigate } from 'react-router-dom';

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  const goToAddAnnouncement = () => {
    navigate('/announcements/new', { state: { userId } });
  };

  return (
    <div>
      <h1>Login Successful!</h1>
      <p>User ID: {userId}</p>
      {/* <button onClick={goToAddAnnouncement}>Go to Add Announcement</button> */}
    </div>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/notices" element={<NoticesAndTaskCenter />} />
        <Route path="announcements/new" element={<AddAnnouncement />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
