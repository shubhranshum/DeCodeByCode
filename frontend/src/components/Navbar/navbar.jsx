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
  UserCircleIcon
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

const ProfileDropdown = ({ user, onSignOut }) => {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-2 focus:outline-none group">
        {user?.profilePicture ? (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent group-hover:border-indigo-500 transition-colors"
          >
            <img 
              src={user.profilePicture} 
              alt={user.username} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
            <span className="font-semibold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">{user?.username}</p>
          <p className="text-xs text-indigo-200">{user?.college || 'No college'}</p>
        </div>
      </MenuButton>

      <AnimatePresence>
        <MenuItems 
          as={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          
          <div className="p-1">
            <MenuItem>
              {({ active }) => (
                <a
                  href={`/profile/u/${user.username}`}

                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm rounded-md flex items-center gap-2'
                  )}
                >
                  <UserCircleIcon className="h-4 w-4" />
                  Your Profile
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm rounded-md flex items-center gap-2'
                  )}
                >
                  <BellIcon className="h-4 w-4" />
                  Notifications
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm rounded-md flex items-center gap-2'
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
              )}
            </MenuItem>
          </div>
          
          <div className="p-1 border-t border-gray-100">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={onSignOut}
                  className={classNames(
                    active ? 'bg-red-50 text-red-700' : 'text-red-600',
                    'w-full text-left px-4 py-2 text-sm rounded-md flex items-center gap-2'
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
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
          setUser(userData);
          // Simulate having notifications (in a real app, this would come from an API)
          setHasNotifications(Math.random() > 0.5);
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

  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-gray-900 to-indigo-900 fixed w-full z-50 top-0 shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo and desktop navigation */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="bg-indigo-600 rounded-lg p-1">
                    <svg className="w-8 h-8 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.35709 16V5.78571c0-.43393.34822-.78571.77777-.78571H18.5793c.4296 0 .7778.35178.7778.78571V16M5.35709 16h-1c-.55229 0-1 .4477-1 1v1c0 .5523.44771 1 1 1H20.3571c.5523 0 1-.4477 1-1v-1c0-.5523-.4477-1-1-1h-1M5.35709 16H19.3571M9.35709 8l2.62501 2.5L9.35709 13m4.00001 0h2"/>
                    </svg>
                  </div>
                  <span className="ml-3 text-xl font-bold text-white hidden sm:block">DeCodeByCode</span>
                </div>
                
                <div className="hidden md:ml-8 md:block">
                  <div className="flex space-x-1">
                    {navigation.map((item) => (
                      (!((item.name === "Problems" || item.name === "Admin") && !user) && 
                       !(item.name === "Admin" && user && !user.isAdmin)) && (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current 
                              ? 'bg-indigo-800 text-white' 
                              : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white',
                            'rounded-lg px-3 py-2 text-sm font-medium flex items-center transition-all duration-200 group'
                          )}
                        >
                          <item.icon className="h-5 w-5 mr-2 flex-shrink-0 group-hover:text-indigo-300" />
                          {item.name}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <DisclosureButton
                  className="inline-flex items-center justify-center rounded-md p-2 text-indigo-200 hover:bg-indigo-800 hover:text-white focus:outline-none"
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
              <div className="flex items-center">
                {user ? (
                  <>
                    <button
                      type="button"
                      className="relative rounded-full p-1 text-indigo-200 hover:text-white focus:outline-none"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <div className="relative">
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        {hasNotifications && (
                          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-indigo-900" />
                        )}
                      </div>
                    </button>
                    
                    <ProfileDropdown user={user} onSignOut={handleSignOut} />
                  </>
                ) : (
                  <div className="flex items-center space-x-4">
                    <a 
                      href="/login" 
                      className="px-3 py-1.5 text-sm font-medium text-indigo-200 hover:text-white transition-colors"
                    >
                      Log in
                    </a>
                    <a 
                      href="/signup" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      Sign up
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                (!((item.name === "Problems" || item.name === "Admin") && !user) && 
                 !(item.name === "Admin" && user && !user.isAdmin)) && (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white',
                      'block rounded-lg px-3 py-2 text-base font-medium flex items-center'
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </DisclosureButton>
                )
              ))}
              
              {!user && (
                <div className="flex space-x-2 pt-2 border-t border-indigo-800/50">
                  <DisclosureButton
                    as="a"
                    href="/login"
                    className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </DisclosureButton>
                  <DisclosureButton
                    as="a"
                    href="/signup"
                    className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign up
                  </DisclosureButton>
                </div>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}