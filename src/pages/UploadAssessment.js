import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';
import '../styles/UploadAssessment.css';

const UploadAssessment = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [assessmentData, setAssessmentData] = useState({
        courseId: '',
        title: '',
        questions: [
            {
                id: 1,
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                score: 1
            }
        ]
    });

    // Get instructor ID from localStorage
    const instructorId = localStorage.getItem('userId');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!instructorId) {
            navigate('/');
            return;
        }
        fetchCourses();
    }, []);

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
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssessmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuestionChange = (questionId, field, value, optionIndex = null) => {
        setAssessmentData(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === questionId) {
                    if (field === 'options' && optionIndex !== null) {
                        const newOptions = [...q.options];
                        newOptions[optionIndex] = value;
                        return { ...q, options: newOptions };
                    }
                    return { ...q, [field]: value };
                }
                return q;
            })
        }));
    };

    const addQuestion = () => {
        setAssessmentData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: prev.questions.length + 1,
                    questionText: '',
                    options: ['', '', '', ''],
                    correctAnswer: '',
                    score: 1
                }
            ]
        }));
    };

    const removeQuestion = (questionId) => {
        if (assessmentData.questions.length > 1) {
            setAssessmentData(prev => ({
                ...prev,
                questions: prev.questions.filter(q => q.id !== questionId)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate all fields are filled
            const isValid = validateAssessment();
            if (!isValid) {
                setError('Please fill in all fields for all questions');
                setLoading(false);
                return;
            }

            // Calculate total score
            const totalScore = assessmentData.questions.reduce((sum, q) => sum + Number(q.score), 0);

            // Format questions to match backend expectations
            const formattedQuestions = assessmentData.questions.map(q => ({
                questionText: q.questionText,
                optionA: q.options[0],
                optionB: q.options[1],
                optionC: q.options[2],
                optionD: q.options[3],
                correctAnswer: q.correctAnswer,
                score: Number(q.score)
            }));

            const payload = {
                assessmentId: Guid.NewGuid(), // Generate a new GUID for the assessment
                courseId: assessmentData.courseId,
                title: assessmentData.title,
                questions: JSON.stringify(formattedQuestions),
                maxScore: totalScore
            };

            console.log('Sending payload:', payload); // Debug log

            const response = await axios.post('/AssessmentModels', payload);
            
            if (response.data) {
                setSuccess('Assessment uploaded successfully!');
                // Reset form
                setAssessmentData({
                    courseId: '',
                    title: '',
                    questions: [
                        {
                            id: 1,
                            questionText: '',
                            options: ['', '', '', ''],
                            correctAnswer: '',
                            score: 1
                        }
                    ]
                });
                // Navigate to view assessments after successful upload
                setTimeout(() => {
                    navigate('/view-assessment');
                }, 2000);
            }
        } catch (error) {
            console.error('Error uploading assessment:', error);
            if (error.response?.data) {
                // Log the full error response for debugging
                console.log('Full error response:', error.response);
                // Handle different types of error responses
                const errorMessage = typeof error.response.data === 'string' 
                    ? error.response.data 
                    : error.response.data.title || error.response.data.message || 'Failed to upload assessment. Please try again.';
                setError(errorMessage);
            } else {
                setError('Failed to upload assessment. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const validateAssessment = () => {
        if (!assessmentData.courseId || !assessmentData.title) return false;
        
        return assessmentData.questions.every(q => 
            q.questionText &&
            q.options.every(opt => opt.trim() !== '') &&
            q.correctAnswer &&
            q.score > 0
        );
    };

    // Add Guid generation utility
    const Guid = {
        NewGuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : ((r & 0x3) | 0x8);
                return v.toString(16);
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className="upload-assessment-container">
                <motion.div 
                    className="assessment-form-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="header-section">
                        <button 
                            className="back-button"
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft /> Back
                        </button>
                        <h2>Create New Assessment</h2>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Course</label>
                            <select
                                name="courseId"
                                value={assessmentData.courseId}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            >
                                <option key="default" value="">Select a course...</option>
                                {courses.map(course => (
                                    <option key={course.cousreld.toString()} value={course.cousreld}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Assessment Title</label>
                            <input
                                type="text"
                                name="title"
                                value={assessmentData.title}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Enter assessment title"
                                required
                            />
                        </div>

                        <div className="questions-section">
                            <AnimatePresence>
                                {assessmentData.questions.map((question, index) => (
                                    <motion.div
                                        key={question.id || `question-${index}`}
                                        className="question-card"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <div className="question-header">
                                            <h3>Question {index + 1}</h3>
                                            {assessmentData.questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="remove-question-btn"
                                                    onClick={() => removeQuestion(question.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Question Text</label>
                                            <textarea
                                                value={question.questionText}
                                                onChange={(e) => handleQuestionChange(question.id, 'questionText', e.target.value)}
                                                className="form-control"
                                                placeholder="Enter your question"
                                                required
                                            />
                                        </div>

                                        <div className="options-grid">
                                            {question.options.map((option, optIndex) => (
                                                <div key={optIndex} className="form-group option-group">
                                                    <div className="option-header">
                                                        <label>Option {optIndex + 1}</label>
                                                        <div className="correct-answer-selector">
                                                            <input
                                                                type="radio"
                                                                name={`correct-answer-${question.id}`}
                                                                checked={option === question.correctAnswer}
                                                                onChange={() => handleQuestionChange(question.id, 'correctAnswer', option)}
                                                            />
                                                            <label>Correct Answer</label>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => handleQuestionChange(question.id, 'options', e.target.value, optIndex)}
                                                        className={`form-control ${option === question.correctAnswer ? 'correct-option' : ''}`}
                                                        placeholder={`Option ${optIndex + 1}`}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="form-group score-group">
                                            <label>Score for this question</label>
                                            <input
                                                type="number"
                                                value={question.score}
                                                onChange={(e) => handleQuestionChange(question.id, 'score', e.target.value)}
                                                className="form-control"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                className="add-question-btn"
                                onClick={addQuestion}
                            >
                                <FaPlus /> Add Question
                            </button>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Uploading...' : <><FaSave /> Save Assessment</>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
};

export default UploadAssessment; 