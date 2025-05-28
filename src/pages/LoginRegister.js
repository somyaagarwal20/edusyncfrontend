import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function LoginRegister() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    role: 'Student'
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleRegister = async () => {
    try {
      const payload = { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        role: formData.role 
      };
      await axiosInstance.post('/UserModels', payload);
      
      setMessage('✅ Registration successful! Please login.');
      setTimeout(() => {
        setCurrentView('login');
        setFormData({ name: '', email: '', password: '', newPassword: '', role: 'Student' });
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data || 'Registration failed. Please try again.');
    }
  };

  const handleLogin = async () => {
    try {
      const payload = { email: formData.email, password: formData.password };
      const response = await axiosInstance.post('/UserModels/login', payload);
      
      // Store complete user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userName', response.data.name);
      
      const userRole = response.data.role;
      
      setMessage('✅ Login successful! Redirecting...');
      setTimeout(() => {
        navigate(userRole === 'Student' ? '/student/dashboard' : '/instructor/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axiosInstance.post('/UserModels/reset-password', {
        email: formData.email,
        password: formData.newPassword,
      });
      
      setMessage(response.data.message || '✅ Password reset successfully. Redirecting...');
      setTimeout(() => {
        setCurrentView('login');
        setFormData({ name: '', email: '', password: '', newPassword: '', role: 'Student' });
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Reset error:', err);
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (currentView === 'register') {
        await handleRegister();
      } else if (currentView === 'login') {
        await handleLogin();
      } else if (currentView === 'forgot') {
        await handleForgotPassword();
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'register': return 'Create Account';
      case 'login': return 'Welcome Back';
      case 'forgot': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'register': return 'Join our learning platform';
      case 'login': return 'Sign in to continue';
      case 'forgot': return 'Enter your details to reset password';
      default: return 'Sign in to continue';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '420px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    header: {
      textAlign: 'center',
      padding: '40px 30px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    logo: {
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 15px',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 8px',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '14px',
      opacity: '0.9',
      margin: 0
    },
    toggleContainer: {
      display: currentView === 'forgot' ? 'none' : 'flex',
      background: '#f8f9fa',
      margin: 0
    },
    toggleButton: {
      flex: 1,
      padding: '15px',
      border: 'none',
      background: 'transparent',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderBottom: '3px solid transparent'
    },
    toggleButtonActive: {
      background: 'white',
      color: '#667eea',
      borderBottom: '3px solid #667eea'
    },
    formContainer: {
      padding: '30px'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '500',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    inputContainer: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '15px 15px 15px 45px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      background: '#f9fafb',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#667eea',
      background: 'white',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    icon: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '18px',
      height: '18px',
      color: '#9ca3af'
    },
    eyeButton: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      fontSize: '16px'
    },
    select: {
      width: '100%',
      padding: '15px 15px 15px 45px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      background: '#f9fafb',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    error: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '12px 15px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '20px'
    },
    success: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#16a34a',
      padding: '12px 15px',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '20px'
    },
    submitButton: {
      width: '100%',
      padding: '15px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
    },
    submitButtonDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed',
      transform: 'none'
    },
    forgotLink: {
      textAlign: 'center',
      marginTop: '20px'
    },
    linkButton: {
      background: 'none',
      border: 'none',
      color: '#667eea',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '500',
      textDecoration: 'underline'
    },
    loader: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>ES</div>
          <h1 style={styles.title}>{getTitle()}</h1>
          <p style={styles.subtitle}>{getSubtitle()}</p>
        </div>

        {/* Toggle Buttons - Hide for forgot password */}
        {currentView !== 'forgot' && (
          <div style={styles.toggleContainer}>
            <button
              onClick={() => setCurrentView('register')}
              style={{
                ...styles.toggleButton,
                ...(currentView === 'register' ? styles.toggleButtonActive : {})
              }}
            >
              Create Account
            </button>
            <button
              onClick={() => setCurrentView('login')}
              style={{
                ...styles.toggleButton,
                ...(currentView === 'login' ? styles.toggleButtonActive : {})
              }}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          {/* Back Button for Forgot Password */}
          {currentView === 'forgot' && (
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              style={styles.backButton}
            >
              ← Back to Login
            </button>
          )}

          {/* Name Field - Register only */}
          {currentView === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputContainer}>
                <div style={styles.icon}>👤</div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <div style={styles.icon}>📧</div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
                required
              />
            </div>
          </div>

          {/* Password Field - Login and Register */}
          {(currentView === 'login' || currentView === 'register') && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputContainer}>
                <div style={styles.icon}>🔒</div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {/* New Password Field - Forgot Password only */}
          {currentView === 'forgot' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <div style={styles.inputContainer}>
                <div style={styles.icon}>🔒</div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  style={styles.input}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {/* Role Field - Register only */}
          {currentView === 'register' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Account Type</label>
              <div style={styles.inputContainer}>
                <div style={styles.icon}>👥</div>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  style={styles.select}
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Success Message */}
          {message && <div style={styles.success}>{message}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.submitButtonHover)}
            onMouseLeave={(e) => !loading && Object.assign(e.target.style, styles.submitButton)}
          >
            {loading && <span style={styles.loader}></span>}
            {loading ? 'Processing...' : 
             currentView === 'register' ? 'Create Account' :
             currentView === 'login' ? 'Sign In' : 'Reset Password'}
          </button>

          {/* Forgot Password Link - Login only */}
          {currentView === 'login' && (
            <div style={styles.forgotLink}>
              <button
                type="button"
                style={styles.linkButton}
                onClick={() => setCurrentView('forgot')}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          input:focus, select:focus {
            border-color: #667eea !important;
            background: white !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
        `}
      </style>
    </div>
  );
}

export default LoginRegister;