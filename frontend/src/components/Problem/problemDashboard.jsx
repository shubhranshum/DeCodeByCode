import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../Navbar/navbar.jsx";
import { getAllGlobalProblems } from "../Tasks/getAllGlobalProblems.jsx";
import { Search, ChevronRight, FileText, CheckCircle, User, Clock, Flame, Trophy } from "lucide-react";

// Custom hook for theme management
const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
  }, []);

  return theme;
};

// Mock hook for Problem of the Day
const useProblemOfTheDay = () => {
  const [problemOfTheDay, setProblemOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProblemOfTheDay({
        id: 'potd-123',
        title: 'Array Rotation Challenge',
        difficulty: 'Medium',
        description: 'Implement a function to rotate an array to the right by k steps.',
        tags: ['Arrays', 'Algorithms'],
        reward: 50
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { problemOfTheDay, loading };
};

// Enhanced Difficulty Badge component
const DifficultyBadge = ({ difficulty, theme }) => {
  const colors = {
    light: {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800"
    },
    dark: {
      Easy: "bg-green-900/50 text-green-300",
      Medium: "bg-yellow-900/50 text-yellow-300",
      Hard: "bg-red-900/50 text-red-300"
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${colors[theme][difficulty]}`}>
      {difficulty}
    </span>
  );
};

// ProblemCard component for better reusability
const ProblemCard = ({ problem, theme, onClick }) => {
  const themeColors = {
    light: {
      card: 'bg-white hover:bg-gray-50',
      title: 'text-purple-700',
      text: 'text-gray-700',
      meta: 'text-gray-500',
      button: 'bg-purple-600 hover:bg-purple-700 text-white'
    },
    dark: {
      card: 'bg-gray-900 hover:bg-gray-800',
      title: 'text-orange-300',
      text: 'text-gray-300',
      meta: 'text-gray-400',
      button: 'bg-orange-600 hover:bg-orange-700 text-white'
    }
  };

  return (
    <Card 
      className={`transition-all hover:shadow-lg ${themeColors[theme].card}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${themeColors[theme].title}`}>
              {problem.title}
            </h3>
            <p className={`text-sm ${themeColors[theme].text} line-clamp-1`}>
              {problem.statement || 'No description available'}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <DifficultyBadge difficulty={problem.difficulty} theme={theme} />
              <span className={`flex items-center gap-1 ${themeColors[theme].meta}`}>
                <User className="h-4 w-4" />
                {problem.user?.username || "Admin"}
              </span>
              <span className={`flex items-center gap-1 ${themeColors[theme].meta}`}>
                <CheckCircle className="h-4 w-4 text-green-500" />
                {problem.solvedCount || 0} solved
              </span>
              <span className={`flex items-center gap-1 ${themeColors[theme].meta}`}>
                <Clock className="h-4 w-4" />
                {new Date(problem.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className={`${themeColors[theme].button} flex items-center gap-1`}
          >
            Solve <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Problem of the Day Card
const ProblemOfTheDayCard = ({ problem, theme, loading }) => {
  const themeColors = {
    light: {
      card: 'bg-gradient-to-r from-purple-50 to-indigo-50',
      title: 'text-purple-800',
      text: 'text-gray-700',
      highlight: 'bg-purple-100 text-purple-800'
    },
    dark: {
      card: 'bg-gradient-to-r from-gray-800 to-gray-900',
      title: 'text-orange-300',
      text: 'text-gray-300',
      highlight: 'bg-orange-900/50 text-orange-300'
    }
  };

  if (loading) {
    return (
      <Card className={`${themeColors[theme].card} animate-pulse`}>
        <CardContent className="p-6">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${themeColors[theme].card} mb-8`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className={`text-sm font-medium ${themeColors[theme].highlight} px-2 py-1 rounded-full`}>
                Problem of the Day
              </span>
              {problem.reward && (
                <span className={`flex items-center gap-1 text-sm font-medium ${themeColors[theme].highlight} px-2 py-1 rounded-full`}>
                  <Trophy className="h-4 w-4" /> +{problem.reward} XP
                </span>
              )}
            </div>
            <h3 className={`text-xl font-bold ${themeColors[theme].title}`}>
              {problem.title}
            </h3>
            <p className={`${themeColors[theme].text}`}>
              {problem.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {problem.tags?.map(tag => (
                <span key={tag} className={`text-xs px-2 py-1 rounded ${themeColors[theme].highlight}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Button 
            variant="default" 
            size="lg"
            className={`${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-orange-600 hover:bg-orange-700'} text-white flex items-center gap-2`}
          >
            Solve Challenge <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProblemDashboard() {
  const theme = useTheme();
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { problemOfTheDay, loading: potdLoading } = useProblemOfTheDay();

  // Memoized filtered problems to avoid unnecessary recomputation
  const filteredProblems = useMemo(() => {
    return problems.filter(problem =>
      problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.statement?.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [problems, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    
    async function loadProblems() {
      try {
        setIsLoading(true);
        const data = await getAllGlobalProblems();
        if (isMounted) {
          setProblems(data);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProblems();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProblemClick = (problemId) => {
    window.location.href = `/problems/${problemId}`;
  };

  const themeColors = {
    light: {
      background: 'bg-gray-50',
      search: 'bg-white border-gray-300 focus:ring-purple-500 focus:border-purple-500',
      searchIcon: 'text-gray-400',
      emptyState: 'text-gray-900'
    },
    dark: {
      background: 'bg-gray-950',
      search: 'bg-gray-900 border-gray-700 focus:ring-orange-500 focus:border-orange-500',
      searchIcon: 'text-gray-500',
      emptyState: 'text-gray-100'
    }
  };

  return (
    <>
      <Navbar activePage={"Problems"} />
      <div className={`min-h-screen ${themeColors[theme].background} px-4 py-8`}>
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className={`absolute left-3 top-3 h-5 w-5 ${themeColors[theme].searchIcon}`} />
            <input
              type="text"
              placeholder="Search problems by title or description..."
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none ${themeColors[theme].search}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Problem of the Day Section */}
          {problemOfTheDay && (
            <ProblemOfTheDayCard 
              problem={problemOfTheDay} 
              theme={theme} 
              loading={potdLoading} 
            />
          )}

          {/* Problems List Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${themeColors[theme].emptyState}`}>
              All Problems
            </h2>
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {filteredProblems.length} problems found
            </span>
          </div>

          {/* Problems List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-5/6 mb-4"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  theme={theme}
                  onClick={() => handleProblemClick(problem._id)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className={`text-lg font-medium mb-2 ${themeColors[theme].emptyState}`}>
                  No problems found
                </h3>
                <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {searchQuery ? "Try a different search term" : "No problems available yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}