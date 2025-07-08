import React from 'react';
import { Link } from 'react-router-dom';

const RecentAttempts = ({ attempts, theme }) => {
  if (!attempts || attempts.length === 0) {
    return (
      <div className={`rounded-xl shadow-sm p-6 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-slate-600'}`}>
        <p>No recent attempts found</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-sm transition-colors ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Recent Attempts</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {attempts.map((attempt) => (
          <li key={attempt._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Link to={`/problems/${attempt.problemId || attempt._id}`} className="block p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-medium truncate ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'}`}>
                    {attempt.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      attempt.status === 'Accepted' 
                        ? (theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800') 
                        : (theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                    }`}>
                      {attempt.status}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {attempt.language || "C++"}
                    </span>
                  </div>
                </div>
                <div className={`ml-4 flex-shrink-0 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  {new Date(attempt.lastTriedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              {attempt.difficulty && (
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    attempt.difficulty === 'Easy' 
                      ? (theme === 'dark' ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800')
                      : attempt.difficulty === 'Medium'
                        ? (theme === 'dark' ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800')
                        : (theme === 'dark' ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-800')
                  }`}>
                    {attempt.difficulty}
                  </span>
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentAttempts;