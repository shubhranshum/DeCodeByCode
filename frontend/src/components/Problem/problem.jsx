import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmissionCodeEditor from "./submissionCodeEditor.jsx";
import codeOutput from "./output.jsx";

import MathjaxRenderer from "../MathjaxRenderer";
import { time } from "framer-motion";


export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your solution here");
  const [verdict, setVerdict] = useState(null);
  const [activeTab, setActiveTab] = useState("problem");
  const [isLoading, setIsLoading] = useState(true);
  console.log("Problem ID:", id);
  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/problem/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProblem(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load problem:", err);
        setIsLoading(false);
      });
  }, [id]);

  const handleCodeSubmit = async (code) => {
    let isCorrect = true;
    var userOutput = null;
    var maxTimeTaken = 0;
    var maxMemoryUsed = 0;
    for(let i = 0 ; i < problem.testCases.length; i++) {
      setVerdict("Running on test case: " + (i + 1));
      const testCase = problem.testCases[i];
      userOutput = await codeOutput(code,testCase.input);
      const correctOutput = testCase.output;
      maxTimeTaken = Math.max(maxTimeTaken, userOutput.time);
      maxMemoryUsed = Math.max(maxMemoryUsed, userOutput.memory);
      if((userOutput.status_id != 3)) {
        setVerdict(userOutput.status.description + "On Test Case: " + i+1);
        isCorrect = false;
        break;
      }
      if(userOutput.stdout !== correctOutput.stdout){
        setVerdict("Wrong Answer on Test Case: " + (i + 1));
        userOutput.stderr = "Wrong Answer on Test Case: " + (i + 1)
        isCorrect = false;
        break;
      }
    }
    if(isCorrect) {
      // by om vrit
      const response = await fetch(`http://localhost:3000/problem/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          problemid: id,
          solution: code,
          solved: true,
          status : "Accepted",
          timetaken: maxTimeTaken,
          memorytaken: maxMemoryUsed

        }),
      });
      const data = await response.json();
      console.log(data);
      // by om vrit
      
      
      setVerdict("Accepted")


    }
    else{
      const response = await fetch(`http://localhost:3000/problem/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          problemid: id,
          solution: code,
          status : userOutput.stderr,
          timetaken: maxTimeTaken,
          memorytaken: maxMemoryUsed
        }),
      });
      const data = await response.json();
      console.log(data);
    }

  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-300">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Problem Not Found</h2>
          <p className="text-gray-300">The requested problem could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-orange-500">{problem.title}</h1>
        <div className="flex items-center mt-2 text-sm text-gray-400">
          <span className="mr-4">Problem ID: {id}</span>
          <span className={`px-2 py-1 rounded ${verdict === "Accepted" ? 'bg-green-900 text-green-300' : verdict && verdict.includes("Wrong") ? 'bg-red-900 text-red-300' : 'bg-gray-700 text-gray-300'}`}>
            {verdict ? verdict : "Not Submitted"}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row p-4 gap-4">
        {/* Problem Description Panel */}
        <div className="lg:w-1/2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              className={`px-4 py-3 font-medium ${activeTab === "problem" ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab("problem")}
            >
              Description
            </button>
            <button
              className={`px-4 py-3 font-medium ${activeTab === "testcases" ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab("testcases")}
            >
              Test Cases
            </button>
          </div>

          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
            {activeTab === "problem" ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-200">Problem Statement</h2>
                  <p><MathjaxRenderer html={problem.statement} /></p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-200">Input Format</h2>
                  <div className="bg-gray-700 p-4 rounded-md font-mono text-gray-200">
                  <MathjaxRenderer html={problem.inputFormat} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-200">Output Format</h2>
                  <div className="bg-gray-700 p-4 rounded-md font-mono text-gray-200">
                  <MathjaxRenderer html={problem.outputFormat} />
                  </div>
                </div>
                <div className="test-cases-container">
        <h2 className="text-xl font-bold text-gray-200">Test Cases</h2>

        {problem.testCases.map((testCase, index) => (
          <div key={index} className="test-case">
            <h3>Test Case {index + 1}</h3>

            <div className="input-section">
              <h4>Input:</h4>
              <pre>{JSON.stringify(testCase.input, null, 2)}</pre>
            </div>

            <div className="output-section">
              <h4>Output:</h4>
              <pre>{JSON.stringify(testCase.output.stdout, null, 2)}</pre>
            </div>
            {testCase.explanation && (
              <div className="explanation-section">
                <h4>Explanation:</h4>
                <p>{testCase.explanation}</p>
              </div>
            )}
          </div>
          ))}
        </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-200">Notes</h2>
                  <div className="bg-gray-700 p-4 rounded-md font-mono text-gray-200">
                  <MathjaxRenderer html={problem.notes} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {problem.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-600 px-4 py-2 font-medium">Test Case {index + 1}</div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Input</h3>
                        <div className="bg-gray-800 p-3 rounded font-mono text-sm">
                          {testCase.input || "NO INPUT TESTCASE"}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Expected Output</h3>
                        <div className="bg-gray-800 p-3 rounded font-mono text-sm">
                          {testCase.output?.stdout || "NO EXPECTED OUTPUT"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
              <h2 className="font-medium">Code Editor</h2>
            </div>
            <div className="h-full">
              <SubmissionCodeEditor
                language="cpp"
                onCodeChange={(code) => setCode(code)}
              />
            </div>
          </div>

          <div className="mt-4 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 border-b border-gray-600 flex justify-between items-center">
              <h2 className="font-medium">Output</h2>
              <button
                className="bg-orange-600 hover:bg-orange-700 px-4 py-1 rounded text-sm font-medium transition-colors"
                onClick={() => handleCodeSubmit(code)}
              >
                Submit Code
              </button>
            </div>
            <div className="p-4 font-mono text-sm min-h-20">
              {verdict ? (
                <div className={`p-3 rounded ${verdict === "Accepted" ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                  {verdict}
                </div>
              ) : (
                <div className="text-gray-500">Your code output will appear here...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}