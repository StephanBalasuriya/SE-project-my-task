import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');


  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (emailError) return;
    if (!email.endsWith('@gmail.com')) {
      alert("Only Gmail accounts allowed.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      alert(response.data.message);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
<img src="/signin.png" alt="Sign in" className="login-image" />
<h2>Sign in</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
        onChange={handleEmailChange}

          required
        /><br />
        {emailError && <span className="error-text">{emailError}</span>}<br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        {/* <label>
          <input type="checkbox" /> Remember me
        </label><br /> */}
        <button type="submit" className="login-btn">Sign in</button>
      </form>
      <hr />
      <a href="http://localhost:5000/auth/google">
        <button className="google-btn">Sign in with Google</button>
      </a>
    </div>
  );
}

export default Login;
