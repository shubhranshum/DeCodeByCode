import React,{useEffect,useState} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "../Navbar/navbar.jsx";
import { fetchAllProblems } from "../Tasks/fetchAllProblems.jsx"; // Assuming you have a service to fetch problem details

export default function ProblemDashboard() {
  window.href = "/problems";
  // Fetch all problems from the backend
  const [problems, setProblems] = useState([]); // Initialize with props or empty array
  useEffect(() => {
    async function loadProblems() {
      try {
        const allProblems = await fetchAllProblems();
        console.log("All problems fetched:", allProblems);
        // console.log("Fetched problems:", problems);
        setProblems(allProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    }

    loadProblems();
  },[])
  console.log("Fetched problems:", problems);
  return (
    <>
      <Navbar activePage={"Problems"}/>
      <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white px-6 py-10 mt-12">
        {/* Problem of the Day */}
        <section className="bg-white/10 border-2 border-orange-400 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Problem of the day</h2>
            <h1 className="text-2xl font-bold mb-4 font-mono">GCD makes equal</h1>
          {/* <p className="mb-2 text-white/80">
            You are given an array <code>a</code>, you can do the below described operation on it.
          </p>
          <p className="mb-2 text-white/80">
            <strong>Operation:</strong> Choose any two indices <code>i, j</code> and replace <code>a[j] → a[j] / gcd(a[i], a[j])</code>.
          </p>
          <p className="mb-6 text-white/80">
            Find the minimum number of operations to make all the elements of the array equal. If not possible return -1.
          </p> */}
          <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded-lg shadow"
          onClick={() => window.location.href = "/problem/1"}
          >
            SUBMIT YOUR SOLUTION
          </Button>
        </section>

        {/* Problem List */}
        <section className="bg-white/5 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold mb-6">Problem List</h2>

            <div className="bg-transparent mb-4 space-x-4 flex">
                Daily Problems
            </div>

            <Card className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <CardContent className="text-white/90">
              <ul className="space-y-2">
                {problems.map((problem) => (
                  <li
                    // key={index}
                    className="text-lg font-medium hover:underline cursor-pointer"
                    onClick={() => window.location.href = `/problem/${problem._id}`}
                  >
                    {problem.title}. {problem.title}
                  </li>
                ))}
              </ul>
              </CardContent>
            </Card>
        </section>
      </main>
    </>
  );
}
