// ProfilePage/recentSolvedProblems.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecentSolvedProblems = ({ problems, theme }) => {
    const formatTimeAgo = (timestamp) => {
    const time = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - time) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`mt-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 transition-colors`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>
          Solved Problems
        </h2>
        <Link 
          to="/problems" 
          className={`text-sm flex items-center ${
            theme === 'dark' 
              ? 'text-indigo-400 hover:text-indigo-300' 
              : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          View all
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="space-y-4">
        {problems.length > 0 ? (
          problems.slice(0, 10).map(problem => (
            <div 
              key={problem.id} 
              className={`flex items-center p-4 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'border-gray-700 hover:bg-gray-700/50' 
                  : 'border-slate-200 hover:bg-slate-50'
              } border`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center mr-4 ${
                theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <svg 
                  className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${theme === 'dark' ? 'text-gray-200' : 'text-slate-800'}`}>
                  {problem.title}
                </h3>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded mr-2 ${
                    problem.difficulty === 'Easy' 
                      ? theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                      : problem.difficulty === 'Medium'
                        ? theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                        : theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Solved {formatTimeAgo(problem.solvedAt)}
                  </span>
                </div>
              </div>
              <Link 
                to={`/problem/${problem._id}`} 
                className={`ml-2 ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <div className={`${
              theme === 'dark' ? 'bg-gray-700 text-gray-500' : 'bg-slate-100 text-slate-400'
            } w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>
              No solved problems yet
            </h3>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-500'}`}>
              Solve problems to see them appear here
            </p>
            <Link 
              to="/problems" 
              className={`mt-4 inline-block font-medium text-sm ${
                theme === 'dark' 
                  ? 'text-indigo-400 hover:text-indigo-300' 
                  : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              Browse problems
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSolvedProblems;