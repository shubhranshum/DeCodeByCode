import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiLock, FiUnlock, FiCalendar, FiList, FiAward, FiBell, FiBarChart2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getContestById } from '../Tasks/getContestById';
import { getContestSolvedProblems } from '../Tasks/getContestSolvedProblems';
import { getContestAttemptedProblems } from '../Tasks/getContestAttemptedProblems';

// Theme configuration
const themes = {
  light: {
    bg: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    secondaryText: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
  },
  dark: {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-white',
    secondaryText: 'text-gray-300',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
  }
};

// Navigation tabs configuration
const tabs = [
  { id: 'problems', name: 'Problems', icon: <FiList /> },
  { id: 'announcements', name: 'Announcements', icon: <FiBell /> },
  { id: 'standings', name: 'Standings', icon: <FiBarChart2 /> },
];

// ContestStats component
const ContestStats = ({ contest, solvedProblems }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <StatCard
        icon={<FiList className="h-6 w-6 text-white" />}
        iconBg="bg-blue-500"
        title="Total Problems"
        value={contest.Problems.length}
      />
      <StatCard
        icon={
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
        iconBg="bg-green-500"
        title="Solved"
        value={solvedProblems.length}
      />
      <StatCard
        icon={<FiClock className="h-6 w-6 text-white" />}
        iconBg="bg-orange-500"
        title="Time Remaining"
        value={
          <TimeRemaining endTime={contest.endTime} />
        }
      />
    </div>
  );
};

// StatCard component
const StatCard = ({ icon, iconBg, title, value }) => {
  const theme = localStorage.getItem('theme') || 'light';
  return (
    <div className={`${themes[theme].card} overflow-hidden shadow rounded-lg`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBg} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
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

  return <>{timeLeft}</>;
};

// ProblemsList component
const ProblemsList = ({ contest, contestId, solvedProblems, attemptedProblems }) => {
  const theme = localStorage.getItem("theme") || "light";

  return (
    <div className={`${themes[theme].card} shadow rounded-lg overflow-hidden`}>
      <div className={`px-6 py-4 border-b ${themes[theme].border}`}>
        <h2 className={`text-xl font-semibold flex items-center ${themes[theme].text}`}>
          <FiList className="mr-2" /> Problems
        </h2>
      </div>
      <div className={`divide-y ${themes[theme].border}`}>
        {contest.Problems.map((problem, index) => (
          <Link
            key={problem._id}
            to={`/contests/${contestId}/problems/${problem._id}`}
            state={{
              startTime: contest.startTime,
              verdict: solvedProblems.includes(problem._id)
                ? "Accepted"
                : attemptedProblems.includes(problem._id)
                ? "Attempted"
                : "Unattempted"
            }}
            className={`block ${themes[theme].hover} transition duration-150 ease-in-out`}
          >
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    solvedProblems.includes(problem._id)
                      ? "bg-green-100 text-green-800"
                      : attemptedProblems.includes(problem._id)
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {/* Show index as A, B, C, ... */}
                  {String.fromCharCode(65 + index)}
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${themes[theme].text}`}>{problem.title}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-800"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>
              <div className="text-sm">
                {solvedProblems.includes(problem._id) ? (
                  <span className="text-green-600">Solved</span>
                ) : attemptedProblems.includes(problem._id) ? (
                  <span className="text-yellow-600">Attempted</span>
                ) : (
                  <span className={`${themes[theme].secondaryText}`}>Unattempted</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Announcements component
const Announcements = () => {
  const theme = localStorage.getItem('theme') || 'light';
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Contest has started!',
      content: 'Good luck to all participants!',
      time: '10 minutes ago',
    },
    {
      id: 2,
      title: 'Clarification on Problem B',
      content: 'The output for Problem B should be case-insensitive.',
      time: '25 minutes ago',
    },
  ]);

  return (
    <div className={`${themes[theme].card} shadow rounded-lg overflow-hidden`}>
      <div className={`px-6 py-4 border-b ${themes[theme].border}`}>
        <h2 className="text-xl font-semibold flex items-center">
          <FiBell className="mr-2" /> Announcements
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-lg font-medium ${themes[theme].text}`}>{announcement.title}</h3>
                <p className={`mt-1 ${themes[theme].secondaryText}`}>{announcement.content}</p>
              </div>
              <span className={`text-sm ${themes[theme].secondaryText}`}>{announcement.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Standings component
const Standings = ({ contestId }) => {
  const theme = localStorage.getItem('theme') || 'light';
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStandings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockStandings = [
        { rank: 1, username: 'user1', solved: 5, totalTime: 120 },
        { rank: 2, username: 'user2', solved: 4, totalTime: 180 },
        { rank: 3, username: 'user3', solved: 4, totalTime: 210 },
      ];
      setStandings(mockStandings);
    } catch (error) {
      toast.error('Failed to load standings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
    const interval = setInterval(fetchStandings, 15 * 60 * 1000); // Refresh every 15 minutes
    return () => clearInterval(interval);
  }, [contestId]);

  return (
    <div className={`${themes[theme].card} shadow rounded-lg overflow-hidden`}>
      <div className={`px-6 py-4 border-b ${themes[theme].border}`}>
        <h2 className="text-xl font-semibold flex items-center">
          <FiBarChart2 className="mr-2" /> Current Standings
        </h2>
      </div>
      {loading ? (
        <div className="px-6 py-4 text-center">Loading standings...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${themes[theme].card}`}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${themes[theme].secondaryText} uppercase tracking-wider`}>Rank</th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${themes[theme].secondaryText} uppercase tracking-wider`}>User</th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${themes[theme].secondaryText} uppercase tracking-wider`}>Solved</th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${themes[theme].secondaryText} uppercase tracking-wider`}>Total Time</th>
              </tr>
            </thead>
            <tbody className={`${themes[theme].card} divide-y ${themes[theme].border}`}>
              {standings.map((standing) => (
                <tr key={standing.username} className={`${themes[theme].hover}`}>
                  <td className={`px-6 py-4 whitespace-nowrap ${themes[theme].text}`}>{standing.rank}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${themes[theme].text}`}>{standing.username}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${themes[theme].text}`}>{standing.solved}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${themes[theme].text}`}>{standing.totalTime} mins</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className={`flex items-center text-sm ${themes[theme].secondaryText}`}>
              <FiCalendar className="mr-1" />
              {new Date(contest.startTime).toLocaleString()} - {new Date(contest.endTime).toLocaleString()}
            </div>
            <div className={`flex items-center text-sm ${themes[theme].secondaryText}`}>
              <FiClock className="mr-1" />
              {contest.duration} minutes
            </div>
            <div className={`flex items-center text-sm ${themes[theme].secondaryText}`}>
              {contest.isPrivate ? (
                <FiLock className="mr-1 text-red-500" />
              ) : (
                <FiUnlock className="mr-1 text-green-500" />
              )}
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
  const theme = localStorage.getItem('theme') || 'light';

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

  if (loading) return <div className={`text-center py-20 ${themes[theme].text}`}>Loading contest...</div>;
  if (error) return <div className={`text-center py-20 text-red-500 ${themes[theme].bg}`}>{error}</div>;
  if (!contest) return <div className={`text-center py-20 ${themes[theme].text}`}>Contest not found</div>;

  return (
    <div className={`min-h-screen ${themes[theme].bg}`}>
      <ContestHeader contest={contest} />
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : `${themes[theme].secondaryText} ${themes[theme].hover}`
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Tab Content */}
        {activeTab === 'problems' && (
          <>
            <ProblemsList 
              contest={contest} 
              contestId={contestId} 
              solvedProblems={solvedProblems} 
              attemptedProblems={attemptedProblems} 
            />
            <ContestStats contest={contest} solvedProblems={solvedProblems} />
          </>
        )}

        {activeTab === 'announcements' && (
          <>
            <Announcements />
            <ContestStats contest={contest} solvedProblems={solvedProblems} />
          </>
        )}

        {activeTab === 'standings' && (
          <Standings contestId={contestId} />
        )}
      </main>
    </div>
  );
}