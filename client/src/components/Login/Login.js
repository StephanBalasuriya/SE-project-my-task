import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');



  return (
    <div className="login-container">
<img src="/signin.png" alt="Sign in" className="login-image" />
<h2>Sign in</h2>
      
      
      <a href="http://localhost:5000/auth/google">
        <button className="google-btn">Sign in with Google</button>
      </a>
    </div>
  );
}

export default Login;
