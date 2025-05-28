import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FaBook, FaUser } from 'react-icons/fa';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/CourseModels');
        const coursesWithInstructor = await Promise.all(response.data.map(async course => {
          let instructorName = 'Unknown Instructor';
          try {
            if (course.instructorId) {
              const instructorResponse = await axios.get(`/UserModels/${course.instructorId}`);
              if (instructorResponse.data) {
                instructorName = instructorResponse.data.name || instructorResponse.data.username;
              }
            }
          } catch (error) {
            console.error('Error fetching instructor details:', error);
          }
          return {
            ...course,
            instructorName
          };
        }));
        setCourses(coursesWithInstructor);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <Navbar role="Student" />
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <FaBook className="me-2" />
              Available Courses
            </h2>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="alert alert-info">
              No courses are available at the moment.
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  className="col-md-4 col-lg-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-2 text-truncate">{course.title}</h5>
                      <p className="card-text text-muted small mb-2">{course.description}</p>
                      <div className="instructor-info mb-3">
                        <FaUser className="me-1" />
                        <small className="text-muted">Instructor: {course.instructorName}</small>
                      </div>
                      {course.mediaUrl ? (
                        <a
                          href={course.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="btn btn-success w-100"
                        >
                          Download/View PDF
                        </a>
                      ) : (
                        <button className="btn btn-secondary w-100" disabled>
                          No PDF Available
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .card-body {
          padding: 1rem;
        }
        .card-title {
          font-size: 1rem;
        }
        .card-text {
          font-size: 0.875rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .instructor-info {
          font-size: 0.875rem;
          color: #6c757d;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
    </>
  );
};

export default AvailableCourses; 