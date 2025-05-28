import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import '../styles/Assessment.css';

const ViewAssessment = () => {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const instructorId = localStorage.getItem('userId');

    const fetchAssessments = useCallback(async () => {
        try {
            const response = await axios.get(`/AssessmentModels?instructorId=${instructorId}`);
            const formattedAssessments = await Promise.all(response.data.map(async assessment => {
                let parsedQuestions;
                try {
                    const rawQuestions = typeof assessment.questions === 'string' 
                        ? JSON.parse(assessment.questions) 
                        : assessment.questions || [];
                    
                    parsedQuestions = rawQuestions.map(q => ({
                        ...q,
                        options: [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean)
                    }));
                } catch (e) {
                    console.error('Error parsing questions:', e);
                    parsedQuestions = [];
                }

                // Fetch course details
                let courseTitle = 'Unknown Course';
                try {
                    if (assessment.courseId) {
                        const courseResponse = await axios.get(`/CourseModels/${assessment.courseId}`);
                        if (courseResponse.data) {
                            courseTitle = courseResponse.data.title;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching course details:', error);
                }

                return {
                    ...assessment,
                    questions: parsedQuestions,
                    courseTitle
                };
            }));
            setAssessments(formattedAssessments);
        } catch (error) {
            console.error('Error fetching assessments:', error);
            setError('Failed to load assessments');
        } finally {
            setLoading(false);
        }
    }, [instructorId]);

    useEffect(() => {
        if (!instructorId) {
            navigate('/');
            return;
        }
        fetchAssessments();
    }, [instructorId, navigate, fetchAssessments]);

    const handleDelete = async (assessmentId, assessmentTitle) => {
        if (window.confirm(`Are you sure you want to delete the assessment "${assessmentTitle}"? This action cannot be undone.`)) {
            try {
                setLoading(true);
                
                // First, fetch and delete all results for this assessment
                const resultsResponse = await axios.get('/ResultModels');
                const assessmentResults = resultsResponse.data.filter(result => result.assessmentId === assessmentId);
                
                // Delete all results for this assessment
                await Promise.all(
                    assessmentResults.map(result => 
                        axios.delete(`/ResultModels/${result.resultId || result.id}`)
                    )
                );

                // Then delete the assessment
                await axios.delete(`/AssessmentModels/${assessmentId}`);
                
                setSuccess('Assessment and all associated results deleted successfully');
                setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                console.error('Error deleting assessment:', error);
                setError('Failed to delete assessment. Please try again.');
                setTimeout(() => setError(''), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleViewQuestions = (assessment) => {
        setSelectedAssessment(assessment);
    };

    const handleCloseQuestions = () => {
        setSelectedAssessment(null);
    };

    return (
        <>
            <Navbar />
            <div className="assessment-container">
                <div className="assessment-header">
                    <h2>My Assessments</h2>
                </div>

                <div className="view-assessments-container">
                    <div className="header-section">
                        <button
                            className="create-btn"
                            onClick={() => navigate('/instructor/upload-assessment')}
                        >
                            <FaPlus /> Create Assessment
                        </button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    {loading ? (
                        <div className="loading-spinner">Loading assessments...</div>
                    ) : assessments.length === 0 ? (
                        <div className="no-assessments">
                            <p>No assessments created yet.</p>
                            <button
                                className="create-btn"
                                onClick={() => navigate('/instructor/upload-assessment')}
                            >
                                Create Your First Assessment
                            </button>
                        </div>
                    ) : (
                        <div className="assessments-grid">
                            {assessments.map((assessment) => (
                                <motion.div
                                    key={assessment.assessmentId}
                                    className="assessment-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="card-header">
                                        <h3>{assessment.title}</h3>
                                        <div className="action-buttons">
                                            <button
                                                className="view-btn"
                                                onClick={() => handleViewQuestions(assessment)}
                                                title="View Questions"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(assessment.assessmentId, assessment.title)}
                                                title="Delete Assessment"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="course-info">
                                        <strong>Course:</strong> {assessment.courseTitle}
                                    </div>

                                    <div className="assessment-details">
                                        <div className="total-score">
                                            Total Points: {assessment.maxScore}
                                        </div>
                                        <div className="question-count">
                                            Questions: {assessment.questions?.length || 0}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Questions Modal */}
                    {selectedAssessment && (
                        <div className="questions-modal-overlay">
                            <div className="questions-modal">
                                <div className="modal-header">
                                    <h3>{selectedAssessment.title} - Questions</h3>
                                    <button className="close-btn" onClick={handleCloseQuestions}>×</button>
                                </div>
                                <div className="modal-content">
                                    {selectedAssessment.questions.map((question, index) => (
                                        <div key={index} className="question-item">
                                            <h5>Question {index + 1}: {question.questionText}</h5>
                                            <div className="options-list">
                                                {(question.options || []).map((option, optIndex) => (
                                                    <div 
                                                        key={optIndex} 
                                                        className={`option ${option === question.correctAnswer ? 'correct' : ''}`}
                                                    >
                                                        {option}
                                                        {option === question.correctAnswer && ' ✓'}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="score-badge">
                                                Points: {question.score}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewAssessment;
