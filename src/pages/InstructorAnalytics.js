import React from 'react';
import Navbar from '../components/Navbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const quizStats = [
  { name: 'React', avgScore: 8 },
  { name: 'Data Structures', avgScore: 6 },
  { name: 'OOP', avgScore: 7 },
];

function InstructorAnalytics() {
  return (
    <>
      <Navbar role="Instructor" />

      <div className="container py-5">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-primary mb-4 border-bottom pb-2">
            Student Performance Analytics
          </h2>

          <p className="text-muted mb-4">
            This chart shows the average quiz scores of students across different topics.
          </p>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={quizStats}
              margin={{ top: 20, right: 40, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 14 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #ccc' }}
                itemStyle={{ fontSize: '14px' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="#007bff"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx="true">{`
        .recharts-tooltip-wrapper {
          z-index: 10;
        }
      `}</style>
    </>
  );
}

export default InstructorAnalytics;
