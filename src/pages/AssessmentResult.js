import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../api/axiosInstance';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';
import '../styles/AssessmentResultDetail.css';

const AssessmentResult = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResultDetails = async () => {
            try {
                // Fetch result details
                const resultResponse = await axios.get(`/ResultModels/${resultId}`);
                setResult(resultResponse.data);

                // Fetch assessment details
                const assessmentResponse = await axios.get(`/AssessmentModels/${resultResponse.data.assessmentId}`);
                setAssessment(assessmentResponse.data);
            } catch (error) {
                console.error('Error fetching result details:', error);
                setError('Failed to load result details');
            } finally {
                setLoading(false);
            }
        };

        fetchResultDetails();
    }, [resultId]);

    if (loading) {
        return (
            <>
                <Navbar role="Student" />
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading result details...</p>
                </div>
            </>
        );
    }

    if (error || !result || !assessment) {
        return (
            <>
                <Navbar role="Student" />
                <div className="error-message">
                    {error || 'Result not found'}
                </div>
            </>
        );
    }

    const percentage = ((result.score / assessment.maxScore) * 100).toFixed(1);
    const getScoreClass = (score) => {
        if (score >= 70) return 'high-score';
        if (score >= 50) return 'medium-score';
        return 'low-score';
    };

    return (
        <>
            <Navbar role="Student" />
            <div className="result-detail-container">
                <button 
                    className="back-button"
                    onClick={() => navigate('/student/results')}
                >
                    <FaArrowLeft className="me-2" />
                    Back to Results
                </button>

                <div className="result-summary">
                    <div className="result-header">
                        <h1>{assessment.title}</h1>
                        <div className="score-display">
                            <FaTrophy className="trophy-icon" />
                            <div className={`final-score ${getScoreClass(percentage)}`}>
                                {result.score} / {assessment.maxScore}
                            </div>
                        </div>
                    </div>

                    <div className="score-breakdown">
                        <div className="stat-item">
                            <div className="stat-label">Score</div>
                            <div className="stat-value">{percentage}%</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Attempt Date</div>
                            <div className="stat-value">
                                {new Date(result.attemptDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Questions</div>
                            <div className="stat-value">
                                {JSON.parse(assessment.questions || '[]').length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="questions-review">
                    <h2>Question Review</h2>
                    {JSON.parse(assessment.questions || '[]').map((question, qIndex) => (
                        <div 
                            key={question.id || `question-${qIndex}`}
                            className={`question-item ${question.correctAnswer === question.selectedAnswer ? 'correct' : 'incorrect'}`}
                        >
                            <div className="question-header">
                                <span className="question-number">Question {qIndex + 1}</span>
                                <span className="status-icon">
                                    {question.correctAnswer === question.selectedAnswer ? '✓' : '✗'}
                                </span>
                            </div>
                            <p className="question-text">{question.questionText}</p>
                            <div className="options-list">
                                {[question.optionA, question.optionB, question.optionC, question.optionD]
                                    .filter(Boolean)
                                    .map((option, optIndex) => (
                                        <div 
                                            key={option || `option-${optIndex}`}
                                            className={`option ${
                                                option === question.correctAnswer ? 'correct' :
                                                option === question.selectedAnswer ? 'selected' : ''
                                            }`}
                                        >
                                            {option}
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
        </>
    );
};

export default AssessmentResult; 