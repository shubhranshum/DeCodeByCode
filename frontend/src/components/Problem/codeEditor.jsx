import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { FiPlay, FiRefreshCw, FiMoon, FiSun } from "react-icons/fi";

const languageOptions = [
  { label: "C++", value: "cpp" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
];

export default function CodeEditor({ problemId ,onCodeChange }) {

  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState("// Write your solution here");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  useEffect(() => {
  const savedCode = localStorage.getItem(`code-${problemId}`);
  if (savedCode) {
    setCode(savedCode);
  }
}, [problemId]);
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    localStorage.setItem(`code-${problemId}`, newCode);
    if (onCodeChange) onCodeChange(newCode, stdin);
  };


  const handleStdinChange = (val) => {
    setStdin(val);
    if (onCodeChange) onCodeChange(code, val);
  };

  const handleRun = async () => {
    setOutput("Running...");
    // Integrate with Judge0 or your own backend later
    setTimeout(() => setOutput("// Sample output\n42"), 1500); // Mocked
  };

  const handleReset = () => {
    setCode("// Write your solution here");
    setStdin("");
    setOutput("");
  };

  return (
    <div className="bg-white/10 rounded-xl p-4 text-white space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex gap-3 items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800 text-white px-2 py-1 rounded-md"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              setTheme(theme === "vs-dark" ? "light" : "vs-dark")
            }
            className="text-xl p-2 hover:bg-slate-700 rounded-md"
            title="Toggle theme"
          >
            {theme === "vs-dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md flex items-center gap-1"
          >
            <FiPlay /> Run
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md flex items-center gap-1"
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <Editor
        height="400px"
        language={language}
        value={code}
        theme={theme}
        onChange={handleCodeChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          fontFamily: "monospace",
          automaticLayout: true,
        }}
      />

      {/* Stdin Input */}
      <div>
        <label className="text-sm text-slate-300 mb-1 block">Custom Input (stdin)</label>
        <textarea
          className="w-full h-24 p-2 bg-slate-800 text-white rounded-lg"
          placeholder="Enter input here..."
          value={stdin}
          onChange={(e) => handleStdinChange(e.target.value)}
        />
      </div>

      {/* Output */}
      <div>
        <label className="text-sm text-slate-300 mb-1 block">Output</label>
        <pre className="w-full h-32 p-2 overflow-auto bg-black text-green-400 rounded-lg">
          {output || "// Output will appear here"}
        </pre>
      </div>
    </div>
  );
}
