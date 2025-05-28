import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt, FaVideo } from 'react-icons/fa';
import '../styles/ViewCourse.css';

const ViewCourse = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const instructorId = localStorage.getItem('userId');

    useEffect(() => {
        if (!instructorId) {
            navigate('/');
            return;
        }
        fetchCourses();
    }, [instructorId, navigate]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`/CourseModels?instructorId=${instructorId}`);
            if (response.data && Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                console.error('Invalid courses data:', response.data);
                setError('Failed to load courses: Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId, courseTitle) => {
        if (window.confirm(`Are you sure you want to delete the course "${courseTitle}"? This action cannot be undone.`)) {
            try {
                setLoading(true);
                await axios.delete(`/CourseModels/${courseId}`);
                setCourses(prev => prev.filter(c => c.courseId !== courseId));
                setSuccess('Course deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                console.error('Error deleting course:', error);
                setError('Failed to delete course. Please try again.');
                setTimeout(() => setError(''), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleOpenMedia = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <>
            <Navbar />
            <div className="view-courses-container">
                <div className="header-section">
                    <h2>My Courses</h2>
                    <button
                        className="create-btn"
                        onClick={() => navigate('/instructor/upload-course')}
                    >
                        <FaPlus /> Create Course
                    </button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {loading ? (
                    <div className="loading-spinner">Loading courses...</div>
                ) : courses.length === 0 ? (
                    <div className="no-courses">
                        <p>No courses created yet.</p>
                        <button
                            className="create-btn"
                            onClick={() => navigate('/instructor/upload-course')}
                        >
                            Create Your First Course
                        </button>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {courses.map((course) => (
                            <motion.div
                                key={course.courseId}
                                className="course-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="card-header">
                                    <h3>{course.title}</h3>
                                    <div className="action-buttons">
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate(`/instructor/edit-course/${course.courseId}`)}
                                            title="Edit Course"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(course.courseId, course.title)}
                                            title="Delete Course"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className="course-description">
                                    {course.description}
                                </div>

                                <div className="course-stats">
                                    <div className="stat">
                                        <span className="stat-label">Created</span>
                                        <span className="stat-value">{new Date(course.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Students</span>
                                        <span className="stat-value">{course.enrolledStudents || 0}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Instructor</span>
                                        <span className="stat-value">{course.instructorName || 'Unknown'}</span>
                                    </div>
                                </div>

                                {course.mediaUrl && (
                                    <button
                                        className="media-link-btn"
                                        onClick={() => handleOpenMedia(course.mediaUrl)}
                                        title="Open Course Media"
                                    >
                                        {course.mediaUrl.includes('http') ? (
                                            <>
                                                <FaExternalLinkAlt /> Open Course Link
                                            </>
                                        ) : (
                                            <>
                                                <FaVideo /> View Course Video
                                            </>
                                        )}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ViewCourse; 