import React, { useState } from 'react';
import {useParams} from 'react-router-dom';

export default function GeneralInfoSection({generalInfo, setGeneralInfo}) {
    const { id } = useParams();
    const [savedTimeLimit, setSavedTimeLimit] = useState(generalInfo.timeLimit || 1);
    const [savedMemoryLimit, setSavedMemoryLimit] = useState(generalInfo.memoryLimit || 256);
    const handleSave = async () => {
        if(savedTimeLimit < 1 || savedTimeLimit > 5) {
            alert("Time limit must be between 1 and 5 seconds.");
            return;
        }
        if(savedMemoryLimit < 1 || savedMemoryLimit > 256) {
            alert("Memory limit must be between 1 and 256 MB.");
            return;
        }

        // Save the time and memory limits
        setGeneralInfo({
          timeLimit: savedTimeLimit,
          memoryLimit: savedMemoryLimit,
        })
        try{
          const response = await fetch(`http://localhost:3000/admin/edit-problem/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session management
            body: JSON.stringify({
              timeLimit: Number(savedTimeLimit),
              memoryLimit: savedMemoryLimit,
            }),
          })
          if (!response.ok) {
            throw new Error("Failed to save problem data");
          }
          else{
            console.log("Problem Data Saved:", generalInfo);
            alert("Problem data saved successfully!");
          }
        }
        catch (error) {
          console.error("Error saving problem data:", error);
          alert("Failed to save problem data. Please try again.");
          return;
        }
        alert("General Info Saved Successfully!");
      };


    return (
      <div>
        {/* <SectionSwitcherCard /> */}
        <div className="space-y-6 text-white">
          <h2 className="text-2xl font-bold mb-4">General Info</h2>

          {/* Time Limit */}
          <div>
            <label htmlFor="timeLimit" className="block mb-1 font-semibold">
              Time Limit (in seconds)
            </label>
            <input
              type="number"
              id="timeLimit"
              min="1"
              max="5"
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter time limit e.g. 1"
              value={savedTimeLimit}
              onChange={(e) => setSavedTimeLimit(e.target.value)}
            />
          </div>

          {/* Memory Limit */}
          <div>
            <label htmlFor="memoryLimit" className="block mb-1 font-semibold">
              Memory Limit (in MB)
            </label>
            <input
              type="number"
              id="memoryLimit"
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter memory limit e.g. 256"
              value={savedMemoryLimit}
              onChange={(e) => setSavedMemoryLimit(e.target.value)}
            />
          </div>
          <button
        onClick={handleSave}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
        Save General Info
      </button>
      <div>
        Memory Limit : {generalInfo.timeLimit} MB<br/>
        Time Limit : {generalInfo.memoryLimit} seconds
      </div>
        </div>
        </div>
      );
}
