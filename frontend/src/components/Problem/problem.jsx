import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmissionCodeEditor from "./submissionCodeEditor.jsx";
import codeOutput from "./output.jsx";
import MathjaxRenderer from "../MathjaxRenderer";



import { ClipboardCopy, Sun, Moon, CheckCircle, XCircle, ChevronRight } from "lucide-react";


export default function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your solution here");
  const [verdict, setVerdict] = useState(null);
  const [activeTab, setActiveTab] = useState("problem");
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

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

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTestCaseData = (data) => {
    if (!data) return "No data";
    
    if (typeof data === 'string') {
      // Format input/output strings with line numbers
      return (
        <div className="font-mono text-sm">
          {data.split('\n').map((line, i) => (
            <div key={i} className="flex hover:bg-opacity-10 hover:bg-white">
              <span className="text-gray-500 w-8 flex-shrink-0">{i + 1}.</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      );
    }
    
    try {
      const parsed = JSON.parse(data);
      return <pre>{JSON.stringify(parsed, null, 2)}</pre>;
    } catch {
      return <pre>{data}</pre>;
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 border-4 ${darkMode ? 'border-blue-400' : 'border-blue-600'} border-t-transparent rounded-full animate-spin`}></div>
          <p className={`mt-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-xl shadow-lg text-center ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Problem Not Found</h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>The requested problem could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 shadow-sm`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{problem.title}</h1>
            <div className="flex items-center mt-2 text-sm">
              <span className={`mr-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Problem ID: {id}</span>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                verdict === "Accepted" ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800') : 
                verdict && verdict.includes("Wrong") ? (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800') : 
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
              }`}>
                {verdict ? verdict : "Not Submitted"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description Panel */}
        <div className={`rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm overflow-hidden`}>
          <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              className={`px-4 py-3 font-medium text-sm flex-1 ${
                activeTab === "problem" ? 
                (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
                (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
              }`}
              onClick={() => setActiveTab("problem")}
            >
              Description
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm flex-1 ${
                activeTab === "testcases" ? 
                (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
                (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
              }`}
              onClick={() => setActiveTab("testcases")}
            >
              Test Cases
            </button>
          </div>

          <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            {activeTab === "problem" ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Problem Statement</h2>
                  <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                    <MathjaxRenderer html={problem.statement} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Input Format</h2>
                  <div className={`p-4 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <MathjaxRenderer html={problem.inputFormat} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Output Format</h2>
                  <div className={`p-4 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <MathjaxRenderer html={problem.outputFormat} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Notes</h2>
                  <div className={`p-4 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <MathjaxRenderer html={problem.notes} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {problem.testCases.map((testCase, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className={`px-4 py-2 border-b flex justify-between items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center">
                        <span className={`rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                          {index + 1}
                        </span>
                        <span className="font-medium">Test Case {index + 1}</span>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium flex items-center">
                            <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              I
                            </span>
                            Input
                          </h3>
                          <button
                            onClick={() => copyToClipboard(testCase.input, `input-${index}`)}
                            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            {copiedIndex === `input-${index}` ? (
                              <CheckCircle size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                            ) : (
                              <ClipboardCopy size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                            )}
                          </button>
                        </div>
                        <div className={`p-3 rounded border font-mono text-sm overflow-x-auto ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          {formatTestCaseData(testCase.input)}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium flex items-center">
                            <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                              O
                            </span>
                            Expected Output
                          </h3>
                          <button
                            onClick={() => copyToClipboard(testCase.output?.stdout, `output-${index}`)}
                            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          >
                            {copiedIndex === `output-${index}` ? (
                              <CheckCircle size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
                            ) : (
                              <ClipboardCopy size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                            )}
                          </button>
                        </div>
                        <div className={`p-3 rounded border font-mono text-sm overflow-x-auto ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                          {formatTestCaseData(testCase.output?.stdout)}
                        </div>
                      </div>
                    </div>
                    {testCase.explanation && (
                      <div className={`px-4 py-3 border-t ${darkMode ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                        <h3 className="text-sm font-medium flex items-center mb-1">
                          <span className={`rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 ${darkMode ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'}`}>
                            E
                          </span>
                          Explanation
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>{testCase.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="flex flex-col gap-4">
          <div className={`rounded-lg border shadow-sm overflow-hidden flex-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-4 py-2 border-b flex justify-between items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h2 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Code Editor</h2>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>C++</span>
              </div>
            </div>
            <div className="h-full">
              <SubmissionCodeEditor
                language="cpp"
                onCodeChange={(code) => setCode(code)}
                darkMode={darkMode}
              />
            </div>
          </div>

          <div className={`rounded-lg border shadow-sm overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-4 py-2 border-b flex justify-between items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <h2 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Output</h2>
              <button
                className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-1 transition-colors ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={() => handleCodeSubmit(code)}
              >
                Submit Code <ChevronRight size={16} />
              </button>
            </div>
            <div className="p-4 font-mono text-sm min-h-20">
              {verdict ? (
                <div className={`p-3 rounded flex items-center ${
                  verdict === "Accepted" ? 
                  (darkMode ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-800 border border-green-200') : 
                  (darkMode ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-800 border border-red-200')
                }`}>
                  {verdict === "Accepted" ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2" />
                  )}
                  <span>{verdict}</span>
                </div>
              ) : (
                <div className={`italic ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Your code output will appear here...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}