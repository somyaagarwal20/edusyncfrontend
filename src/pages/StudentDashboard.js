import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaBook, FaClipboardList, FaChartBar, FaGraduationCap, FaClock, FaTrophy } from 'react-icons/fa';
import axios from '../api/axiosInstance';
import '../styles/StudentDashboard.css';

function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    assessmentsCompleted: 0,
    averageScore: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const studentName = localStorage.getItem('userName') || 'Student';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        // Fetch available courses count
        const coursesResponse = await axios.get('/CourseModels');
        const availableCourses = coursesResponse.data.length;

        // Fetch results to calculate stats
        const resultsResponse = await axios.get('/ResultModels');
        const userResults = resultsResponse.data.filter(result => result.userId === userId);
        
        // Calculate stats
        const completedAssessments = userResults.length;
        
        // Fetch assessment details for each result to get correct maxScore
        const resultsWithDetails = await Promise.all(
          userResults.map(async (result) => {
            try {
              const assessmentResponse = await axios.get(`/AssessmentModels/${result.assessmentId}`);
              return {
                ...result,
                maxScore: assessmentResponse.data.maxScore || 100
              };
            } catch (error) {
              console.error('Error fetching assessment details:', error);
              return result;
            }
          })
        );

        // Calculate average score using the correct maxScore for each assessment
        const totalPercentage = resultsWithDetails.reduce((sum, result) => {
          const percentage = (result.score / result.maxScore) * 100;
          return sum + percentage;
        }, 0);
        
        const averageScore = completedAssessments > 0 ? (totalPercentage / completedAssessments) : 0;

        setStats({
          coursesEnrolled: availableCourses,
          assessmentsCompleted: completedAssessments,
          averageScore: averageScore.toFixed(1)
        });

        // Get recent activity
        const recentResults = resultsWithDetails
          .sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate))
          .slice(0, 3);

        const activityWithDetails = await Promise.all(
          recentResults.map(async (result) => {
            try {
              const assessmentResponse = await axios.get(`/AssessmentModels/${result.assessmentId}`);
              return {
                type: 'assessment',
                title: assessmentResponse.data.title,
                date: result.attemptDate,
                score: result.score || 0,
                maxScore: assessmentResponse.data.maxScore || 100
              };
            } catch (error) {
              console.error('Error fetching assessment details:', error);
              return null;
            }
          })
        );

        setRecentActivity(activityWithDetails.filter(Boolean));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <Navbar role="Student" />
      <div className="student-dashboard">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="welcome-section">
              <h2>Welcome back, {studentName}! 👋</h2>
              <p>Track your progress and continue your learning journey</p>
            </div>

            <div className="dashboard-grid">
              {/* Quick Actions Card */}
              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon courses">
                    <FaBook />
                  </div>
                  <h3 className="card-title">Quick Actions</h3>
                </div>
                <div className="quick-actions">
                  <Link to="/student/courses" className="action-button">
                    <FaGraduationCap />
                    Browse Available Courses
                  </Link>
                  <Link to="/student/available-assessments" className="action-button">
                    <FaClipboardList />
                    Take Assessments
                  </Link>
                  <Link to="/student/results" className="action-button">
                    <FaChartBar />
                    View Your Results
                  </Link>
                </div>
              </div>

              {/* Progress Overview Card */}
              <div className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon assessments">
                    <FaTrophy />
                  </div>
                  <h3 className="card-title">Your Progress</h3>
                </div>
                <div className="progress-stats">
                  <div className="stat-card">
                    <div className="stat-value">{stats.coursesEnrolled}</div>
                    <div className="stat-label">Available Courses</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.assessmentsCompleted}</div>
                    <div className="stat-label">Assessments Completed</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.averageScore}%</div>
                    <div className="stat-label">Average Score</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="progress-section">
              <div className="progress-header">
                <h3 className="progress-title">Recent Activity</h3>
              </div>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No recent activity to show</p>
                </div>
              ) : (
                <div className="recent-activity">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        <FaClipboardList />
                      </div>
                      <div className="activity-details">
                        <div className="activity-title">
                          Completed {activity.title}
                        </div>
                        <div className="activity-time">
                          <FaClock className="me-1" />
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {' • '}
                          Score: {((activity.score / activity.maxScore) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
