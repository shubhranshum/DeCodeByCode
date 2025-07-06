import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../Navbar/navbar.jsx";
import { getAllGlobalProblems } from "../Tasks/getAllGlobalProblems.jsx";
import { Search, ChevronRight, FileText, CheckCircle, User, Clock } from "lucide-react";

export default function ProblemDashboard() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProblems() {
      try {
        setIsLoading(true);
        const data = await getAllGlobalProblems();
        setProblems(data);
        // console.log("Problem: ",problems)
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProblems();
  }, []);

  const filteredProblems = problems.filter(problem =>
    problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.statement?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DifficultyBadge = ({ difficulty }) => {
    const colors = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800"
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <>
      <Navbar activePage={"Problems"} />
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Problems List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <Card
                  key={problem._id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/problems/${problem._id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{problem.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <DifficultyBadge difficulty={problem.difficulty} />
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {problem.user?.username || "Admin"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {problem.acceptedSolutions || 0} solved
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(problem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                      >
                        Solve <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No problems found
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? "Try a different search" : "No problems available yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}