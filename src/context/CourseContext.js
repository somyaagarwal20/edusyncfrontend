import React, { createContext, useState } from 'react';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([
    {
      title: 'React Basics',
      description: 'Learn React fundamentals.',
      videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
      quiz: [],
    },
  ]);

  const addCourse = (course) => {
    setCourses([...courses, { ...course, id: courses.length + 1 }]);
  };

  return (
    <CourseContext.Provider value={{ courses, addCourse }}>
      {children}
    </CourseContext.Provider>
  );
};
