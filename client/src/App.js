

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import NoticesAndTaskCenter from './pages/NoticesAndTaskCenter/NoticesAndTaskCenter';
import AddAnnouncement from './pages/AddAnnouncement/AddAnnouncement';

import { useLocation } from 'react-router-dom';

function Success() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  return (
    <div>
      <h1>Login Successful!</h1>
      <p>User ID: {userId}</p>
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
