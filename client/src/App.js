

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import NoticesAndTaskCenter from './components/NoticesAndTaskCenter/NoticesAndTaskCenter';

function Success() {
  return <h2>Google Login Successful</h2>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/notices" element={<NoticesAndTaskCenter />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
