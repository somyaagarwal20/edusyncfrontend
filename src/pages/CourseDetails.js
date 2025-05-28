import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Simulated course data (in production, fetch from API)
const sampleCourses = [
  {
    id: 1,
    title: 'React Basics',
    description: 'Learn the core concepts of React.js including components, hooks, and state management.',
    videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
    quiz: [
      {
        id: 1,
        question: 'What is React?',
        options: ['Framework', 'Library', 'Language', 'Tool'],
        answer: 'Library',
      },
      {
        id: 2,
        question: 'Which hook is used for state?',
        options: ['useEffect', 'useRef', 'useState', 'useMemo'],
        answer: 'useState',
      },
      {
        id: 3,
        question: 'JSX is a syntax extension for which language?',
        options: ['Java', 'Python', 'JavaScript', 'C++'],
        answer: 'JavaScript',
      },
    ],
  },
  {
    id: 2,
    title: 'Data Structures',
    description: 'Understand core computer science concepts like arrays, trees, and graphs.',
    videoUrl: 'https://www.youtube.com/embed/sV7muibSy14',
    quiz: [
      {
        id: 1,
        question: 'Which data structure uses FIFO?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        answer: 'Queue',
      },
      {
        id: 2,
        question: 'What data structure is used for implementing recursion?',
        options: ['Queue', 'Array', 'Stack', 'Heap'],
        answer: 'Stack',
      },
      {
        id: 3,
        question: 'Which of the following is a linear data structure?',
        options: ['Tree', 'Graph', 'Array', 'HashMap'],
        answer: 'Array',
      },
    ],
  },
];

function CourseDetails() {
  const { id } = useParams();
  const courseId = parseInt(id, 10);
  const course = sampleCourses.find((c) => c.id === courseId);

  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!course) {
    return (
      <div className="container py-5">
        <h2 className="text-danger">Course not found</h2>
      </div>
    );
  }

  const handleSelect = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = () => {
    let tempScore = 0;
    course.quiz.forEach((q) => {
      if (answers[q.id] === q.answer) tempScore++;
    });
    setScore(tempScore);
    setSubmitted(true);
  };

  const allAnswered = course.quiz.every((q) => answers[q.id]);

  return (
    <div className="container py-5">
      <Navbar />
      <h2 className="text-primary mb-3">Course: {course.title}</h2>

      <div className="mb-4">
        <div className="ratio ratio-16x9">
          <iframe
            src={course.videoUrl}
            title="Course video"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <p className="text-muted mb-4">{course.description}</p>

      {!showQuiz ? (
        <button className="btn btn-primary" onClick={() => setShowQuiz(true)}>
          Start Quiz
        </button>
      ) : (
        <div className="card p-4 mt-4 shadow-sm">
          <h4 className="mb-3">Quiz</h4>

          {course.quiz.map((q) => (
            <div className="mb-3" key={q.id}>
              <p className="fw-bold">{q.question}</p>
              {q.options.map((opt) => {
                const isCorrect = submitted && opt === q.answer;
                const isSelected = answers[q.id] === opt;
                const isWrong = submitted && isSelected && opt !== q.answer;

                return (
                  <div className="form-check" key={opt}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      disabled={submitted}
                      checked={isSelected}
                      onChange={() => handleSelect(q.id, opt)}
                      id={`${q.id}-${opt}`}
                    />
                    <label
                      className={`form-check-label ${isCorrect ? 'text-success' : isWrong ? 'text-danger' : ''}`}
                      htmlFor={`${q.id}-${opt}`}
                    >
                      {opt}
                    </label>
                  </div>
                );
              })}
            </div>
          ))}

          {!submitted ? (
            <button
              className="btn btn-success mt-3"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Submit Quiz
            </button>
          ) : (
            <div className="alert alert-info mt-3">
              You scored <strong>{score}</strong> out of <strong>{course.quiz.length}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
