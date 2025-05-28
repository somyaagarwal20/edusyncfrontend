import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaCloudUploadAlt, FaChartLine, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/InstructorDashboard.css';

function InstructorDashboard() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar role="Instructor" />
      
      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center mb-5">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="display-5 fw-bold text-primary mb-3">Instructor Dashboard</h1>
                <p className="lead text-muted">
                  Manage your courses, track student progress, and create engaging learning experiences.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="row justify-content-center g-4">
            <motion.div 
              className="col-md-6 col-lg-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div 
                className="card border-0 shadow-sm h-100 dashboard-card"
                onClick={() => handleCardClick('/instructor/upload-course')}
              >
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-3 mx-auto icon-container">
                    <FaCloudUploadAlt className="text-primary fs-3" />
                  </div>
                  <h3 className="h5 fw-bold mb-3">Upload New Course</h3>
                  <p className="text-muted mb-4">
                    Share your knowledge by creating and uploading new course materials.
                  </p>
                  <Link to="/instructor/upload-course" className="btn btn-primary px-4 rounded-pill">
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="col-md-6 col-lg-4"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div 
                className="card border-0 shadow-sm h-100 dashboard-card"
                onClick={() => handleCardClick('/view-assessment')}
              >
                <div className="card-body text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 mb-3 mx-auto icon-container">
                    <FaClipboardList className="text-success fs-3" />
                  </div>
                  <h3 className="h5 fw-bold mb-3">Manage Assessments</h3>
                  <p className="text-muted mb-4">
                    Create and manage assessments, quizzes, and track student performance.
                  </p>
                  <Link to="/view-assessment" className="btn btn-success px-4 rounded-pill">
                    View Assessments
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="col-md-6 col-lg-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div 
                className="card border-0 shadow-sm h-100 dashboard-card"
                onClick={() => handleCardClick('/instructor/analytics')}
              >
                <div className="card-body text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 mb-3 mx-auto icon-container">
                    <FaChartLine className="text-info fs-3" />
                  </div>
                  <h3 className="h5 fw-bold mb-3">View Analytics</h3>
                  <p className="text-muted mb-4">
                    Track student performance and engagement with detailed analytics.
                  </p>
                  <Link to="/instructor/analytics" className="btn btn-info px-4 rounded-pill">
                    View Reports
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 mt-auto border-top">
        <div className="container text-center text-muted">
          <small>© 2023 EduSync. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default InstructorDashboard;