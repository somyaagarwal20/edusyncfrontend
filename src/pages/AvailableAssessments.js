import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FaClipboardList, FaClock, FaTrophy, FaBook } from 'react-icons/fa';
import '../styles/AvailableAssessments.css';

const AvailableAssessments = () => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const response = await axios.get('/AssessmentModels');
                setAssessments(response.data);
            } catch (error) {
                console.error('Error fetching assessments:', error);
                setError('Failed to load assessments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssessments();
    }, []);

    return (
        <>
            <Navbar role="Student" />
            <div className="available-assessments">
                <div className="assessments-header">
                    <h2>
                        <FaClipboardList />
                        Available Assessments
                    </h2>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p>Loading assessments...</p>
                    </div>
                ) : assessments.length === 0 ? (
                    <div className="no-assessments">
                        <FaBook size={48} color="#667eea" />
                        <h2>No Assessments Available</h2>
                        <p>There are no assessments available at the moment. Please check back later.</p>
                    </div>
                ) : (
                    <div className="assessments-grid">
                        {assessments.map((assessment) => (
                            <motion.div
                                key={assessment.assessmentId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="assessment-card">
                                    <div className="card-header">
                                        <h3 className="card-title">{assessment.title}</h3>
                                        <span className="course-badge">
                                            {assessment.courseTitle}
                                        </span>
                                    </div>

                                    <div className="assessment-info">
                                        <div className="info-item">
                                            <FaTrophy />
                                            <span>Max Score: {assessment.maxScore} points</span>
                                        </div>
                                        <div className="info-item">
                                            <FaClock />
                                            <span>Questions: {
                                                (() => {
                                                    try {
                                                        const questions = assessment.questions ? JSON.parse(assessment.questions) : [];
                                                        return Array.isArray(questions) ? questions.length : 0;
                                                    } catch (e) {
                                                        console.error('Error parsing questions:', e);
                                                        return 0;
                                                    }
                                                })()
                                            }</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/student/take-assessment/${assessment.assessmentId}`}
                                        className="take-assessment-btn"
                                    >
                                        Take Assessment
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default AvailableAssessments; 