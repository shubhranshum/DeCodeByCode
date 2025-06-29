import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {useUser} from '../../context/UserContext.jsx';
import { useEffect } from 'react';
import ProfileDropdown from '../Cards/profileDropdown.jsx';

const navigation = [
  { name: 'Home', href: '/home', current: false },
  { name: 'BattleGround', href: '#', current: false },
  { name: 'Problems', href: '/problems', current: false },
  { name: 'Learn', href: '/learn', current: false },
  { name: 'Blogs', href: '/blogs', current: false },
  {name: 'About Us', href: '/about-us', current: false},
  {name: "Admin", href: '/admin', current: false},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar({activePage}) {
  navigation.forEach(item => {
    if(item.name === activePage) {
      item.current = true;
    }
  })
  const { user , setUser} = useUser();
  // console.log("User in Navbar:", user);
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
          } else {
            console.log('User not logged in');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      // If user is null, fetch from backend
      if (!user) {
        fetchUser();
      }
    }, [user, setUser]);

    const handleSignOut = async () => {
      console.log("Signing out...");
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
    <Disclosure as="nav" className="bg-gray-800 fixed w-full z-50 top-0 mb-10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center pr-8">
            <svg class="w-10 h-10 text-blue-300 dark:text-blue" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.35709 16V5.78571c0-.43393.34822-.78571.77777-.78571H18.5793c.4296 0 .7778.35178.7778.78571V16M5.35709 16h-1c-.55229 0-1 .4477-1 1v1c0 .5523.44771 1 1 1H20.3571c.5523 0 1-.4477 1-1v-1c0-.5523-.4477-1-1-1h-1M5.35709 16H19.3571M9.35709 8l2.62501 2.5L9.35709 13m4.00001 0h2"/>
          </svg>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  (!((item.name === "Problems" || item.name == "Admin") && !user)  && !(item.name === "Admin" && !user.isAdmin) ) ? (<a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>) : (<></>)
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {user ? (<>
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>
        <ProfileDropdown user={user} onSignOut={handleSignOut} />
        </>
      ) : (
        <div className="ml-3 p-4">
           <a href="/login" className="text-white hover:underline">Login</a>
           <a href="/signup" className="text-white hover:underline ml-4">Register</a>
        </div>
      )}
      </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
