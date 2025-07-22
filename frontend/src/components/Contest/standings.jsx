import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBarChart2,
  FiChevronRight,
  FiAward, // Used for rank badges
  FiStar, // For first solve
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getContestBySlug } from '../Tasks/getContestBySlug';
import { getContestSolvedProblems } from '../Tasks/getContestSolvedProblems';
import { getContestAttemptedProblems } from '../Tasks/getContestAttemptedProblems';

// Define a comprehensive theme object for light and dark modes
const themes = {
  light: {
    background: 'bg-gray-100',
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
    tableHeader: 'bg-blue-50', // Light blue header
    tableRow: 'bg-white',
    tableRowHighlight: 'bg-blue-100', // Highlight for current user
    problemCard: 'bg-white',
    firstSolveBadge: 'bg-yellow-100 text-yellow-800', // Yellow for first solve
    rankBackground: ['bg-yellow-100', 'bg-gray-200', 'bg-yellow-800'], // Gold, Silver, Bronze for background
    rankText: ['text-yellow-700', 'text-gray-700', 'text-amber-800'] // Gold, Silver, Bronze for text
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
    tableHeader: 'bg-purple-950', // Darker purple header
    tableRow: 'bg-gray-800',
    tableRowHighlight: 'bg-purple-800', // Highlight for current user
    problemCard: 'bg-gray-700',
    firstSolveBadge: 'bg-yellow-900 text-yellow-300', // Darker yellow for first solve
    rankBackground: ['bg-yellow-800', 'bg-gray-700', 'bg-amber-900'],
    rankText: ['text-yellow-200', 'text-gray-200', 'text-amber-200']
  }
};

const StatCard = ({ icon, iconBgClass, title, value, currentTheme }) => {
  const themeStyles = themes[currentTheme];
  return (
    <div className={`${themeStyles.card} overflow-hidden shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-xl p-4 ${iconBgClass}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className={`text-sm font-medium ${themeStyles.secondaryText} truncate`}>{title}</dt>
            <dd className="flex items-baseline">
              <div className={`text-3xl font-extrabold ${themeStyles.text}`}>
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
      const days = Math.floor(diffInSeconds / (3600 * 24));
      const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      let timeParts = [];
      if (days > 0) timeParts.push(`${days}d`);
      if (hours > 0) timeParts.push(`${hours}h`);
      if (minutes > 0 && days === 0) timeParts.push(`${minutes}m`); // Only show minutes if no days
      if (seconds > 0 && days === 0 && hours === 0) timeParts.push(`${seconds}s`); // Only show seconds if no hours/days

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
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>}
        iconBgClass="bg-blue-500 text-white"
        title="Total Problems"
        value={contest.Problems.length}
        currentTheme={currentTheme}
      />
      <StatCard
        icon={<FiCheckCircle className="h-8 w-8 text-white" />}
        iconBgClass="bg-green-500 text-white"
        title="Problems Solved"
        value={solvedProblemsCount}
        currentTheme={currentTheme}
      />
      <StatCard
        icon={<FiClock className="h-8 w-8 text-white" />}
        iconBgClass="bg-red-500 text-white"
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
          // Assuming these functions return problem objects or IDs directly related to the current user
          const solved = await getContestSolvedProblems(contestData._id);
          const attempted = await getContestAttemptedProblems(contestData._id);
          setSolvedProblemIds(solved.map(p => p.problemId));
          setAttemptedProblemIds(attempted.map(p => p.problemId));
        } catch (statusError) {
          console.error("Failed to load user problem status:", statusError);
          // Don't set global error for this, as it's user-specific data
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

      // Filter to only consider submissions within the contest duration if applicable
      // This logic depends on how submission times are recorded vs contest start time
      standingsData.forEach(user => {
        const problemResult = user.problemResults.find(p => p.problemId === problem._id);
        if (!problemResult) return;

        stats[slug].attempts += problemResult.attempts;

        if (problemResult.verdict === "Accepted") {
          stats[slug].accepted++;

          // Check for first solve based on timeFromStart (which should be relative to contest start)
          if (!stats[slug].firstSolve || problemResult.timeFromStart < stats[slug].firstSolve.time) {
            stats[slug].firstSolve = {
              username: user.userId.username,
              time: problemResult.timeFromStart,
              rank: user.rank
            };
          }

          // Fastest solve logic (using executionTime if available, else timeFromStart as a fallback for consistency)
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
        <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${themeStyles.primary} mb-6`}></div>
        <p className={`mt-4 text-xl font-semibold ${themeStyles.text}`}>Loading contest data...</p>
        <p className={`text-base ${themeStyles.secondaryText} mt-2`}>Please wait a moment while we prepare the standings.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeStyles.background}`}>
        <div className={`text-center p-8 rounded-2xl ${themeStyles.card} shadow-lg border ${themeStyles.border}`}>
          <p className={`text-xl font-semibold ${themeStyles.danger} mb-4`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-4 px-6 py-3 rounded-lg ${themeStyles.primaryBg} ${themeStyles.primary} font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-md`}
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
        <div className={`text-center p-8 rounded-2xl ${themeStyles.card} shadow-lg border ${themeStyles.border}`}>
          <p className={`text-xl font-semibold ${themeStyles.text} mb-4`}>Contest not found</p>
          <Link
            to="/contests"
            className={`mt-4 inline-block px-6 py-3 rounded-lg ${themeStyles.primaryBg} ${themeStyles.primary} font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-md`}
          >
            Back to Contests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${themeStyles.background} min-h-screen p-4 sm:p-6`}>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-10 text-center">
          <h1 className={`text-5xl font-extrabold ${themeStyles.text} mb-3 leading-tight`}>
            Contest Standings
          </h1>
          <p className={`text-xl ${themeStyles.secondaryText} flex justify-center items-center`}>
            <span>{contest.title}</span>
            <FiChevronRight className="mx-2 text-xl" />
            <span>{problems.length} Problems</span>
            <FiChevronRight className="mx-2 text-xl" />
            <span>{standings.length} Participants</span>
          </p>
        </div>

        {contest && (
          <ContestStats
            contest={contest}
            solvedProblemsCount={solvedProblemIds.length}
            currentTheme={currentTheme}
          />
        )}

        {currentUserStanding && (
          <div className={`my-8 p-6 rounded-2xl shadow-xl overflow-hidden ${themeStyles.tableRowHighlight} border ${themeStyles.border} transition-all duration-300 hover:shadow-2xl`}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h3 className={`text-2xl font-bold flex items-center ${themeStyles.primary}`}>
                <FiUser className={`mr-3 text-3xl`} />
                Your Performance
              </h3>
              <div className="flex flex-wrap justify-center sm:justify-end items-center mt-4 sm:mt-0 space-x-6 sm:space-x-8">
                <div className="text-center">
                  <div className={`text-sm ${themeStyles.secondaryText}`}>Rank</div>
                  <div className={`text-3xl font-bold ${themeStyles.text}`}>
                    <span className={`${themeStyles.rankText[Math.min(currentUserStanding.rank - 1, 2)]}`}>
                      #{currentUserStanding.rank}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-sm ${themeStyles.secondaryText}`}>Solved</div>
                  <div className={`text-3xl font-bold ${themeStyles.success}`}>
                    {currentUserStanding.totalSolved}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-sm ${themeStyles.secondaryText}`}>Penalty</div>
                  <div className={`text-3xl font-bold ${themeStyles.text}`}>
                    {currentUserStanding.totalPenalty}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
              {problems.map((problem, idx) => {
                const isSolved = solvedProblemIds.includes(problem._id);
                const isAttempted = attemptedProblemIds.includes(problem._id);
                const result = currentUserStanding.problemResults.find(p => p.problemId === problem._id);

                return (
                  <div
                    key={problem._id}
                    onClick={(e) => handleProblemClick(problem.slug, e)}
                    className={`p-4 rounded-xl text-center cursor-pointer transition-all duration-200 hover:scale-105 transform ${
                      isSolved
                        ? `${themeStyles.successBg} border border-green-300 dark:border-green-700`
                        : isAttempted
                          ? `${themeStyles.dangerBg} border border-red-300 dark:border-orange-700`
                          : `${themeStyles.card} border ${themeStyles.border}`
                    } shadow-sm`}
                  >
                    <div className={`font-extrabold text-xl mb-1 ${
                      isSolved
                        ? themeStyles.success
                        : isAttempted
                          ? themeStyles.danger
                          : themeStyles.text
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="text-sm">
                      {result ? (
                        result.verdict === "Accepted" ? (
                          <span className={`flex items-center justify-center font-semibold ${themeStyles.success}`}>
                            <FiCheckCircle className="inline mr-1" />
                            {result.attempts > 1 ? `+${result.attempts - 1}` : ''}
                          </span>
                        ) : (
                          <span className={`flex items-center justify-center font-semibold ${themeStyles.danger}`}>
                            <FiXCircle className="inline mr-1" />
                            {result.attempts}
                          </span>
                        )
                      ) : isAttempted ? (
                        <span className={`flex items-center justify-center font-semibold ${themeStyles.danger}`}>
                          <FiXCircle className="inline mr-1" />
                          0
                        </span>
                      ) : <span className={`${themeStyles.secondaryText}`}>—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={`rounded-2xl shadow-xl overflow-hidden ${themeStyles.card} border ${themeStyles.border}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y ${themeStyles.border}">
              <thead className={`${themeStyles.tableHeader}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${themeStyles.secondaryText} uppercase tracking-wider`}>Rank</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${themeStyles.secondaryText} uppercase tracking-wider`}>Participant</th>
                  {problems.map((problem, idx) => (
                    <th
                      key={problem._id}
                      className={`px-4 py-4 text-center text-xs font-bold ${themeStyles.secondaryText} uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:${themeStyles.accentBg}`}
                      onClick={(e) => handleProblemClick(problem.slug, e)}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-base">{String.fromCharCode(65 + idx)}</span>
                        <span className="text-xxs mt-1 opacity-70">({problemStats[problem.slug]?.accepted || 0}/{problemStats[problem.slug]?.attempts || 0})</span>
                      </div>
                    </th>
                  ))}
                  <th className={`px-6 py-4 text-left text-xs font-bold ${themeStyles.secondaryText} uppercase tracking-wider`}>Solved</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${themeStyles.secondaryText} uppercase tracking-wider`}>Penalty</th>
                </tr>
              </thead>

              <tbody className={`divide-y ${themeStyles.border}`}>
                {standings.map((user, idx) => (
                  <tr
                    key={user.userId._id}
                    className={`
                      ${user.userId.username === currentUser ? themeStyles.tableRowHighlight : themeStyles.tableRow}
                      transition-colors duration-150 ease-in-out hover:${themeStyles.hover}
                    `}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeStyles.text}`}>
                      <div className="flex items-center">
                        <span className="font-semibold text-lg mr-2">{idx + 1}</span>
                        {idx === 0 && <FiAward className={`text-yellow-500 text-xl`} />}
                        {idx === 1 && <FiAward className={`text-gray-400 text-xl`} />}
                        {idx === 2 && <FiAward className={`text-orange-600 text-xl`} />}
                      </div>
                    </td>

                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm cursor-pointer`}
                      onClick={(e) => handleUserClick(user.userId.username, e)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                            src={user.userId.profilePicture || `https://ui-avatars.com/api/?name=${user.userId.username}&background=random&size=128`}
                            alt={user.userId.username}
                          />
                        </div>
                        <div className="ml-4">
                          <div className={`font-semibold ${themeStyles.text} hover:underline`}>
                            {user.userId.username}
                            {user.userId.username === currentUser && (
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${themeStyles.primaryBg} ${themeStyles.primary}`}>
                                YOU
                              </span>
                            )}
                          </div>
                          <div className={`text-xs ${themeStyles.secondaryText}`}>
                            {user.userId.organization || 'Individual'}
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
                                <span className={`font-bold text-lg ${themeStyles.success}`}>
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
                              <span className={`font-bold text-lg ${themeStyles.danger}`}>
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

                    <td className={`px-6 py-4 whitespace-nowrap font-bold text-center text-lg`}>
                      <span className={`px-4 py-1 rounded-full ${themeStyles.successBg} ${themeStyles.success}`}>
                        {user.totalSolved}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-lg font-bold ${themeStyles.text}`}>
                      {user.totalPenalty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12">
          <h3 className={`text-3xl font-bold mb-8 ${themeStyles.text} flex items-center`}>
            <FiBarChart2 className={`inline mr-3 text-4xl ${themeStyles.primary}`} />
            Problem Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  className={`rounded-2xl shadow-lg overflow-hidden ${themeStyles.problemCard} border ${themeStyles.border} cursor-pointer transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl`}
                  onClick={(e) => handleProblemClick(slug, e)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className={`text-xl font-bold ${themeStyles.text}`}>
                        Problem {String.fromCharCode(65 + idx)}
                        {isSolved && (
                          <FiCheckCircle className="inline-block ml-3 text-green-500 text-2xl" />
                        )}
                        {!isSolved && isAttempted && (
                          <FiXCircle className="inline-block ml-3 text-red-500 text-2xl" />
                        )}
                      </h4>
                      <div className={`text-sm px-3 py-1.5 rounded-full font-semibold ${themeStyles.firstSolveBadge}`}>
                        {firstSolve.username ? (
                          <span className="flex items-center">
                            <FiStar className="mr-1" /> First by: {firstSolve.username}
                          </span>
                        ) : 'Not Solved Yet'}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-base mb-1">
                          <span className={themeStyles.secondaryText}>Acceptance Rate</span>
                          <span className={`font-bold ${themeStyles.text}`}>{acceptanceRate}%</span>
                        </div>
                        <div className={`w-full ${currentTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-3`}>
                          <div
                            className={`${currentTheme === 'dark' ? 'bg-green-500' : 'bg-green-600'} h-3 rounded-full`}
                            style={{ width: `${acceptanceRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg ${themeStyles.background} text-center border ${themeStyles.border}`}>
                          <div className={`text-sm ${themeStyles.secondaryText}`}>Attempts</div>
                          <div className={`text-2xl font-extrabold ${themeStyles.text}`}>{stats.attempts || 0}</div>
                        </div>

                        <div className={`p-4 rounded-lg ${themeStyles.background} text-center border ${themeStyles.border}`}>
                          <div className={`text-sm ${themeStyles.secondaryText}`}>Accepted</div>
                          <div className={`text-2xl font-extrabold ${themeStyles.success}`}>{stats.accepted || 0}</div>
                        </div>
                      </div>

                      {firstSolve.time && (
                        <div className={`text-sm ${themeStyles.secondaryText} text-center pt-2`}>
                          <FiClock className="inline mr-1" />
                          First solved in <span className="font-semibold">{formatTime(firstSolve.time)}</span> by <span className="font-semibold">{firstSolve.username}</span>
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