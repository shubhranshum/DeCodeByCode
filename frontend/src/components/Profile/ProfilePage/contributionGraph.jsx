import React, { useState, useEffect, useMemo } from 'react';

const ContributionGraph = () => {
  // Seeded random number generator for consistent mock data
  const seededRandom = (seed) => {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  };

  // Generate consistent mock data
  const contributions = useMemo(() => {
    const rng = seededRandom(123);
    const today = new Date();
    return Array.from({ length: 365 }, (_, i) => {
      const day = new Date(today);
      day.setDate(day.getDate() - (365 - i));
      const dayOfWeek = day.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Generate problems array
      const numProblems = Math.floor(rng() * 5);
      const problems = Array.from({ length: numProblems }, () => {
        const difficulty = ['Easy', 'Medium', 'Hard'][Math.floor(rng() * 3)];
        return {
          title: `Problem ${Math.floor(rng() * 1000)}`,
          difficulty,
          solved: rng() > 0.3
        };
      });

      // Count solved problems
      const solvedCount = problems.filter(p => p.solved).length;

      return {
        count: solvedCount,
        date: day.toISOString().split('T')[0],
        problems
      };
    });
  }, []);

  // Color scale based on contribution count
  const getColor = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-gray-700';
    if (count < 3) return 'bg-green-300 dark:bg-green-900/70';
    if (count < 6) return 'bg-green-400 dark:bg-green-800';
    if (count < 9) return 'bg-green-500 dark:bg-green-700';
    return 'bg-green-600 dark:bg-green-600';
  };

  const getDifficultyColor = (difficulty) => {
    return difficulty === 'Easy' 
      ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
      : difficulty === 'Medium' 
        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' 
        : 'bg-red-500/20 text-red-600 dark:text-red-400';
  };

  // State for selected day and tooltip position
  const [selectedDay, setSelectedDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    longestStreak: 0,
    currentStreak: 0,
    mostActiveDay: ''
  });

  // Calculate statistics
  useEffect(() => {
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let maxActivity = 0;
    let mostActiveDay = '';
    
    const difficulties = { easy: 0, medium: 0, hard: 0 };
    let totalSolved = 0;
    
    contributions.forEach(day => {
      // Calculate streaks
      if (day.count > 0) {
        tempStreak++;
        currentStreak = tempStreak;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
      
      // Find most active day
      if (day.count > maxActivity) {
        maxActivity = day.count;
        mostActiveDay = day.date;
      }
      
      // Calculate problem stats
      day.problems.forEach(problem => {
        if (problem.solved) {
          totalSolved++;
          if (problem.difficulty === 'Easy') difficulties.easy++;
          if (problem.difficulty === 'Medium') difficulties.medium++;
          if (problem.difficulty === 'Hard') difficulties.hard++;
        }
      });
    });
    
    setStats({
      totalSolved,
      easy: difficulties.easy,
      medium: difficulties.medium,
      hard: difficulties.hard,
      longestStreak: maxStreak,
      currentStreak,
      mostActiveDay
    });
  }, [contributions]);

  // Handle day click
  const handleDayClick = (day, index, e) => {
    if (day.count === 0) return;
    
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 150
    });
    
    setSelectedDay({
      ...day,
      index,
      formattedDate: new Date(day.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedDay && !e.target.closest('.tooltip, .contribution-cell')) {
        setSelectedDay(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedDay]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left panel - Statistics */}
        <div className="md:w-1/3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Coding Activity</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSolved}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Problems Solved</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.currentStreak} days</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Current Streak</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.longestStreak} days</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Longest Streak</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-4 rounded-xl">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.mostActiveDay ? new Date(stats.mostActiveDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Most Active</div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Difficulty Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Easy</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.easy} solved</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.easy / stats.totalSolved) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Medium</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.medium} solved</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(stats.medium / stats.totalSolved) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">Hard</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.hard} solved</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(stats.hard / stats.totalSolved) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Each square represents a day of coding activity.</p>
            <p>Darker colors indicate more problems solved that day.</p>
          </div>
        </div>
        
        {/* Right panel - Contribution graph */}
        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Activity Heatmap</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last 365 days
            </div>
          </div>
          
          <div className="relative">
            <div className="overflow-x-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-flow-col grid-rows-7 gap-1 w-max mx-auto">
                {contributions.map((day, index) => (
                  <div
                    key={index}
                    className={`contribution-cell w-4 h-4 rounded-sm ${getColor(day.count)} cursor-pointer hover:opacity-80 transition-opacity ${selectedDay?.index === index ? 'ring-2 ring-blue-500' : ''}`}
                    title={`${day.count} contributions on ${day.date}`}
                    onClick={(e) => handleDayClick(day, index, e)}
                  />
                ))}
              </div>
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
            
            {/* Tooltip for selected day */}
            {selectedDay && (
              <div 
                className="absolute tooltip z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-64"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="font-semibold text-gray-800 dark:text-white">
                  {selectedDay.formattedDate}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {selectedDay.count} {selectedDay.count === 1 ? 'problem' : 'problems'} solved
                </div>
                
                {selectedDay.problems.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      SOLVED PROBLEMS:
                    </div>
                    {selectedDay.problems.map((problem, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between p-2 rounded-md ${problem.solved ? getDifficultyColor(problem.difficulty) : 'bg-gray-100 dark:bg-gray-700'}`}
                      >
                        <div className="truncate max-w-[70%]">
                          {problem.title}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${problem.solved ? getDifficultyColor(problem.difficulty) : 'bg-gray-200 dark:bg-gray-600'}`}>
                          {problem.difficulty}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No problems solved this day
                  </div>
                )}
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
              </div>
            )}
          </div>
          
          {/* Activity calendar */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Activity Calendar</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-7 gap-2 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayIndex = contributions.length - 35 + i;
                  const day = contributions[dayIndex];
                  if (!day) return <div key={i}></div>;
                  
                  return (
                    <div 
                      key={i}
                      className={`h-8 rounded-md flex items-center justify-center text-sm font-medium
                        ${day.count === 0 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' 
                          : day.count < 3 
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' 
                            : day.count < 6 
                              ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-300' 
                              : 'bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-200'} cursor-pointer hover:opacity-80`}
                      title={`${day.count} problems on ${day.date}`}
                      onClick={() => setSelectedDay({
                        ...day,
                        index: dayIndex,
                        formattedDate: new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      })}
                    >
                      {new Date(day.date).getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;