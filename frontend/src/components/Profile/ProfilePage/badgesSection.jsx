import React from 'react';

const BadgesSection = ({ badges }) => {
  if (!badges?.length) return null;

  const badgeColors = {
    gold: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    silver: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200',
    bronze: 'bg-amber-800/10 dark:bg-amber-900/40 border-amber-400/30 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200',
  };

  const getRandomColor = () => {
    const colors = Object.keys(badgeColors);
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">Badges</h2>
        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm">
          View all
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const color = badge.color || getRandomColor();
          
          return (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center p-4 rounded-lg border ${badgeColors[color]}`}
            >
              <div className="text-2xl mb-2">{badge.icon || '🏆'}</div>
              <h3 className="font-semibold text-center text-sm">{badge.title}</h3>
              <p className="text-xs text-center mt-1 opacity-80">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesSection;