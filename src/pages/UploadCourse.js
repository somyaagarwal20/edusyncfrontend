import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { FaUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/UploadCourse.css';

const UploadCourse = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mediaUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const instructorId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!instructorId || userRole !== 'Instructor') {
            setError('You must be logged in as an instructor to upload courses');
            navigate('/');
            return;
        }
        fetchCourses();
    }, [instructorId, userRole, navigate]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`/CourseModels?instructorId=${instructorId}`);
            console.log('Course data:', response.data);
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Create a local URL for the file
            const fileUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                mediaUrl: fileUrl
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('instructorId', instructorId);
            if (selectedFile) {
                formDataToSend.append('file', selectedFile);
            }

            const response = await axios.post('/CourseModels', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });
            
            if (response.data) {
                setSuccess('Course created successfully!');
                setFormData({
                    title: '',
                    description: '',
                    mediaUrl: ''
                });
                setSelectedFile(null);
                fetchCourses();
            }
        } catch (error) {
            console.error('Error creating course:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create course. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="upload-course-container">
                <div className="upload-section">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="upload-form-container"
                    >
                        <h2 className="upload-title">Create New Course</h2>
                        <p className="upload-subtitle">Share your knowledge with students worldwide</p>

                        {error && (
                            <motion.div 
                                className="alert alert-danger"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div 
                                className="alert alert-success"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {success}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="upload-form">
                            <div className="form-group">
                                <label>Course Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Enter an engaging title for your course"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Describe what students will learn in this course"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Course Content</label>
                                <div className="file-upload-area">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="file-input"
                                        accept="video/*,application/pdf"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="file-label">
                                        <FaUpload className="upload-icon" />
                                        <span>Click to browse or drag and drop</span>
                                        <small>Supported formats: Video, PDF</small>
                                    </label>
                                </div>
                                {selectedFile && (
                                    <div className="selected-file">
                                        <span>Selected file: {selectedFile.name}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Course'}
                            </button>
                        </form>
                    </motion.div>
                </div>

                <div className="courses-section">
                    <h3>Your Courses</h3>
                    <div className="courses-grid">
                        {courses.map((course) => (
                            <motion.div
                                key={course.cousreld}
                                className="course-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="course-content">
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                    {/* No View Course button shown here */}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadCourse; 