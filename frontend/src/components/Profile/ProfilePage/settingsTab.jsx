
const SettingsTab = ({ profile, theme, toggleTheme }) => {
  console.log(profile);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md p-6 transition-colors">
      <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100 mb-6">Account Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">First Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-800 dark:text-gray-200" 
                defaultValue={profile.firstName || ''}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">Last Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-800 dark:text-gray-200" 
                defaultValue={profile.lastName || ''}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-800 dark:text-gray-200" 
                defaultValue={profile.email || ''}
                readOnly = {true}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-1">Location</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-800 dark:text-gray-200" 
                defaultValue={`${profile.city}, ${profile.state}, ${profile.country}`}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-2">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-800 dark:text-gray-200">Theme</div>
              <div className="text-sm text-slate-500 dark:text-gray-400">Change interface theme</div>
            </div>
            <button 
              onClick={toggleTheme}
              className="bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              <svg 
                className="w-5 h-5" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {theme === 'light' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-2">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800 dark:text-gray-200">Password</div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Last changed 3 months ago</div>
              </div>
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Change Password
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800 dark:text-gray-200">Two-Factor Authentication</div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Add extra security to your account</div>
              </div>
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200 dark:border-gray-700 flex justify-end">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;