import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import route from '../route';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import './login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [loginDetails, setDetails] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure correct API endpoint and header format
      const apiUrl = `${route()}signin`;
      const response = await axios.post(apiUrl, loginDetails, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 200) {
        localStorage.setItem("Auth", response.data.token);
        alert(response.data.msg);
        navigate('/');
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.response?.data?.msg || "Login failed, please try again.");
    }
  };

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="title">
        <span className="highlight">Trendfactory</span>
        </div>
        <div className="tagline">Log in to your account</div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} />
          </div>

          <button type="submit" className="login-btn">Sign in</button>
        </form>

        <div className="signup-link">
          Don’t have an account yet? <Link to={"/email"}>Sign Up</Link>
        </div>

        <div className="social-login">
          <div className="social-icons">
            <div className="social-icon facebook">
              <FaFacebook size={24} color="#fff" />
            </div>
            <div className="social-icon google">
              <FaGoogle size={24} color="#fff" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
