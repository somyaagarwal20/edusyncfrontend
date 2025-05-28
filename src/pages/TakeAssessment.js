import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaTrophy, FaArrowRight } from 'react-icons/fa';

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScorePrompt, setShowScorePrompt] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await axios.get(`/AssessmentModels/${assessmentId}`);
        const assessmentData = response.data;

        // Parse questions and format them correctly
        let parsedQuestions;
        try {
          parsedQuestions = typeof assessmentData.questions === 'string'
            ? JSON.parse(assessmentData.questions)
            : assessmentData.questions;

          // Format questions to include options array
          parsedQuestions = parsedQuestions.map(q => ({
            ...q,
            options: [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean)
          }));
        } catch (e) {
          console.error('Error parsing questions:', e);
          throw new Error('Invalid question format');
        }

        setAssessment({
          ...assessmentData,
          questions: parsedQuestions
        });
      } catch (error) {
        console.error('Error fetching assessment:', error);
        setError('Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    if (!assessment?.questions) return 0;
    
    let totalScore = 0;
    assessment.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        totalScore += question.score;
      }
    });
    return totalScore;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowScorePrompt(true);

    try {
      const resultData = {
        AssessmentId: assessmentId,
        UserId: localStorage.getItem('userId'),
        Score: finalScore,
        AttemptDate: new Date().toISOString()
      };

      const response = await axios.post('/ResultModels', resultData);
      
      // Store the result ID for future reference
      localStorage.setItem('lastResultId', response.data.ResultId);
    } catch (error) {
      console.error('Error saving results:', error);
      setError('Failed to save results. Please try again.');
    }
  };

  const handleViewDetails = () => {
    setShowScorePrompt(false);
    setIsSubmitted(true);
  };

  if (loading) {
    return (
      <>
        <Navbar role="Student" />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar role="Student" />
        <div className="container py-5">
          <div className="alert alert-danger">{error}</div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/student/available-assessments')}
          >
            Back to Assessments
          </button>
        </div>
      </>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <>
        <Navbar role="Student" />
        <div className="container py-5">
          <div className="alert alert-warning">
            This assessment has no questions.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/student/available-assessments')}
          >
            Back to Assessments
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar role="Student" />
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card shadow-sm border-0"
        >
          <div className="card-body p-4">
            <h2 className="card-title mb-4">{assessment.title}</h2>
            
            {showScorePrompt ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="score-prompt-overlay"
              >
                <div className="score-prompt">
                  <FaTrophy className="trophy-icon mb-4" />
                  <h2>Assessment Complete!</h2>
                  <div className="score-circle">
                    <div className="score-value">
                      {((score / assessment.maxScore) * 100).toFixed(1)}%
                    </div>
                    <div className="score-label">Your Score</div>
                  </div>
                  <div className="score-details">
                    <p>Points: {score} / {assessment.maxScore}</p>
                    {((score / assessment.maxScore) * 100) >= 70 ? (
                      <p className="feedback success">Excellent work! 🎉</p>
                    ) : ((score / assessment.maxScore) * 100) >= 50 ? (
                      <p className="feedback good">Good effort! 👍</p>
                    ) : (
                      <p className="feedback needs-improvement">Keep practicing! 💪</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <button
                      className="btn btn-primary btn-lg me-3"
                      onClick={handleViewDetails}
                    >
                      View Detailed Results <FaArrowRight className="ms-2" />
                    </button>
                    <button
                      className="btn btn-secondary btn-lg"
                      onClick={() => navigate('/student/available-assessments')}
                    >
                      Back to Assessments
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : !isSubmitted ? (
              <>
                <div className="progress mb-4" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%`
                    }}
                  />
                </div>

                <div className="question-container">
                  <h4 className="mb-4">
                    Question {currentQuestion + 1} of {assessment.questions.length}
                  </h4>
                  
                  <p className="h5 mb-4">{assessment.questions[currentQuestion].questionText}</p>

                  <div className="options-grid">
                    {assessment.questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        className={`btn btn-outline-primary p-3 ${
                          selectedAnswers[currentQuestion] === option ? 'active' : ''
                        }`}
                        onClick={() => handleAnswerSelect(currentQuestion, option)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCurrentQuestion(prev => prev - 1)}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </button>

                    {currentQuestion === assessment.questions.length - 1 ? (
                      <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!selectedAnswers[currentQuestion]}
                      >
                        Submit Assessment
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        disabled={!selectedAnswers[currentQuestion]}
                      >
                        Next Question
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="results-container text-center"
              >
                <h3 className="mb-4">Assessment Complete!</h3>
                <div className="score-display p-4 bg-light rounded mb-4">
                  <h4>Your Score</h4>
                  <h2 className="display-4 text-primary">
                    {score} / {assessment.maxScore}
                  </h2>
                  <p className="text-muted">
                    Percentage: {((score / assessment.maxScore) * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="answers-review">
                  {assessment.questions.map((question, index) => (
                    <div key={index} className="answer-item p-3 border-bottom">
                      <p className="mb-2">
                        <strong>Question {index + 1}:</strong> {question.questionText}
                      </p>
                      <p className="mb-1">
                        Your Answer: {selectedAnswers[index]}
                        {selectedAnswers[index] === question.correctAnswer ? (
                          <FaCheck className="text-success ms-2" />
                        ) : (
                          <FaTimes className="text-danger ms-2" />
                        )}
                      </p>
                      {selectedAnswers[index] !== question.correctAnswer && (
                        <p className="text-success mb-0">
                          Correct Answer: {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-primary mt-4"
                  onClick={() => navigate('/student/available-assessments')}
                >
                  Back to Assessments
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .score-prompt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 1000;
        }

        .score-prompt {
          margin-top: 60px;
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          max-width: 320px;
          width: 95%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .trophy-icon {
          font-size: 3rem;
          color: #ffd700;
          margin-bottom: 1rem;
        }

        .score-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #f8f9fa;
          margin: 1.2rem auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .score-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .score-label {
          font-size: 1rem;
          color: #7f8c8d;
        }

        .score-details {
          margin: 1.2rem 0;
        }

        .feedback {
          font-size: 1rem;
          font-weight: 500;
          margin-top: 0.5rem;
        }

        .feedback.success {
          color: #27ae60;
        }

        .feedback.good {
          color: #f39c12;
        }

        .feedback.needs-improvement {
          color: #e74c3c;
        }

        .answer-item {
          background: #f8f9fa;
          margin-bottom: 1rem;
          border-radius: 8px;
        }

        .score-display {
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .options-grid {
            grid-template-columns: 1fr;
          }

          .score-prompt {
            padding: 1rem;
            max-width: 98vw;
          }

          .score-circle {
            width: 80px;
            height: 80px;
          }

          .score-value {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
};

export default TakeAssessment; 