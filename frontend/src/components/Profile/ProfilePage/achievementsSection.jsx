import React from 'react';

const AchievementsSection = ({ achievements }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
      <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-4">Achievements</h2>
      <div className="flex flex-wrap gap-4">
        {achievements.length > 0 ? (
          achievements.map(achievement => (
            <div key={achievement} className="text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-slate-600 dark:text-gray-300">{achievement}</span>
            </div>
          ))
        ) : (
          <p className="text-slate-500 dark:text-gray-400">No achievements yet</p>
        )}
      </div>
    </div>
  );
};

export default AchievementsSection;