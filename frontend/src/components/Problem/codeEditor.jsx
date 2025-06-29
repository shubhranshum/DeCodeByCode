import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language = "cpp", onCodeChange }) {
  const [code, setCode] = useState("// Write your solution here");
  const [stdin, setStdin] = useState("");

  const handleCodeChange = (code) => {
    setCode(code);
    if (onCodeChange) onCodeChange(code,stdin);
  };
  const handleStdinChange = (stdin) => {
    setStdin(stdin);
    if (onCodeChange) onCodeChange(code,stdin);
  };

  return (
    <div className="bg-white/10 rounded-xl p-4">
      <>
      <Editor
        height="400px"
        defaultLanguage={language}
        defaultValue={code}
        theme="vs-dark"
        mt="10"
        onChange={handleCodeChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          fontFamily: "monospace",
          automaticLayout: true,
        }}
      />
      </>
      <>
      <textarea
        className="w-full h-24 p-2 mt-4 bg-white-800 text-black rounded-lg"
        placeholder="Enter input here..."
        value={stdin}
        onChange={(e) => handleStdinChange(e.target.value)}
        />
        </>
    </div>
  );
}
