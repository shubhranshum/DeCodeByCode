import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiLock, FiUnlock, FiCalendar, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getContestById } from '../Tasks/getContestById'; // Adjust the import based on your API structure

// Mock data - replace with your API calls

export default function ContestView() {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const data = await getContestById(contestId);
        console.log(data)
        setContest(data);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load contest');
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  if (loading) return <div className="text-center py-20">Loading contest...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!contest) return <div className="text-center py-20">Contest not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contest Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{contest.title}</h1>
              <p className="mt-2 text-gray-600">{contest.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="mr-1" />
                {new Date(contest.startTime).toLocaleString()} - {new Date(contest.endTime).toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-1" />
                {contest.duration} minutes
              </div>
              <div className="flex items-center text-sm text-gray-500">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Problems Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center">
              <FiList className="mr-2" /> Problems
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {contest.Problems.map((problem) => (
              <Link
                key={problem._id}
                to={`/contest/${contestId}/problems/${problem._id}`}
                className="block hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      problem.solved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {problem.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{problem.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {problem.solved && (
                      <span className="text-green-600">Solved</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contest Stats (optional) */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FiList className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Problems</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {contest.Problems.length}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Solved</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {contest.Problems.filter(p => p.solved).length}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                  <FiClock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Time Remaining</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {Math.floor(contest.duration / 60)}h {contest.duration % 60}m
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}