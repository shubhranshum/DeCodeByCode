import React from 'react';

const RecentAttempts = ({ attempts, theme }) => {
  if (!attempts || attempts.length === 0) {
    return (
      <div className={`rounded-xl shadow-sm p-6 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-slate-600'}`}>
        <p>No recent attempts found.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-sm transition-colors ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-bold p-6 pb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-slate-800'}`}>Recent Attempts</h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {attempts.map((attempt) => (
          <li key={attempt._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex justify-between">
              <div>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {attempt.title}
                </h3>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                  Status: <span className={attempt.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}>
                    {attempt.status}
                  </span>
                </p>
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                {new Date(attempt.lastTriedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className={`inline-block px-2 py-1 text-xs rounded-full mr-3 ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {attempt.language|| "C++"}
              </span>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentAttempts;