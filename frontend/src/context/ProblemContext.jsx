// src/context/ProblemContext.jsx

import { createContext, useContext, useState } from "react";

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
  const [problem, setProblem] = useState({
    title: "",
    statement: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    notes: "",
    timeLimit: 1,
    memoryLimit: 256,
    solution: "",
    testCases: [] // { input: "...", output: "..." }
  });

  return (
    <ProblemContext.Provider value={{ problem, setProblem }}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblem = () => useContext(ProblemContext);
