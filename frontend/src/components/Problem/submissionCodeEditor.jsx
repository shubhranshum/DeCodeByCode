import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function SubmissionCodeEditor({ language = "cpp", onCodeChange }) {
  const [code, setCode] = useState("// Write your solution here");

  const handleCodeChange = (code) => {
    setCode(code);
    if (onCodeChange) onCodeChange(code);
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
        </>
    </div>
  );
}
