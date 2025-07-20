import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
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
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext.jsx';

// --- HELPERS (UI LOGIC) ---

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const getNotificationAssets = (type) => {
    const assets = {
        new_badge: { icon: CheckBadgeIcon, color: 'bg-yellow-500/10 text-yellow-400', ring: 'ring-yellow-500/20' },
        post_comment: { icon: ChatBubbleLeftEllipsisIcon, color: 'bg-sky-500/10 text-sky-400', ring: 'ring-sky-500/20' },
        system_update: { icon: CircleStackIcon, color: 'bg-purple-500/10 text-purple-400', ring: 'ring-purple-500/20' },
        default: { icon: BellIcon, color: 'bg-slate-600/30 text-slate-400', ring: 'ring-slate-500/30' }
    };
    return assets[type] || assets.default;
};

const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

// --- DATA & HOOKS (ORIGINAL LOGIC RESTORED) ---

const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'BattleGround', href: '/contests', icon: TrophyIcon },
  { name: 'Problems', href: '/problems', icon: CodeBracketIcon },
  { name: 'Learn', href: '/learn', icon: AcademicCapIcon },
  { name: 'Blogs', href: '/blogs', icon: BookOpenIcon },
  { name: 'About Us', href: '/about-us', icon: InformationCircleIcon },
  { name: "Admin", href: '/admin', icon: ShieldCheckIcon },
];

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3000/notifications', { credentials: 'include', method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch notifications');
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = useCallback(async (id) => {
        const originalNotifications = [...notifications];
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        try {
            const res = await fetch(`http://localhost:3000/notifications/read/${id}`, { method: 'POST', credentials: 'include' });
            if (!res.ok) throw new Error('Failed to mark as read');
        } catch (err) {
            setError(err.message);
            setNotifications(originalNotifications);
        }
    }, [notifications]);

    const markAllAsRead = useCallback(async () => {
        const originalNotifications = [...notifications];
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            for (const notification of originalNotifications.filter(n => !n.isRead)) {
                await fetch(`http://localhost:3000/notifications/read/${notification._id}`, { method: 'POST', credentials: 'include' });
            }
        } catch (err) {
            setError(err.message);
            setNotifications(originalNotifications);
        }
    }, [notifications]);

    const unreadNotifications = useMemo(() => notifications.filter(n => !n.isRead), [notifications]);
    const readNotifications = useMemo(() => notifications.filter(n => n.isRead), [notifications]);

    return { 
        unreadNotifications, 
        readNotifications, 
        isLoading, 
        error, 
        markAsRead, 
        markAllAsRead,
        unreadCount: unreadNotifications.length
    };
};

// --- UI SUB-COMPONENTS (REDESIGNED) ---

const Logo = () => (
    <a href="/home" className="flex-shrink-0 flex items-center gap-3 group">
        <motion.div 
            whileHover={{ scale: 1.05, rotate: -5 }} 
            className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 shadow-lg"
        >
            <CodeBracketIcon className="w-5 h-5 text-sky-400" />
        </motion.div>
        <span className="text-xl font-bold text-slate-100 hidden sm:block tracking-tight group-hover:text-sky-400 transition-colors">
            DeCodeByCode
        </span>
    </a>
);

const NotificationsPopover = ({ isOpen, onClose, hook }) => {
    const { unreadNotifications, readNotifications, isLoading, markAsRead, markAllAsRead, unreadCount } = hook;
    const [activeTab, setActiveTab] = useState('unread');

    useEffect(() => {
        if (unreadCount === 0 && readNotifications.length > 0) setActiveTab('read');
    }, [unreadCount, readNotifications.length]);

    const renderNotificationList = (list) => {
        if (isLoading) return <div className="p-8 text-center"><Cog6ToothIcon className="h-8 w-8 mx-auto text-slate-500 animate-spin" /><p className="mt-2 text-sm text-slate-400">Loading...</p></div>;
        if (list.length === 0) return <div className="p-8 text-center"><BellIcon className="h-8 w-8 mx-auto text-slate-500" /><p className="mt-2 text-sm font-medium text-slate-300">All caught up</p><p className="text-xs text-slate-500">No new notifications.</p></div>;
        
        return (
            <ul className="divide-y divide-slate-700/80">
                {list.map((notification) => {
                    const { icon: Icon, color, ring } = getNotificationAssets(notification.type);
                    return (
                        <li key={notification._id} className="hover:bg-slate-700/50 transition-colors group relative">
                            <a href={notification.link || '#'} className="block w-full text-left p-4 flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${color} flex items-center justify-center mt-1 ring-1 ${ring}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-200">{notification.message}</p>
                                    <p className="text-xs text-slate-400 mt-1">{timeSince(notification.createdAt)}</p>
                                </div>
                                {!notification.isRead && (
                                    <motion.button whileHover={{ scale: 1.2 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notification._id); }} title="Mark as read" className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-sky-500/20">
                                        <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                                    </motion.button>
                                )}
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-0 mt-3 w-96 origin-top-right rounded-xl bg-slate-800/90 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 focus:outline-none z-50 overflow-hidden"
            >
                <div className="p-4 border-b border-slate-700/80 flex justify-between items-center">
                    <h3 className="text-base font-semibold text-slate-100">Notifications</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-100 transition-colors"><XMarkIcon className="h-5 w-5" /></button>
                </div>
                <div className="border-b border-slate-700/80 px-2 pt-2">
                    <div className="flex space-x-1">
                        {['unread', 'read'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`relative w-full py-2 text-sm font-medium rounded-t-md transition-colors ${activeTab === tab ? 'text-sky-400' : 'text-slate-400 hover:text-slate-100'}`}>
                                <span className="capitalize">{tab}</span>
                                {tab === 'unread' && unreadCount > 0 && <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unreadCount}</span>}
                                {activeTab === tab && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" layoutId="underline" />}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">{activeTab === 'unread' ? renderNotificationList(unreadNotifications) : renderNotificationList(readNotifications)}</div>
                {unreadCount > 0 && activeTab === 'unread' && (
                    <div className="p-2 bg-slate-800/50 border-t border-slate-700/80">
                        <button onClick={markAllAsRead} className="w-full text-center text-sm text-sky-400 hover:text-sky-300 font-medium py-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                            Mark all as read
                        </button>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

const ProfileDropdown = ({ user, onSignOut }) => {
    const userMenuItems = [
        { name: 'Your Profile', href: `/profile/u/${user?.username}`, icon: UserCircleIcon },
        { name: 'Settings', href: '#', icon: Cog6ToothIcon },
    ];

    return (
        <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 rounded-full hover:bg-slate-700/50 p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-600">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <span className="font-semibold text-sm text-slate-300">{user?.username?.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <ChevronDownIcon className="w-4 h-4 text-slate-400 hidden sm:block" />
            </MenuButton>
            <MenuItems as={motion.div} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-3 w-64 origin-top-right rounded-xl bg-slate-800/90 backdrop-blur-xl shadow-2xl ring-1 ring-white/10 focus:outline-none z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-700/80">
                    <p className="text-sm font-semibold text-slate-100 truncate">{user?.username}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                    {userMenuItems.map(item => (
                        <MenuItem key={item.name}>
                            {({ active }) => (<a href={item.href} className={classNames(active ? 'bg-slate-700/50 text-slate-100' : 'text-slate-300', 'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors')}>
                                <item.icon className="h-5 w-5 text-slate-400" />{item.name}
                            </a>)}
                        </MenuItem>
                    ))}
                </div>
                <div className="py-1 border-t border-slate-700/80">
                    <MenuItem>
                        {({ active }) => (<button onClick={onSignOut} className={classNames(active ? 'bg-red-500/10 text-red-400' : 'text-red-400/90', 'w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:text-red-400')}>
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />Sign out
                        </button>)}
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    );
};

// --- MAIN NAVBAR COMPONENT ---
export default function Navbar({ activePage }) {
    const { user, setUser } = useContext(UserContext);
    const notificationsHook = useNotifications();
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:3000/home', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
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
        if (!user) {
            fetchUser();
        }
    }, [user, setUser]);

    const handleSignOut = async () => {
        try {
            await fetch("http://localhost:3000/logout", { method: "GET", credentials: "include" });
            setUser(null);
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <Disclosure as="nav" className="bg-slate-900/80 backdrop-blur-lg fixed w-full z-50 top-0 border-b border-white/10">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Logo />
                                <div className="hidden md:block">
                                    <div className="flex items-baseline space-x-2">
                                        {navigation.map((item) => (
                                            (!((item.name === "Problems" || item.name === "Admin") && !user) && !(item.name === "Admin" && user && !user.isAdmin)) && (
                                                <a key={item.name} href={item.href} className={classNames(
                                                    item.name === activePage ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100',
                                                    'rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                                )} aria-current={item.name === activePage ? 'page' : undefined}>
                                                    {item.name}
                                                </a>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6 gap-4">
                                    {user ? (
                                        <>
                                            <div className="relative">
                                                <button type="button" onClick={() => setNotificationsOpen(p => !p)} className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors">
                                                    <span className="sr-only">View notifications</span>
                                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                                    {notificationsHook.unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-xs text-white">{notificationsHook.unreadCount}</span></span>}
                                                </button>
                                                <NotificationsPopover isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} hook={notificationsHook} />
                                            </div>
                                            <div className="w-px h-6 bg-slate-700"></div>
                                            <ProfileDropdown user={user} onSignOut={handleSignOut} />
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <a href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors rounded-md">Log in</a>
                                            <a href="/signup" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg">Sign up</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="md:hidden border-t border-white/10">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {navigation.map((item) => (
                                (!((item.name === "Problems" || item.name === "Admin") && !user) && !(item.name === "Admin" && user && !user.isAdmin)) && (
                                    <DisclosureButton key={item.name} as="a" href={item.href} className={classNames(item.name === activePage ? 'bg-slate-800 text-sky-400' : 'text-slate-300 hover:bg-slate-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')} aria-current={item.name === activePage ? 'page' : undefined}>
                                        {item.name}
                                    </DisclosureButton>
                                )
                            ))}
                        </div>
                        <div className="border-t border-slate-700 pt-4 pb-3">
                            {user ? (
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-slate-600">
                                            {user.profilePicture ? <img className="h-10 w-10 rounded-full" src={user.profilePicture} alt="" /> : <div className="w-full h-full bg-slate-700 flex items-center justify-center"><span className="font-semibold text-white">{user.username.charAt(0).toUpperCase()}</span></div>}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-slate-200">{user.username}</div>
                                        <div className="text-sm font-medium text-slate-400">{user.email}</div>
                                    </div>
                                    <button type="button" onClick={() => setNotificationsOpen(p => !p)} className="relative ml-auto flex-shrink-0 rounded-full p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        {notificationsHook.unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-xs text-white">{notificationsHook.unreadCount}</span></span>}
                                    </button>
                                    <NotificationsPopover isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} hook={notificationsHook} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-3 mt-2">
                                    <a href="/login" className="flex-1 text-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors rounded-md bg-slate-800">Log in</a>
                                    <a href="/signup" className="flex-1 text-center bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md">Sign up</a>
                                </div>
                            )}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}
