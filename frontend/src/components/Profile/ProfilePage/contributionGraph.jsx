import React from 'react';

const ContributionGraph = ({ data }) => {
  // Generate mock data for the past year if no data provided
  const contributions = data || Array.from({ length: 365 }, () => ({
    count: Math.floor(Math.random() * 10)
  }));

  // Color scale based on contribution count
  const getColor = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-gray-700';
    if (count < 3) return 'bg-green-300 dark:bg-green-900/70';
    if (count < 6) return 'bg-green-400 dark:bg-green-800';
    if (count < 9) return 'bg-green-500 dark:bg-green-700';
    return 'bg-green-600 dark:bg-green-600';
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-7 gap-1 w-max mx-auto">
        {contributions.map((day, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
            title={`${day.count} contributions`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-3 text-xs text-slate-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 3, 6, 9].map((count) => (
            <div
              key={count}
              className={`w-3 h-3 rounded-sm ${getColor(count)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ContributionGraph;