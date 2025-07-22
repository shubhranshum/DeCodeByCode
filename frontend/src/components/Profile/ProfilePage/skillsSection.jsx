import React from 'react';

const SkillsSection = ({ skills, onEditClick, allowEdit, theme }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">Skills & Expertise</h2>
        {allowEdit && (
          <button
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium"
            onClick={onEditClick}
          >
            + Add Skill
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map(skill => (
            <span
              key={skill}
              className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-slate-500 dark:text-gray-400">No skills added yet</p>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;