import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FaTrophy, FaCalendarAlt, FaBook, FaChartBar } from 'react-icons/fa';
import '../styles/StudentResults.css';

const StudentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('/ResultModels');
                const userResults = response.data.filter(result => result.userId === userId);
                
                // Fetch assessment details for each result
                const resultsWithDetails = await Promise.all(
                    userResults.map(async (result) => {
                        try {
                            const assessmentResponse = await axios.get(`/AssessmentModels/${result.assessmentId}`);
                            return {
                                ...result,
                                assessmentTitle: assessmentResponse.data.title,
                                maxScore: assessmentResponse.data.maxScore
                            };
                        } catch (error) {
                            console.error('Error fetching assessment details:', error);
                            return result;
                        }
                    })
                );

                setResults(resultsWithDetails);
            } catch (error) {
                console.error('Error fetching results:', error);
                setError('Failed to load results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [navigate]);

    const getScoreColor = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 70) return 'high-score';
        if (percentage >= 50) return 'medium-score';
        return 'low-score';
    };

    if (loading) {
        return (
            <>
                <Navbar role="Student" />
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading your results...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar role="Student" />
                <div className="error-message">
                    {error}
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar role="Student" />
            <div className="results-container">
                <div className="results-header">
                    <h1>Your Assessment Results</h1>
                    <p>Track your progress and performance across all assessments</p>
                </div>

                {results.length === 0 ? (
                    <div className="no-results">
                        <h2>No Results Yet</h2>
                        <p>You haven't taken any assessments yet. Start your learning journey by taking an assessment!</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/student/available-assessments')}
                        >
                            Browse Assessments
                        </button>
                    </div>
                ) : (
                    <div className="results-grid">
                        {results.map((result, index) => (
                            <motion.div
                                key={result.resultId || `result-${index}`}
                                className="result-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="result-header">
                                    <FaTrophy className="trophy-icon" />
                                    <div className={`score ${getScoreColor(result.score, result.maxScore)}`}>
                                        {result.score} / {result.maxScore}
                                    </div>
                                </div>

                                <div className="result-details">
                                    <h3 className="test-title">{result.assessmentTitle}</h3>
                                    
                                    <div className="course-info">
                                        <FaBook className="icon" />
                                        <span>Course Assessment</span>
                                    </div>

                                    <div className="date-info">
                                        <FaCalendarAlt className="icon" />
                                        <span>
                                            {new Date(result.attemptDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="score-badge">
                                        {((result.score / result.maxScore) * 100).toFixed(1)}%
                                    </div>
                                </div>

                                <button
                                    className="view-details-btn"
                                    onClick={() => navigate(`/student/assessment-result/${result.resultId}`)}
                                >
                                    <FaChartBar className="me-2" />
                                    View Details
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default StudentResults; 