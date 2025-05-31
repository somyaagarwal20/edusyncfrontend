import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginRegister from './pages/LoginRegister';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseDetails from './pages/CourseDetails';

import InstructorAnalytics from './pages/InstructorAnalytics';
import UploadCourse from './pages/UploadCourse';
import UploadAssessment from './pages/UploadAssessment';
import ViewAssessment from './pages/ViewAssessment';
import TakeAssessment from './pages/TakeAssessment';
import AvailableAssessments from './pages/AvailableAssessments';
import AvailableCourses from './pages/AvailableCourses';
import StudentResults from './pages/StudentResults';
import AssessmentResult from './pages/AssessmentResult';

import 'bootstrap/dist/css/bootstrap.min.css';
  // Trigger redeploy for env var
function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginRegister />} />
        

        {/* Student routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        
        <Route path="/student/course/:id" element={<CourseDetails />} />
        <Route path="/student/take-assessment/:assessmentId" element={<TakeAssessment />} />
        <Route path="/student/available-assessments" element={<AvailableAssessments />} />
        <Route path="/student/courses" element={<AvailableCourses />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="/student/result/:resultId" element={<AssessmentResult />} />

        {/* Instructor routes */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
      
        <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
        <Route path="/instructor/upload-course" element={<UploadCourse />} />
        <Route path="/instructor/upload-assessment" element={<UploadAssessment />} />
       

        <Route path="/student/results" element={<StudentResults />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

       
 <Route path="/view-assessment" element={<ViewAssessment />} />


      </Routes>
    </Router>
  );
}

export default App;
