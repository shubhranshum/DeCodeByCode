import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBarChart2,
  FiChevronRight,
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getContestBySlug } from '../Tasks/getContestBySlug';
import { getContestSolvedProblems } from '../Tasks/getContestSolvedProblems';
import { getContestAttemptedProblems } from '../Tasks/getContestAttemptedProblems';

const themes = {
  light: {
    background: 'bg-gray-50',
    card: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    secondaryText: 'text-gray-500',
    hover: 'hover:bg-gray-100',
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
    firstSolveBadge: 'bg-blue-100 text-blue-800',
    tabActive: 'bg-blue-100 text-blue-700',
    tabInactive: 'text-gray-500 hover:bg-gray-100'
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
    firstSolveBadge: 'bg-purple-800 text-purple-200',
    tabActive: 'bg-purple-900 text-purple-300',
    tabInactive: 'text-gray-400 hover:bg-gray-700'
  }
};

const StatCard = ({ icon, iconBg, title, value, currentTheme }) => {
  const themeStyles = themes[currentTheme];
  return (
    <div className={`${themeStyles.card} overflow-hidden shadow rounded-xl`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBg} rounded-lg p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className={`text-sm font-medium ${themeStyles.secondaryText} truncate`}>{title}</dt>
            <dd className="flex items-baseline">
              <div className={`text-2xl font-semibold ${themeStyles.text}`}>
                {value}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeRemaining = ({ endTime, currentTheme }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const themeStyles = themes[currentTheme];

  useEffect(() => {
    const updateTime = () => {
      const diffInSeconds = Math.floor((new Date(endTime) - Date.now()) / 1000);
      if (diffInSeconds <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      let timeParts = [];
      if (hours > 0) timeParts.push(`${hours}h`);
      if (minutes > 0) timeParts.push(`${minutes}m`);
      if (seconds > 0 && hours === 0) timeParts.push(`${seconds}s`);

      setTimeLeft(timeParts.join(' ') || "0s");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <span className={themeStyles.text}>{timeLeft}</span>;
};

const ContestStats = ({ contest, solvedProblemsCount, currentTheme }) => {
  const themeStyles = themes[currentTheme];
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <StatCard
        icon={
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        iconBg={themeStyles.primary}
        title="Total Problems"
        value={contest.Problems.length}
        currentTheme={currentTheme}
      />
      <StatCard
        icon={<FiCheckCircle className="h-6 w-6 text-white" />}
        iconBg={themeStyles.success}
        title="Solved"
        value={solvedProblemsCount}
        currentTheme={currentTheme}
      />
      <StatCard
        icon={<FiClock className="h-6 w-6 text-white" />}
        iconBg={themeStyles.danger}
        title="Time Remaining"
        value={<TimeRemaining endTime={contest.endTime} currentTheme={currentTheme} />}
        currentTheme={currentTheme}
      />
    </div>
  );
};

const Standings = () => {
  const { contestSlug } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState(localStorage.getItem('username'));
  const [problemStats, setProblemStats] = useState({});
  const [problems, setProblems] = useState([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const [attemptedProblemIds, setAttemptedProblemIds] = useState([]);

  const currentTheme = localStorage.getItem('theme') || 'light';
  const themeStyles = themes[currentTheme];

  const fetchContestAndProblems = useCallback(async () => {
    try {
      const contestData = await getContestBySlug(contestSlug);
      if (!contestData) throw new Error('Contest not found.');
      setContest(contestData);
      setProblems(contestData.Problems || []);
      return contestData;
    } catch (error) {
      console.error("Failed to load contest data:", error);
      toast.error("Failed to load contest data");
      setError(error.message || "Failed to load contest data.");
      return null;
    }
  }, [contestSlug]);

  const fetchStandingsData = useCallback(async (contestId, problemObjects) => {
    try {
      const response = await fetch(`http://localhost:3000/contests/${contestId}/standings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const standingsData = await response.json();
      setStandings(standingsData);
      calculateProblemStats(standingsData, problemObjects);
    } catch (error) {
      console.error("Failed to load standings:", error);
      toast.error("Failed to load standings");
      setError(error.message || "Failed to load standings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      const contestData = await fetchContestAndProblems();
      
      if (contestData) {
        await fetchStandingsData(contestData._id, contestData.Problems);
        try {
          const solved = await getContestSolvedProblems(contestData._id);
          const attempted = await getContestAttemptedProblems(contestData._id);
          setSolvedProblemIds(solved.map(p => p.problemId));
          setAttemptedProblemIds(attempted.map(p => p.problemId));
        } catch (statusError) {
          console.error("Failed to load user problem status:", statusError);
        }
      } else {
        setLoading(false);
      }
    };

    loadAllData();
  }, [contestSlug, fetchContestAndProblems, fetchStandingsData]);

  const calculateProblemStats = useCallback((standingsData, problemObjects) => {
    const stats = {};
    problemObjects.forEach(problem => {
      const slug = problem.slug;
      stats[slug] = { attempts: 0, accepted: 0, firstSolve: null, fastestSolve: null };
      
      standingsData.forEach(user => {
        const problemResult = user.problemResults.find(p => p.problemId === problem._id);
        if (!problemResult) return;
        
        stats[slug].attempts += problemResult.attempts;
        
        if (problemResult.verdict === "Accepted") {
          stats[slug].accepted++;
          
          if (!stats[slug].firstSolve || problemResult.timeFromStart < stats[slug].firstSolve.time) {
            stats[slug].firstSolve = {
              username: user.userId.username,
              time: problemResult.timeFromStart,
              rank: user.rank
            };
          }
          
          const execTime = problemResult.executionTime || problemResult.timeFromStart;
          if (execTime && (!stats[slug].fastestSolve || execTime < stats[slug].fastestSolve.time)) {
            stats[slug].fastestSolve = {
              username: user.userId.username,
              time: execTime
            };
          }
        }
      });
    });
    setProblemStats(stats);
  }, []);

  const formatTime = (totalMinutes) => {
    if (totalMinutes === null || totalMinutes === undefined) return 'N/A';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const currentUserStanding = standings.find(user => user.userId.username === currentUser);

  const handleUserClick = useCallback((username, e) => {
    e.stopPropagation();
    navigate(`/profile/${username}`);
  }, [navigate]);

  const handleProblemClick = useCallback((problemSlug, e) => {
    e.stopPropagation();
    navigate(`/contests/${contestSlug}/problems/${problemSlug}`);
  }, [navigate, contestSlug]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${themeStyles.background}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${themeStyles.accent} mb-4`}></div>
        <p className={`mt-4 text-lg ${themeStyles.text}`}>Loading standings...</p>
        <p className={`text-sm ${themeStyles.secondaryText} mt-2`}>This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
        <div className={`text-center p-6 rounded-xl ${themeStyles.card} shadow-md`}>
          <p className={`text-lg ${themeStyles.danger}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 rounded-lg ${themeStyles.primaryBg} ${themeStyles.primary} font-medium`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
        <div className={`text-center p-6 rounded-xl ${themeStyles.card} shadow-md`}>
          <p className={`text-lg ${themeStyles.text}`}>Contest not found</p>
          <Link
            to="/contests"
            className={`mt-4 inline-block px-4 py-2 rounded-lg ${themeStyles.primaryBg} ${themeStyles.primary} font-medium`}
          >
            Back to Contests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeStyles.background} min-h-screen`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${themeStyles.text} mb-2`}>Contest Standings</h1>
          <div className={`flex items-center text-sm ${themeStyles.secondaryText}`}>
            <FiChevronRight className="mx-2" />
            <span>{problems.length} Problems</span>
            <FiChevronRight className="mx-2" />
            <span>{standings.length} Participants</span>
          </div>
        </div>

        {contest && (
          <ContestStats
            contest={contest}
            solvedProblemsCount={solvedProblemIds.length}
            currentTheme={currentTheme}
          />
        )}

        {currentUserStanding && (
          <div className={`mb-6 rounded-xl shadow-md overflow-hidden ${themeStyles.tableRowHighlight} border ${themeStyles.border}`}>
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold flex items-center ${themeStyles.text}`}>
                  <FiUser className={`mr-2 ${themeStyles.primary}`} />
                  Your Performance
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-xs ${themeStyles.secondaryText}`}>Rank</div>
                    <div className={`text-xl font-bold ${themeStyles.text}`}>
                      #{standings.findIndex(u => u.userId.username === currentUser) + 1}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs ${themeStyles.secondaryText}`}>Solved</div>
                    <div className={`text-xl font-bold ${themeStyles.success}`}>
                      {currentUserStanding.totalSolved}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs ${themeStyles.secondaryText}`}>Penalty</div>
                    <div className={`text-xl font-bold ${themeStyles.text}`}>
                      {currentUserStanding.totalPenalty}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {problems.map((problem, idx) => {
                  const isSolved = solvedProblemIds.includes(problem._id);
                  const isAttempted = attemptedProblemIds.includes(problem._id);
                  const result = currentUserStanding.problemResults.find(p => p.problemId === problem._id);

                  return (
                    <div
                      key={problem._id}
                      onClick={(e) => handleProblemClick(problem.slug, e)}
                      className={`p-3 rounded-lg text-center cursor-pointer transition-all hover:scale-105 ${
                        isSolved
                          ? `${themeStyles.successBg} border border-green-200 dark:border-green-800`
                          : isAttempted
                            ? `${themeStyles.dangerBg} border border-red-200 dark:border-orange-800`
                            : `${themeStyles.card} border ${themeStyles.border}`
                      }`}
                    >
                      <div className={`font-medium mb-1 ${
                        isSolved
                          ? themeStyles.success
                          : isAttempted
                            ? themeStyles.danger
                            : themeStyles.text
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="text-xs">
                        {result ? (
                          result.verdict === "Accepted" ? (
                            <span className="flex items-center justify-center">
                              <FiCheckCircle className="inline mr-1" />
                              {result.attempts > 1 ? `+${result.attempts - 1}` : ''}
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <FiXCircle className="inline mr-1" />
                              {result.attempts}
                            </span>
                          )
                        ) : isAttempted ? (
                          <span className="flex items-center justify-center">
                            <FiXCircle className="inline mr-1" />
                            0
                          </span>
                        ) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className={`rounded-xl shadow-md overflow-hidden ${themeStyles.card} border ${themeStyles.border}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y ${themeStyles.border}">
              <thead className={`${themeStyles.tableHeader}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold ${themeStyles.secondaryText} uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold ${themeStyles.secondaryText} uppercase tracking-wider">Participant</th>
                  {problems.map((problem, idx) => (
                    <th
                      key={problem._id}
                      className={`px-4 py-4 text-center text-xs font-semibold ${themeStyles.secondaryText} uppercase tracking-wider cursor-pointer hover:${themeStyles.accentBg} transition-colors`}
                      onClick={(e) => handleProblemClick(problem.slug, e)}
                    >
                      <div className="flex flex-col items-center">
                        <span>{String.fromCharCode(65 + idx)}</span>
                        <span className="text-xxs mt-1">({problemStats[problem.slug]?.accepted || 0}/{problemStats[problem.slug]?.attempts || 0})</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-xs font-semibold ${themeStyles.secondaryText} uppercase tracking-wider">Solved</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold ${themeStyles.secondaryText} uppercase tracking-wider">Penalty</th>
                </tr>
              </thead>

              <tbody className="divide-y ${themeStyles.border}">
                {standings.map((user, idx) => (
                  <tr
                    key={user.userId._id}
                    className={`
                      ${user.userId.username === currentUser ? themeStyles.tableRowHighlight : themeStyles.tableRow}
                      transition-colors duration-150
                    `}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap ${themeStyles.text}`}>
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
                            src={user.userId.profilePicture || `https://ui-avatars.com/api/?name=${user.userId.username}&background=random`}
                            alt={user.userId.username}
                          />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${themeStyles.text} hover:underline`}>
                            {user.userId.username}
                            {user.userId.username === currentUser && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${themeStyles.accentBg} ${themeStyles.primary}`}>
                                (YOU)
                              </span>
                            )}
                          </div>
                          <div className={`text-xs ${themeStyles.secondaryText}`}>
                            {user.userId.organization || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {problems.map((problem) => {
                      const result = user.problemResults.find((p) => p.problemId === problem._id);
                      const isFirstSolve = problemStats[problem.slug]?.firstSolve?.username === user.userId.username;

                      return (
                        <td
                          key={problem._id}
                          className={`px-4 py-4 text-center text-sm cursor-pointer relative ${
                            isFirstSolve ? themeStyles.primaryBg : ''
                          }`}
                          onClick={(e) => handleProblemClick(problem.slug, e)}
                        >
                          {result ? (
                            result.verdict === "Accepted" ? (
                              <div className="flex flex-col items-center">
                                <span className={`font-semibold ${themeStyles.success}`}>
                                  <FiCheckCircle className="inline mr-1" />
                                  {result.attempts > 1 ? `+${result.attempts - 1}` : ''}
                                </span>
                                <span className={`text-xs mt-1 ${themeStyles.secondaryText}`}>
                                  {formatTime(result.timeFromStart)}
                                </span>
                                {isFirstSolve && (
                                  <div className="absolute top-1 right-1 text-yellow-500">
                                    <FaCrown className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                            ) : result.attempts > 0 ? (
                              <span className={`font-medium ${themeStyles.danger}`}>
                                <FiXCircle className="inline mr-1" />
                                {result.attempts}
                              </span>
                            ) : (
                              <span className={`${themeStyles.secondaryText}`}>—</span>
                            )
                          ) : (
                            <span className={`${themeStyles.secondaryText}`}>—</span>
                          )}
                        </td>
                      );
                    })}

                    <td className={`px-6 py-4 whitespace-nowrap font-medium text-center`}>
                      <span className={`px-3 py-1 rounded-full ${themeStyles.successBg} ${themeStyles.success}`}>
                        {user.totalSolved}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${themeStyles.text}`}>
                      {user.totalPenalty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <h3 className={`text-xl font-semibold mb-6 ${themeStyles.text}`}>
            <FiBarChart2 className={`inline mr-2 ${themeStyles.primary}`} />
            Problem Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {problems.map((problem, idx) => {
              const slug = problem.slug;
              const stats = problemStats[slug] || {};
              const firstSolve = stats.firstSolve || {};
              const acceptanceRate = stats.attempts > 0
                ? Math.round((stats.accepted / stats.attempts) * 100)
                : 0;
              const isSolved = solvedProblemIds.includes(problem._id);
              const isAttempted = attemptedProblemIds.includes(problem._id);

              return (
                <div
                  key={problem._id}
                  className={`rounded-xl shadow-sm overflow-hidden ${themeStyles.problemCard} border ${themeStyles.border} cursor-pointer transition-transform hover:scale-[1.02]`}
                  onClick={(e) => handleProblemClick(slug, e)}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className={`text-lg font-medium ${themeStyles.text}`}>
                        Problem {String.fromCharCode(65 + idx)}
                        {isSolved && (
                          <FiCheckCircle className="inline-block ml-2 text-green-500" />
                        )}
                        {!isSolved && isAttempted && (
                          <FiXCircle className="inline-block ml-2 text-red-500" />
                        )}
                      </h4>
                      <div className={`text-xs px-2 py-1 rounded-full ${themeStyles.firstSolveBadge}`}>
                        {firstSolve.username ? `First: ${firstSolve.username}` : 'Unsolved'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={themeStyles.secondaryText}>Acceptance Rate</span>
                          <span className="font-medium">{acceptanceRate}%</span>
                        </div>
                        <div className={`w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2`}>
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${acceptanceRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-3 rounded-lg ${themeStyles.card} text-center`}>
                          <div className={`text-sm ${themeStyles.secondaryText}`}>Attempts</div>
                          <div className={`text-xl font-bold ${themeStyles.text}`}>{stats.attempts || 0}</div>
                        </div>

                        <div className={`p-3 rounded-lg ${themeStyles.card} text-center`}>
                          <div className={`text-sm ${themeStyles.secondaryText}`}>Accepted</div>
                          <div className={`text-xl font-bold ${themeStyles.success}`}>{stats.accepted || 0}</div>
                        </div>
                      </div>

                      {firstSolve.time && (
                        <div className={`text-xs ${themeStyles.secondaryText}`}>
                          <FiClock className="inline mr-1" />
                          First solved in {formatTime(firstSolve.time)} by {firstSolve.username}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standings;