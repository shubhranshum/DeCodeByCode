import React from "react";
const ContestCard = ({ contest }) => (

  <div className="bg-gray-800/50 hover:bg-gray-700/50 transition-all rounded-lg p-4 border border-gray-700 hover:border-orange-500/30">
    <div className="flex justify-between items-start gap-2">
      <div>
        <h3 className="font-medium text-orange-300 hover:underline">
          <a href={`/contests/${contest._id}`}target="_blank" rel="noopener noreferrer">
            {contest.title}
          </a>
        </h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-300">
          {/* <span>{contest.platform}</span> */}
          <span className="text-gray-500">•</span>
          <span>{contest.duration} minutes</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-small font-mono">{formatDateToDMYHM(contest.startTime)}</div>
        <div className="text-xs text-gray-400">{contest.creator?.username}</div>
      </div>
    </div>
    <div className="mt-3 flex justify-between items-center text-xs">
      <button className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 px-3 py-1 rounded transition-colors">
        Remind Me
      </button>

      
    </div>
  </div>
);

function formatDateToDMYHM(isoDateStr) {
  const date = new Date(isoDateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

export default ContestCard;