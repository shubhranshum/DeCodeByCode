import React from 'react';

const SocialLinks = ({ socialLinks }) => {
  const platforms = [
    { name: 'github', icon: 'github.svg', label: 'GitHub' },
    { name: 'linkedin', icon: 'linkedin.svg', label: 'LinkedIn' },
    { name: 'twitter', icon: 'twitter.svg', label: 'Twitter' },
    { name: 'website', icon: 'globe.svg', label: 'Website' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {platforms.map((platform) => {
        const url = socialLinks?.[platform.name];
        if (!url) return null;
        
        return (
          <a
            key={platform.name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <div className="bg-slate-100 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
              <img 
                src={`/icons/${platform.icon}`} 
                alt={platform.label} 
                className="w-4 h-4" 
              />
            </div>
            <span className="text-sm">{platform.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;