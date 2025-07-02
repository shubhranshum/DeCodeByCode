import React from 'react';

const CertificationsSection = ({ certifications }) => {
  if (!certifications?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">Certifications</h2>
        <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add
        </button>
      </div>
      
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex items-start p-3 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 mr-3">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 dark:text-gray-200 truncate">{cert.title}</h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm">{cert.issuer}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-500 dark:text-gray-400 text-xs">
                  Issued {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                {cert.url && (
                  <a 
                    href={cert.url} 
                    target="_blank" 
                    rel="noopener" 
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs"
                  >
                    View Credential
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsSection;