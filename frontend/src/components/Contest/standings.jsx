import React, { useState, useEffect } from 'react';
import {Link , useParams, useNavigate ,useLocation} from 'react-router-dom';
import { 
  FiUser, 
  FiAward, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiBarChart2,
  FiChevronRight,
  FiStar,
  FiFlag,
  FiLock,
  FiCalendar,
  FiBell,
  FiList // Add this if you need it
} from 'react-icons/fi';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getContestById} from '../Tasks/getContestById'



// Theme configuration
const themes = {
  light: {
    background: 'bg-white',
    card: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    secondaryText: 'text-gray-500',
    hover: 'hover:bg-gray-50',
    primary: 'text-blue-600',
    primaryBg: 'bg-blue-50',
    success: 'text-green-600',
    successBg: 'bg-green-50',
    danger: 'text-red-600',
    dangerBg: 'bg-red-50',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-100',
    tableHeader: 'bg-gray-50',
    tableRow: 'bg-white',
    tableRowHighlight: 'bg-blue-50',
    problemCard: 'bg-white',
    firstSolveBadge: 'bg-blue-100 text-blue-800'
  },
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    secondaryText: 'text-gray-400',
    hover: 'hover:bg-gray-700',
    primary: 'text-purple-400',
    primaryBg: 'bg-purple-900',
    success: 'text-green-400',
    successBg: 'bg-green-900',
    danger: 'text-orange-400',
    dangerBg: 'bg-orange-900',
    accent: 'text-purple-400',
    accentBg: 'bg-purple-800',
    tableHeader: 'bg-gray-800',
    tableRow: 'bg-gray-800',
    tableRowHighlight: 'bg-purple-900',
    problemCard: 'bg-gray-700',
    firstSolveBadge: 'bg-purple-800 text-purple-200'
  }
};






const Standings = () => {
  const theme = localStorage.getItem('theme') || 'light';
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState(localStorage.getItem('username'));
  const [problemStats, setProblemStats] = useState({});
  const [contest,setContest] = useState(null);
  const [problemIds, setProblemIds] = useState([]);
  const navigate = useNavigate();
  // Suppose this returns a single contest object with a "Problems" array
  const { contestId } = useParams();
  
  // Fetch standings data
  const fetchStandings = async () => {
    try {
      setLoading(true);
  
      const [contestDataResponse, standingsResponse] = await Promise.all([
        getContestById(contestId),
        fetch(`http://localhost:3000/contests/${contestId}/standings`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
      ]);
  
      const standingsData = await standingsResponse.json();
      const problemIdList = contestDataResponse?.Problems?.map(p => p._id) || [];
  
      setContest(contestDataResponse);
      setProblemIds(problemIdList);
      setStandings(standingsData);
  
      calculateProblemStats(standingsData, problemIdList); // ✅ Use correct problemIds
    } catch (error) {
      console.error("Failed to load standings:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Calculate problem statistics
  const calculateProblemStats = (standingsData, problemIdsList) => {
    const stats = {};
    
    problemIdsList.forEach(pid => {
      stats[pid] = {
        attempts: 0,
        accepted: 0,
        firstSolve: null,
        fastestSolve: null
      };
  
      standingsData.forEach(user => {
        const problemResult = user.problemResults.find(p => p.problemId.toString() === pid.toString());
        if (problemResult) {
          stats[pid].attempts += problemResult.attempts;
  
          if (problemResult.verdict === "Accepted") {
            stats[pid].accepted++;
  
            if (!stats[pid].firstSolve || problemResult.timeFromStart < stats[pid].firstSolve.time) {
              stats[pid].firstSolve = {
                username: user.userId.username,
                time: problemResult.timeFromStart,
                rank: user.rank
              };
            }
  
            if (!stats[pid].fastestSolve || 
                (problemResult.executionTime && problemResult.executionTime < stats[pid].fastestSolve.time)) {
              stats[pid].fastestSolve = {
                username: user.userId.username,
                time: problemResult.executionTime || problemResult.timeFromStart
              };
            }
          }
        }
      });
    });
  
    setProblemStats(stats);
  };
  

  useEffect(() => {
    fetchStandings();
    const interval = setInterval(fetchStandings, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, [contestId]);

  // Format time from seconds to hh:mm
  const formatTime = (mins) => {
    if (!mins) return '0m';
    // const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const minOnly = mins % 60;
    return hrs > 0 ? `${hrs}h ${minOnly}m` : `${minOnly}m`;
  };

  // Find current user's standing
  const currentUserStanding = standings.find(user => user.userId.username === currentUser);

  // Handle user click
  const handleUserClick = (username, e) => {
    e.stopPropagation();
    navigate(`/profile/${username}`);
  };

  // Handle problem click
  const handleProblemClick = (problemId, e) => {
    e.stopPropagation();
    navigate(`/contests/${contestId}/problems/${problemId}`);
  };

  return (
    <div className={`${themes[theme].background} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold ${themes[theme].text} mb-2">Contest Standings</h1>
          <div className="flex items-center text-sm ${themes[theme].secondaryText}">
            <span>Contest ID: {contestId}</span>
            <FiChevronRight className="mx-2" />
            <span>{problemIds.length} Problems</span>
            <FiChevronRight className="mx-2" />
            <span>{standings.length} Participants</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${themes[theme].accent} mb-4"></div>
            <p className={`text-lg ${themes[theme].text}`}>Loading standings...</p>
            <p className={`text-sm ${themes[theme].secondaryText} mt-2`}>This may take a moment</p>
          </div>
        ) : (
          <>
            {/* Current User Summary (Fixed at top) */}
            {currentUserStanding && (
              <div className={`mb-6 rounded-xl shadow-md overflow-hidden ${themes[theme].tableRowHighlight} border ${themes[theme].border}`}>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center ${themes[theme].text}">
                      <FiUser className="mr-2 ${themes[theme].primary}" /> 
                      Your Performance
                    </h3>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className={`text-xs ${themes[theme].secondaryText}`}>Rank</div>
                        <div className="text-xl font-bold ${themes[theme].text}">
                          #{standings.findIndex(u => u.userId.username === currentUser) + 1}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xs ${themes[theme].secondaryText}`}>Solved</div>
                        <div className="text-xl font-bold ${themes[theme].success}">
                          {currentUserStanding.totalSolved}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xs ${themes[theme].secondaryText}`}>Penalty</div>
                        <div className="text-xl font-bold ${themes[theme].text}">
                          {(currentUserStanding.totalPenalty)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {problemIds.map((pid, idx) => {
                      const result = currentUserStanding.problemResults.find(p => 
                        p.problemId.toString() === pid.toString()
                      );
                      
                      return (
                        <div 
                          key={pid}
                          onClick={(e) => handleProblemClick(pid, e)}
                          className={`p-3 rounded-lg text-center cursor-pointer transition-all hover:scale-105 ${
                            result?.verdict === "Accepted" 
                              ? `${themes[theme].successBg} border border-green-200 dark:border-green-800`
                              : result?.attempts > 0
                                ? `${themes[theme].dangerBg} border border-red-200 dark:border-orange-800`
                                : `${themes[theme].card} border ${themes[theme].border}`
                          }`}
                        >
                          <div className={`font-medium mb-1 ${
                            result?.verdict === "Accepted" 
                              ? themes[theme].success 
                              : result?.attempts > 0 
                                ? themes[theme].danger 
                                : themes[theme].text
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <div className="text-xs">
                            {result ? (
                              result.verdict === "Accepted" ? (
                                <span className="flex items-center justify-center">
                                  <FiCheckCircle className="mr-1" />
                                  {result.attempts > 1 ? `+${result.attempts - 1}` : ''}
                                </span>
                              ) : (
                                <span className="flex items-center justify-center">
                                  <FiXCircle className="mr-1" />
                                  {result.attempts}
                                </span>
                              )
                            ) : '—'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Main Standings Table */}
            <div className={`rounded-xl shadow-md overflow-hidden ${themes[theme].card} border ${themes[theme].border}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y ${themes[theme].border}">
                  <thead className={`${themes[theme].tableHeader}`}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold ${themes[theme].secondaryText} uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold ${themes[theme].secondaryText} uppercase tracking-wider">Participant</th>
                      {problemIds.map((pid, idx) => (
                        <th 
                          key={pid} 
                          className={`px-4 py-4 text-center text-xs font-semibold ${themes[theme].secondaryText} uppercase tracking-wider cursor-pointer hover:${themes[theme].accentBg} transition-colors`}
                          onClick={(e) => handleProblemClick(pid, e)}
                        >
                          <div className="flex flex-col items-center">
                            <span>{String.fromCharCode(65 + idx)}</span>
                            <span className="text-xxs mt-1">({problemStats[pid]?.accepted || 0}/{problemStats[pid]?.attempts || 0})</span>
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-4 text-left text-xs font-semibold ${themes[theme].secondaryText} uppercase tracking-wider">Solved</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold ${themes[theme].secondaryText} uppercase tracking-wider">Penalty</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y ${themes[theme].border}">
                    {standings.map((user, idx) => (
                      <tr 
                        key={user.userId._id} 
                        className={`
                          ${user.userId.username === currentUser ? themes[theme].tableRowHighlight : themes[theme].tableRow}
                          transition-colors duration-150
                        `}
                      >
                        <td className={`px-6 py-4 whitespace-nowrap ${themes[theme].text}`}>
                          <div className="flex items-center">
                            <span className="font-medium">{idx + 1}</span>
                            {idx < 3 && (
                              <span className="ml-2 text-lg">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td 
                          className={`px-6 py-4 whitespace-nowrap cursor-pointer`}
                          onClick={(e) => handleUserClick(user.userId.username, e)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.userId.avatar || `https://ui-avatars.com/api/?name=${user.userId.username}&background=random`} 
                                alt={user.userId.username}
                              />
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${themes[theme].text} hover:underline`}>
                                {user.userId.username}
                                {user.userId.username === currentUser && (
                                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full ${themes[theme].accentBg} ${themes[theme].primary}">
                                    (YOU)
                                  </span>
                                )}
                              </div>
                              <div className={`text-xs ${themes[theme].secondaryText}`}>
                                {user.userId.organization || '—'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {problemIds.map((pid) => {
                          const result = user.problemResults.find((p) => (
                            p.problemId.toString() === pid.toString()
                          ));
                          
                          const isFirstSolve = problemStats[pid]?.firstSolve?.username === user.userId.username;
                          
                          return (
                            <td 
                              key={pid} 
                              className={`px-4 py-4 text-center text-sm cursor-pointer relative ${
                                isFirstSolve ? themes[theme].primaryBg : ''
                              }`}
                              onClick={(e) => handleProblemClick(pid, e)}
                            >
                              {result ? (
                                result.verdict === "Accepted" ? (
                                  <div className="flex flex-col items-center">
                                    <span className={`font-semibold ${themes[theme].success}`}>
                                      <FiCheckCircle className="inline mr-1" />
                                      {result.attempts > 1 ? `+${result.attempts - 1}` : ''}
                                    </span>
                                    <span className={`text-xs mt-1 ${themes[theme].secondaryText}`}>
                                      {(result.timeFromStart)}
                                    </span>
                                    {isFirstSolve && (
                                      <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
                                        <FiStar className={`text-xs ${themes[theme].primary}`} />
                                      </div>
                                    )}
                                  </div>
                                ) : result.attempts > 0 ? (
                                  <span className={`font-medium ${themes[theme].danger}`}>
                                    <FiXCircle className="inline mr-1" />
                                    {result.attempts}
                                  </span>
                                ) : (
                                  <span className={`${themes[theme].secondaryText}`}>—</span>
                                )
                              ) : (
                                <span className={`${themes[theme].secondaryText}`}>—</span>
                              )}
                            </td>
                          );
                        })}

                        <td className={`px-6 py-4 whitespace-nowrap font-medium text-center`}>
                          <span className={`px-3 py-1 rounded-full ${themes[theme].successBg} ${themes[theme].success}`}>
                            {user.totalSolved}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${themes[theme].text}`}>
                          {(user.totalPenalty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Problem Statistics Section */}
            <div className="mt-8">
              <h3 className={`text-xl font-semibold mb-6 ${themes[theme].text}`}>
                <FiBarChart2 className="inline mr-2 ${themes[theme].primary}" />
                Problem Statistics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {problemIds.map((pid, idx) => {
                  const stats = problemStats[pid] || {};
                  const firstSolve = stats.firstSolve || {};
                  const acceptanceRate = stats.attempts > 0 
                    ? Math.round((stats.accepted / stats.attempts) * 100) 
                    : 0;
                  
                  return (
                    <div 
                      key={pid}
                      className={`rounded-xl shadow-sm overflow-hidden ${themes[theme].problemCard} border ${themes[theme].border} cursor-pointer transition-transform hover:scale-[1.02]`}
                      onClick={(e) => handleProblemClick(pid, e)}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className={`text-lg font-medium ${themes[theme].text}`}>
                            Problem {String.fromCharCode(65 + idx)}
                          </h4>
                          <div className={`text-xs px-2 py-1 rounded-full ${themes[theme].firstSolveBadge}`}>
                            {firstSolve.username ? `First: ${firstSolve.username}` : 'Unsolved'}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className={themes[theme].secondaryText}>Acceptance Rate</span>
                              <span className="font-medium">{acceptanceRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${acceptanceRate}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`p-3 rounded-lg ${themes[theme].card} text-center`}>
                              <div className={`text-sm ${themes[theme].secondaryText}`}>Attempts</div>
                              <div className="text-xl font-bold ${themes[theme].text}">{stats.attempts || 0}</div>
                            </div>
                            
                            <div className={`p-3 rounded-lg ${themes[theme].card} text-center`}>
                              <div className={`text-sm ${themes[theme].secondaryText}`}>Accepted</div>
                              <div className="text-xl font-bold ${themes[theme].success}">{stats.accepted || 0}</div>
                            </div>
                          </div>
                          
                          {firstSolve.time && (
                            <div className={`text-xs ${themes[theme].secondaryText}`}>
                              <FiClock className="inline mr-1" />
                              First solved in {formatTime(firstSolve.time)} <br/> - - - ! by #{firstSolve.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default Standings;