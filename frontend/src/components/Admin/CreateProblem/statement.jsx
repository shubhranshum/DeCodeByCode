import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

export default function StatementSection({ statement, setStatement }) {
  const { id } = useParams();

  const [problemData, setProblemData] = useState(statement || {
    title: "",
    statement: "",
    difficulty: "",
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    notes: "",
  });

  const handleChange = (e) => {
    setProblemData({ ...problemData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { title, statement, difficulty, inputFormat, outputFormat } = problemData;

    if (!title || !statement || !difficulty || !inputFormat || !outputFormat) {
      alert("Please fill in all required fields.");
      return;
    }

    setStatement(problemData);

    try {
      const response = await fetch(`http://localhost:3000/admin/edit-problem/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // for cookies/session
        body: JSON.stringify(problemData),
      });

      if (!response.ok) {
        throw new Error("Failed to save problem data");
      }

      console.log("Problem Data Saved:", problemData);
      alert("Problem data saved successfully!");
    } catch (error) {
      console.error("Error saving problem data:", error);
      alert("Failed to save problem data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl bg-white/10 p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Create or Edit Problem</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm mb-1">Problem Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter the title of the problem"
              value={problemData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Problem Statement</label>
            <textarea
              name="statement"
              placeholder="Describe the problem here"
              value={problemData.statement}
              onChange={handleChange}
              className="w-full p-4 rounded-md bg-white/20 text-white placeholder-white/70 h-40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={problemData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white focus:outline-none"
            >
              <option value="">Select difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Constraints</label>
            <textarea
              name="constraints"
              placeholder="Mention constraints here"
              value={problemData.constraints}
              onChange={handleChange}
              className="w-full p-4 rounded-md bg-white/20 text-white placeholder-white/70 h-24 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Input Format</label>
            <textarea
              name="inputFormat"
              placeholder="Describe the input format"
              value={problemData.inputFormat}
              onChange={handleChange}
              className="w-full p-4 rounded-md bg-white/20 text-white placeholder-white/70 h-24 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Output Format</label>
            <textarea
              name="outputFormat"
              placeholder="Describe the output format"
              value={problemData.outputFormat}
              onChange={handleChange}
              className="w-full p-4 rounded-md bg-white/20 text-white placeholder-white/70 h-24 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Notes</label>
            <textarea
              name="notes"
              placeholder="Additional notes"
              value={problemData.notes}
              onChange={handleChange}
              className="w-full p-4 rounded-md bg-white/20 text-white placeholder-white/70 h-24 focus:outline-none"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="mt-6 w-full">
          Save
        </Button>
      </div>
    </div>
  );
}
