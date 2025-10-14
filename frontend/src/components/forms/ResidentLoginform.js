import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResidentLogin.module.css';

// Constants for URLs and error messages
const API_URL = 'http://localhost:3050/api/auth/login';
const LOGIN_FAILED_MSG = 'Login failed. Please try again.';
const FILL_FIELDS_MSG = 'Please fill in both fields.';
const LOGIN_ERROR_MSG = 'An error occurred during login.';

const ResidentLoginForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update form fields
  const onUpdateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle login submission
  const onLogin = async (e) => {
    e.preventDefault();

    // Check if fields are filled
    if (!form.email || !form.password) {
      setError(FILL_FIELDS_MSG);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        // Storing relevant data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('residentEmail', form.email);
        localStorage.setItem('residentName', data.residentName);
        localStorage.setItem('address', data.address);
        localStorage.setItem('phone', data.phone);

        // Navigate based on user type
        if (data.usertype === 'resident') {
          navigate('/resident-home');
        } else {
          navigate('/home');
        }
      } else {
        setError(data.message || LOGIN_FAILED_MSG);
      }
    } catch (err) {
      // Log error to console for debugging
      console.error('Login error:', err);
      setError(LOGIN_ERROR_MSG);
    }
  };

  // // Navigate to the signup page
  // const onSignup = () => {
  //   navigate('/signup');
  // };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.heading}>Resident Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={onLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              id="email"
              className={styles.formField}
              type="email"
              name="email"
              value={form.email}
              onChange={onUpdateField}
              placeholder="Enter your Email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input
              id="password"
              className={styles.formField}
              type="password"
              name="password"
              value={form.password}
              onChange={onUpdateField}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.formSubmitBtn}>Login</button>
          </div>
        </form>
        <div className={styles.registerLink}>
          <p>
            New resident?{" "}
            <a href="/resident-signup" className={styles.registerLinkText}>
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResidentLoginForm;
