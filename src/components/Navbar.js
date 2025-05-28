import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaChartLine, FaClipboardList, FaSignOutAlt, FaGraduationCap } from 'react-icons/fa';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Get user info from localStorage
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={`/${userRole?.toLowerCase()}/dashboard`} className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">EduSync</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to={`/${userRole?.toLowerCase()}/dashboard`} className="nav-link">
          <FaBook className="nav-icon" />
          <span>Dashboard</span>
        </Link>

        {userRole === 'Student' && (
          <>
            <Link to="/student/available-assessments" className="nav-link">
              <FaClipboardList className="nav-icon" />
              <span>Assessments</span>
            </Link>
            <Link to="/student/courses" className="nav-link">
              <FaGraduationCap className="nav-icon" />
              <span>Available Courses</span>
            </Link>
          </>
        )}

        {userRole === 'Instructor' && (
          <>
            <Link to="/view-assessment" className="nav-link">
              <FaClipboardList className="nav-icon" />
              <span>Assessments</span>
            </Link>
            <Link to="/instructor/analytics" className="nav-link">
              <FaChartLine className="nav-icon" />
              <span>Analytics</span>
            </Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        <div className="user-role">
          {userName} ({userRole})
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
