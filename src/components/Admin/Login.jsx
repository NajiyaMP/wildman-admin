import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logooo from '../Images/wildmanlogo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateInput = () => {
    let isValid = true;
    if (username.length < 5) {
      setUsernameError('Username must contain at least 5 characters.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (password.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateInput()) {
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/admin/login`, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="login-panel col-12 col-md-6 col-lg-4 p-4 shadow-sm">
        <div className="login-body">
          <div className="top d-flex justify-content-between align-items-center mb-4">
            <div className="logo">
              <img src={logooo} alt="Logo" className="img-fluid" />
            </div>
            <Link to="/">
              <i className="fa-duotone fa-house-chimney"></i>
            </Link>
          </div>
          <div className="bottom">
            <h3 className="panel-title text-center mb-4">Admin Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-regular fa-user"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${usernameError ? 'is-invalid' : ''}`}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {usernameError && <div className="invalid-feedback">{usernameError}</div>}
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-regular fa-lock"></i>
                </span>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Link
                  role="button"
                  className="input-group-text password-show"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fa-duotone fa-eye${passwordVisible ? '' : '-slash'}`}></i>
                </Link>
                {passwordError && <div className="invalid-feedback">{passwordError}</div>}
              </div>
              <button type="submit" className="btn w-100 mt-4" style={{backgroundColor:'black',color:'white'}}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

