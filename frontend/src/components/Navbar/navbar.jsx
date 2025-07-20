import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { 
  Bars3Icon, 
  BellIcon, 
  XMarkIcon, 
  HomeIcon, 
  TrophyIcon, 
  CodeBracketIcon, 
  AcademicCapIcon, 
  BookOpenIcon, 
  InformationCircleIcon, 
  ShieldCheckIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useEffect, useState, useContext } from 'react';
import {UserContext} from '../../context/UserContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon, current: false },
  { name: 'BattleGround', href: '/contests', icon: TrophyIcon, current: false },
  { name: 'Problems', href: '/problems', icon: CodeBracketIcon, current: false },
  { name: 'Learn', href: '/learn', icon: AcademicCapIcon, current: false },
  { name: 'Blogs', href: '/blogs', icon: BookOpenIcon, current: false },
  { name: 'About Us', href: '/about-us', icon: InformationCircleIcon, current: false },
  { name: "Admin", href: '/admin', icon: ShieldCheckIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Notifications Popover Component
const NotificationsPopover = ({ isOpen, onClose, notifications, markAsRead }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl bg-slate-800/95 backdrop-blur-xl shadow-2xl ring-1 ring-slate-700/50 focus:outline-none z-50 overflow-hidden border border-slate-700/50"
      >
        <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600/30 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-100">Notifications</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-slate-700/50">
              {notifications.map((notification) => (
                <li key={notification._id} className="hover:bg-slate-700/50 transition-colors">
                  <button 
                    onClick={() => markAsRead(notification._id)}
                    className="w-full text-left p-4 flex items-start gap-3 group"
                  >
                    {/* <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.type} flex items-center justify-center mt-1`}>
                      <notification.icon className="h-5 w-5 text-white" />
                    </div> */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                          {notification.type}
                        </p>
                        {notification.isRead ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{notification.createdAt}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <BellIcon className="h-12 w-12 mx-auto text-slate-500" />
              <p className="mt-4 text-slate-400">No notifications yet</p>
              <p className="text-xs text-slate-500 mt-2">We'll notify you when something arrives</p>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-slate-800/80 border-t border-slate-700/50">
          <button
            onClick={() => markAsRead('all')}
            className="w-full text-center text-sm text-blue-400 hover:text-blue-300 font-medium py-2"
          >
            Mark all as read
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Profile Dropdown Component
const ProfileDropdown = ({ user, onSignOut }) => {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm border border-slate-700/50">
        {user?.profilePicture ? (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-600 hover:ring-blue-500 transition-all duration-200"
          >
            <img 
              src={user.profilePicture} 
              alt={user.username} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-slate-600 hover:ring-blue-500 transition-all duration-200"
          >
            <span className="font-semibold text-sm text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </motion.div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-slate-100">{user?.username}</p>
          <p className="text-xs text-slate-400">{user?.college || 'No college'}</p>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-slate-400 hidden md:block" />
      </MenuButton>

      <AnimatePresence>
        <MenuItems 
          as={motion.div}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-slate-800/95 backdrop-blur-xl shadow-2xl ring-1 ring-slate-700/50 focus:outline-none z-50 overflow-hidden border border-slate-700/50"
        >
          {/* Profile Header */}
          <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600/30">
            <div className="flex items-center gap-3">
              {user?.profilePicture ? (
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-600">
                  <img 
                    src={user.profilePicture} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-slate-600">
                  <span className="font-semibold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{user?.username}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                  {user?.isAdmin && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <MenuItem>
              {({ active }) => (
                <a
                  href={`/profile/u/${user.username}`}
                  className={classNames(
                    active ? 'bg-slate-700/50 text-slate-100' : 'text-slate-300',
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 hover:bg-slate-700/50'
                  )}
                >
                  <UserCircleIcon className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Your Profile</p>
                    <p className="text-xs text-slate-500">Manage your account</p>
                  </div>
                </a>
              )}
            </MenuItem>
            
            <MenuItem>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-slate-700/50 text-slate-100' : 'text-slate-300',
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 hover:bg-slate-700/50'
                  )}
                >
                  <BellIcon className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Notifications</p>
                    <p className="text-xs text-slate-500">View your alerts</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    3
                  </span>
                </a>
              )}
            </MenuItem>
            
            <MenuItem>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-slate-700/50 text-slate-100' : 'text-slate-300',
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 hover:bg-slate-700/50'
                  )}
                >
                  <Cog6ToothIcon className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Settings</p>
                    <p className="text-xs text-slate-500">Preferences & privacy</p>
                  </div>
                </a>
              )}
            </MenuItem>
          </div>
          
          {/* Divider */}
          <div className="border-t border-slate-600/30 my-1"></div>
          
          {/* Sign Out */}
          <div className="py-2">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={onSignOut}
                  className={classNames(
                    active ? 'bg-red-500/10 text-red-400' : 'text-red-400',
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 hover:bg-red-500/10'
                  )}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Sign out</p>
                    <p className="text-xs text-red-500/70">End your session</p>
                  </div>
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </AnimatePresence>
    </Menu>
  );
};

export default function Navbar({ activePage }) {
  const { user, setUser } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  
  const [notifications, setNotifications] = useState([]);
  

  navigation.forEach(item => {
    if (item.name === activePage) {
      item.current = true;
    } else {
      item.current = false;
    }
  });

  const { user, setUser } = useContext(UserContext);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      console.log("Hello from fetchNotifications");
      const res = await fetch('http://localhost:3000/notifications', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.ok) {
        const notificationsData = await res.json();
        setNotifications(notificationsData);
      } else {
        console.log('Error fetching notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/home', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (res.ok) {
          const userData = await res.json();
          console.log('Fetched user:', userData);
          setUser(userData);
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    if (!user) {
      fetchUser();
    }
    
    fetchNotifications();
    
  }, [user, setUser]);

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    fetchNotifications();
  };

  const markAsRead = async(id) => {
    if (id === 'all') {
      for(const notification of notifications){
        const res = await fetch(`http://localhost:3000/notifications/read/${notification.id}`, {
          method: 'POST',
          credentials: 'include',
        })
        if(res.ok){
          setNotifications(notifications.map(n => 
            n.id === notification.id ? { ...n, read: true } : n
          ));
        }
      }
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } else {
      const res = await fetch(`http://localhost:3000/notifications/read/${id}`, {
        method: 'POST',
        credentials: 'include',
      })
      if(res.ok){
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ));
      }
    }
  };

  return (
    <Disclosure as="nav" className="bg-slate-900/95 backdrop-blur-lg fixed w-full z-50 top-0 shadow-2xl border-b border-slate-700/50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo and desktop navigation */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2 shadow-lg"
                  >
                    <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.35709 16V5.78571c0-.43393.34822-.78571.77777-.78571H18.5793c.4296 0 .7778.35178.7778.78571V16M5.35709 16h-1c-.55229 0-1 .4477-1 1v1c0 .5523.44771 1 1 1H20.3571c.5523 0 1-.4477 1-1v-1c0-.5523-.4477-1-1-1h-1M5.35709 16H19.3571M9.35709 8l2.62501 2.5L9.35709 13m4.00001 0h2"/>
                    </svg>
                  </motion.div>
                  <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
                    DeCodeByCode
                  </span>
                </div>
                
                <div className="hidden md:ml-10 md:block">
                  <div className="flex space-x-2">
                    {navigation.map((item) => (
                      (!((item.name === "Problems" || item.name === "Admin") && !user) && 
                       !(item.name === "Admin" && user && !user.isAdmin)) && (
                        <motion.a
                          key={item.name}
                          href={item.href}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={classNames(
                            item.current 
                              ? 'bg-slate-800 text-white shadow-lg border border-slate-700' 
                              : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent',
                            'rounded-xl px-4 py-2 text-sm font-medium flex items-center transition-all duration-200 group backdrop-blur-sm'
                          )}
                        >
                          <item.icon className="h-4 w-4 mr-2 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                          {item.name}
                        </motion.a>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <DisclosureButton
                  className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Right section */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="relative rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                        onClick={toggleNotifications}
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <div className="relative">
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                          {unreadCount > 0 && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 ring-2 ring-slate-900 flex items-center justify-center"
                            >
                              <span className="text-xs text-white font-medium">{unreadCount}</span>
                            </motion.span>
                          )}
                        </div>
                      </motion.button>
                      
                      <NotificationsPopover 
                        isOpen={notificationsOpen} 
                        onClose={() => setNotificationsOpen(false)}
                        notifications={notifications}
                        markAsRead={markAsRead}
                      />
                    </div>
                    
                    <ProfileDropdown user={user} onSignOut={handleSignOut} />
                  </>
                ) : (
                  <div className="flex items-center space-x-3">
                    <motion.a 
                      href="/login" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-xl hover:bg-slate-800/50"
                    >
                      Log in
                    </motion.a>
                    <motion.a 
                      href="/signup" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Sign up
                    </motion.a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <DisclosurePanel 
                as={motion.div}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-slate-800/95 backdrop-blur-lg border-t border-slate-700/50"
              >
                <div className="space-y-2 px-4 pt-4 pb-6">
                  {navigation.map((item) => (
                    (!((item.name === "Problems" || item.name === "Admin") && !user) && 
                     !(item.name === "Admin" && user && !user.isAdmin)) && (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current 
                            ? 'bg-slate-700 text-white border-l-4 border-blue-500' 
                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border-l-4 border-transparent',
                          'block rounded-r-xl px-4 py-3 text-base font-medium flex items-center transition-all duration-200'
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        {item.name}
                      </DisclosureButton>
                    )
                  ))}
                  
                  {!user && (
                    <div className="flex space-x-3 pt-4 border-t border-slate-700/50">
                      <DisclosureButton
                        as="a"
                        href="/login"
                        className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                      >
                        Log in
                      </DisclosureButton>
                      <DisclosureButton
                        as="a"
                        href="/signup"
                        className="flex-1 text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                      >
                        Sign up
                      </DisclosureButton>
                    </div>
                  )}
                </div>
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}

// Missing icon component (for mock data)
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);