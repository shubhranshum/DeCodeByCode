import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  FiClock, 
  FiBarChart2,
  FiLock,
  FiCalendar,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiUser
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getContestById } from '../Tasks/getContestById';
import { getContestSolvedProblems } from '../Tasks/getContestSolvedProblems';
import { getContestAttemptedProblems } from '../Tasks/getContestAttemptedProblems';

// Theme configuration
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

// ContestStats component
const ContestStats = ({ contest, solvedProblems }) => {
  const theme = localStorage.getItem('theme') || 'light';
  
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <StatCard
        icon={
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        iconBg={themes[theme].primary}
        title="Total Problems"
        value={contest.Problems.length}
      />
      <StatCard
        icon={<FiCheckCircle className="h-6 w-6 text-white" />}
        iconBg={themes[theme].success}
        title="Solved"
        value={solvedProblems.length}
      />
      <StatCard
        icon={<FiClock className="h-6 w-6 text-white" />}
        iconBg={themes[theme].danger}
        title="Time Remaining"
        value={<TimeRemaining endTime={contest.endTime} />}
      />
    </div>
  );
};

// StatCard component
const StatCard = ({ icon, iconBg, title, value }) => {
  const theme = localStorage.getItem('theme') || 'light';
  
  return (
    <div className={`${themes[theme].card} overflow-hidden shadow rounded-xl`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBg} rounded-lg p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className={`text-sm font-medium ${themes[theme].secondaryText} truncate`}>{title}</dt>
            <dd className="flex items-baseline">
              <div className={`text-2xl font-semibold ${themes[theme].text}`}>
                {value}
              </div>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

// TimeRemaining component
const TimeRemaining = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const theme = localStorage.getItem('theme') || 'light';

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
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <span className={themes[theme].text}>{timeLeft}</span>;
};

// ProblemCard component
const ProblemCard = ({ problem, index, contestId, isSolved, isAttempted, startTime }) => {
  const theme = localStorage.getItem('theme') || 'light';
  
  return (
    <Link
    to={`/contests/${contestId}/problems/${problem._id}`}
    state={{ startTime }}
    className={`block ${themes[theme].hover} transition duration-150 ease-in-out rounded-xl overflow-hidden shadow-sm ${themes[theme].card} border ${themes[theme].border}`}
  >
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isSolved
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : isAttempted
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            <span className="font-medium">{String.fromCharCode(65 + index)}</span>
          </div>
          <div>
            <h3 className={`text-lg font-medium ${themes[theme].text}`}>{problem.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  problem.difficulty === "Easy"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {problem.difficulty}
              </span>
              <span className={`text-xs ${themes[theme].secondaryText}`}>
                {problem.points} points
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {isSolved ? (
            <FiCheckCircle className="text-green-500 dark:text-green-400" />
          ) : isAttempted ? (
            <FiXCircle className="text-yellow-500 dark:text-yellow-400" />
          ) : (
            <div className="w-5 h-5"></div>
          )}
          <FiChevronRight className={`ml-2 ${themes[theme].secondaryText}`} />
        </div>
      </div>
    </Link>
  );
};

// AnnouncementCard component
const AnnouncementCard = ({ announcement }) => {
  const theme = localStorage.getItem('theme') || 'light';
  
  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${themes[theme].card} border ${themes[theme].border}`}>
      <div className="px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-lg font-medium ${themes[theme].text}`}>{announcement.title}</h3>
            <p className={`mt-2 ${themes[theme].secondaryText}`}>{announcement.content}</p>
          </div>
          <span className={`text-sm ${themes[theme].secondaryText}`}>{announcement.time}</span>
        </div>
      </div>
    </div>
  );
};

// ContestHeader component
const ContestHeader = ({ contest }) => {
  const theme = localStorage.getItem('theme') || 'light';

  
  return (
    <div className={`${themes[theme].card} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className={`text-3xl font-bold ${themes[theme].text}`}>{contest.title}</h1>
            <p className={`mt-2 ${themes[theme].secondaryText}`}>{contest.description}</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <div className={`flex items-center text-sm px-3 py-1 rounded-full ${themes[theme].accentBg}`}>
              <FiCalendar className="mr-1" />
              <span className={themes[theme].text}>
                {new Date(contest.startTime).toLocaleString()}
              </span>
            </div>
            <div className={`flex items-center text-sm px-3 py-1 rounded-full ${themes[theme].accentBg}`}>
              <FiClock className="mr-1" />
              <span className={themes[theme].text}>
                {contest.duration} minutes
              </span>
            </div>
            <div className={`flex items-center text-sm px-3 py-1 rounded-full ${
              contest.isPrivate 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {contest.isPrivate ? (
                <FiLock className="mr-1" />
              ) : null}
              {contest.isPrivate ? 'Private' : 'Public'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ContestView() {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [attemptedProblems, setAttemptedProblems] = useState([]);
  const [activeTab, setActiveTab] = useState('problems');
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Contest has started!',
      content: 'Good luck to all participants! The contest has officially begun. Remember to read all problems carefully and manage your time wisely.',
      time: '10 minutes ago',
    },
    {
      id: 2,
      title: 'Clarification on Problem B',
      content: 'The output for Problem B should be case-insensitive. We apologize for any confusion this may have caused.',
      time: '25 minutes ago',
    },
  ]);
  const theme = localStorage.getItem('theme') || 'light';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const data = await getContestById(contestId);
        const solved = await getContestSolvedProblems(contestId);
        const attempted = await getContestAttemptedProblems(contestId);
        setContest(data);
        setSolvedProblems(solved.map(problem => problem.problemId));
        setAttemptedProblems(attempted.map(problem => problem.problemId));
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load contest');
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  if (loading) return (
    <div className={`flex items-center justify-center min-h-screen ${themes[theme].background}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-purple-500 mx-auto"></div>
        <p className={`mt-4 text-lg ${themes[theme].text}`}>Loading contest details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={`flex items-center justify-center min-h-screen ${themes[theme].background}`}>
      <div className={`text-center p-6 rounded-xl ${themes[theme].card} shadow-md`}>
        <p className={`text-red-500 text-lg`}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className={`mt-4 px-4 py-2 rounded-lg ${themes[theme].primaryBg} ${themes[theme].primary} font-medium`}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!contest) return (
    <div className={`flex items-center justify-center min-h-screen ${themes[theme].background}`}>
      <div className={`text-center p-6 rounded-xl ${themes[theme].card} shadow-md`}>
        <p className={`text-lg ${themes[theme].text}`}>Contest not found</p>
        <Link 
          to="/contests"
          className={`mt-4 inline-block px-4 py-2 rounded-lg ${themes[theme].primaryBg} ${themes[theme].primary} font-medium`}
        >
          Back to Contests
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${themes[theme].background}`}>
      <ContestHeader contest={contest} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'problems'
                  ? `${themes[theme].tabActive}`
                  : `${themes[theme].tabInactive}`
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => navigate(`/contests/${contestId}/standings`)}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
                activeTab === 'standings'
                  ? `${themes[theme].tabActive}`
                  : `${themes[theme].tabInactive}`
              }`}
            >
              <FiBarChart2 className="mr-2" />
              Standings
            </button>
          </nav>
        </div>

        {/* Problems Tab Content */}
        {activeTab === 'problems' && (
          <div className="space-y-6">
            <ContestStats contest={contest} solvedProblems={solvedProblems} />
            
            <div className="space-y-4">
              <h2 className={`text-xl font-semibold ${themes[theme].text}`}>Problems</h2>
              <div className="grid grid-cols-1 gap-4">
                {contest.Problems.map((problem, index) => (
                  <ProblemCard
                    key={problem._id}
                    problem={problem}
                    index={index}
                    contestId={contestId}
                    isSolved={solvedProblems.includes(problem._id)}
                    isAttempted={attemptedProblems.includes(problem._id)}
                    startTime={contest.startTime}
                  />
                ))}
              </div>
            </div>

            {/* Announcements Section */}
            <div className="mt-8 space-y-4">
              <h2 className={`text-xl font-semibold ${themes[theme].text}`}>Announcements</h2>
              <div className="grid grid-cols-1 gap-4">
                {announcements.map((announcement) => (
                  <AnnouncementCard 
                    key={announcement.id} 
                    announcement={announcement} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Standings Tab Content - Handled by separate route */}
        <Outlet />
      </main>
    </div>
  );
}