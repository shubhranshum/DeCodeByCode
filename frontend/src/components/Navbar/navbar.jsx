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
import { UserContext } from '../../context/UserContext.jsx'; // Ensure this path is correct

// --- RETRO THEME COLORS ---
const themeColors = {
  retro: {
    // Main Navbar
    navbarBg: 'bg-stone-100',
    navbarBorder: 'border-b-4 border-stone-800',

    // Logo
    logoBg: 'bg-teal-300',
    logoIcon: 'text-stone-800',
    logoText: 'text-stone-800',
    logoTextHover: 'group-hover:text-purple-600',

    // Navigation Links (Now Button-Styled)
    navButtonBase: 'px-3 py-2 text-lg font-bold transition-all duration-150 border-2 border-stone-800',
    navButtonActive: 'bg-teal-200 text-stone-800 shadow-none translate-x-[3px] translate-y-[3px]',
    navButtonInactive: 'bg-stone-100 text-stone-700 shadow-[3px_3px_0px_#292524] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:bg-stone-200',
    
    // User action buttons (shared style for a chunky, clickable feel)
    actionButtonBase: 'border-2 border-stone-800 bg-stone-100 shadow-[3px_3px_0px_#292524] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:bg-stone-200 transition-all duration-150',
    actionButtonText: 'text-stone-700',

    // Separator
    separator: 'bg-stone-800',

    // Notification Popover
    notifPopoverBg: 'bg-stone-100',
    notifPopoverBorder: 'border-4 border-stone-800 shadow-[4px_4px_0px_#44403c]',
    notifHeader: 'text-stone-800',
    notifCloseBtn: 'text-stone-600 hover:text-stone-900',
    notifTabActiveText: 'text-purple-600',
    notifTabInactiveText: 'text-stone-600 hover:text-stone-900',
    notifTabUnderline: 'border-b-4 border-purple-500',
    notifListItemHover: 'hover:bg-stone-200',
    notifIconBg: {
        new_badge: 'bg-teal-200 text-teal-800',
        post_comment: 'bg-sky-200 text-sky-800',
        system_update: 'bg-purple-200 text-purple-800',
        default: 'bg-stone-300 text-stone-800',
    },
    notifIconBorder: 'border-2 border-stone-800',
    notifMessage: 'text-stone-800',
    notifTime: 'text-stone-500',
    notifMarkReadDot: 'bg-teal-500',
    notifMarkReadBtnHover: 'hover:bg-stone-300',
    notifMarkAllReadBtn: 'text-purple-600 hover:bg-purple-100 font-semibold',
    notifEmptyText: 'text-stone-600',
    notifLoadingText: 'text-stone-500',
    
    // Profile Dropdown
    profileDropdownBg: 'bg-stone-100',
    profileDropdownBorder: 'border-4 border-stone-800 shadow-[4px_4px_0px_#44403c]',
    profileHeaderBg: 'border-b-2 border-stone-400 border-dashed',
    profileUsername: 'text-stone-800',
    profileEmail: 'text-stone-600',
    profileMenuItemHover: 'hover:bg-stone-200',
    profileMenuItemText: 'text-stone-700',
    profileMenuItemIcon: 'text-stone-600',
    profileSignOutBtnHover: 'hover:bg-red-200',
    profileSignOutBtnText: 'text-red-700',
    profileAvatarFallbackBg: 'bg-stone-300',
    profileAvatarFallbackText: 'text-stone-800',

    // Auth Buttons
    authLoginBtn: 'border-2 border-stone-800 bg-stone-100 shadow-[3px_3px_0px_#292524] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:bg-stone-200 text-stone-800',
    authSignupBtn: 'border-2 border-stone-800 bg-teal-300 shadow-[3px_3px_0px_#292524] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:bg-teal-400 text-stone-800',
    authBtnMobileLogin: 'border-2 border-stone-800 bg-stone-200 text-stone-800 active:bg-stone-300',
    authBtnMobileSignup: 'border-2 border-stone-800 bg-teal-300 text-stone-800 active:bg-teal-400'
  }
};

// --- HELPERS (UI LOGIC) ---

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const getNotificationIcon = (type) => {
    const icons = {
        new_badge: CheckBadgeIcon,
        post_comment: ChatBubbleLeftEllipsisIcon,
        system_update: CircleStackIcon,
        default: BellIcon,
    };
    return icons[type] || icons.default;
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

// --- DATA & HOOKS (Original Logic Preserved) ---

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
            await fetch(`http://localhost:3000/notifications/read/${id}`, { method: 'POST', credentials: 'include' });
        } catch (err) {
            setError(err.message);
            setNotifications(originalNotifications);
        }
    }, [notifications]);

    const markAllAsRead = useCallback(async () => {
        const originalNotifications = [...notifications];
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            const unreadIds = originalNotifications.filter(n => !n.isRead).map(n => n._id);
            await fetch(`http://localhost:3000/notifications/read/all`, { 
                method: 'POST', 
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: unreadIds })
            });
        } catch (err) {
            setError(err.message);
            setNotifications(originalNotifications);
        }
    }, [notifications]);

    const unreadNotifications = useMemo(() => notifications.filter(n => !n.isRead), [notifications]);
    const readNotifications = useMemo(() => notifications.filter(n => n.isRead), [notifications]);

    return { unreadNotifications, readNotifications, isLoading, error, markAsRead, markAllAsRead, unreadCount: unreadNotifications.length };
};

// --- UI SUB-COMPONENTS (Retro Style) ---

const Logo = () => {
    const colors = themeColors.retro;
    return (
        <a href="/home" className="flex-shrink-0 flex items-center gap-3 group">
            <div className={`w-10 h-10 flex items-center justify-center border-2 border-stone-800 ${colors.logoBg}`}>
                <CodeBracketIcon className={`w-6 h-6 ${colors.logoIcon}`} />
            </div>
            <span className={`text-2xl font-bold hidden sm:block tracking-tighter transition-colors ${colors.logoText} ${colors.logoTextHover}`}>
                DeCodeByCode
            </span>
        </a>
    );
};

const NotificationsPopover = ({ isOpen, onClose, hook }) => {
    const { unreadNotifications, readNotifications, isLoading, markAsRead, markAllAsRead, unreadCount } = hook;
    const [activeTab, setActiveTab] = useState('unread');
    const colors = themeColors.retro;

    useEffect(() => {
        if (unreadCount === 0 && readNotifications.length > 0) setActiveTab('read');
        else if (unreadCount > 0) setActiveTab('unread');
    }, [unreadCount, readNotifications.length]);

    const renderNotificationList = (list) => {
        if (isLoading) return <div className={`p-8 text-center ${colors.notifLoadingText}`}><Cog6ToothIcon className={`h-8 w-8 mx-auto ${colors.notifLoadingText} animate-spin`} /><p className="mt-2">Loading...</p></div>;
        if (list.length === 0) return <div className={`p-8 text-center ${colors.notifEmptyText}`}><BellIcon className={`h-8 w-8 mx-auto`} /><p className="mt-2 text-lg">All caught up!</p><p>No new notifications.</p></div>;
        
        return (
            <ul className={`divide-y-2 divide-stone-300 divide-dashed`}>
                {list.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const iconColorClass = colors.notifIconBg[notification.type] || colors.notifIconBg.default;
                    
                    return (
                        <li key={notification._id} className={`${colors.notifListItemHover} transition-colors group relative`}>
                            <a href={notification.link || '#'} className="block w-full text-left p-4 flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center mt-1 ${colors.notifIconBorder} ${iconColorClass}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-base leading-tight ${colors.notifMessage}`}>{notification.message}</p>
                                    <p className={`text-sm mt-1 ${colors.notifTime}`}>{timeSince(notification.createdAt)}</p>
                                </div>
                                {!notification.isRead && (
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notification._id); }} 
                                        title="Mark as read" 
                                        className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${colors.notifMarkReadBtnHover}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${colors.notifMarkReadDot}`}></div>
                                    </button>
                                )}
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={`absolute right-0 mt-3 w-96 origin-top-right focus:outline-none z-50 ${colors.notifPopoverBg} ${colors.notifPopoverBorder}`}
                >
                    <div className={`p-3 border-b-4 ${colors.navbarBorder} flex justify-between items-center`}>
                        <h3 className={`text-xl font-bold ${colors.notifHeader}`}>Notifications</h3>
                        <button onClick={onClose} className={colors.notifCloseBtn}><XMarkIcon className="h-6 w-6" /></button>
                    </div>
                    <div className={`border-b-2 border-stone-800 px-2 pt-2`}>
                        <div className="flex">
                            {['unread', 'read'].map(tab => (
                                <button 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)} 
                                    className={`relative w-full py-2 text-lg font-bold transition-colors ${activeTab === tab ? `${colors.notifTabActiveText} ${colors.notifTabUnderline}` : `${colors.notifTabInactiveText}`}`}
                                >
                                    <span className="capitalize">{tab}</span>
                                    {tab === 'unread' && unreadCount > 0 && <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 border border-stone-800">{unreadCount}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {activeTab === 'unread' ? renderNotificationList(unreadNotifications) : renderNotificationList(readNotifications)}
                    </div>
                    {unreadCount > 0 && activeTab === 'unread' && (
                        <div className={`p-2 border-t-2 border-stone-800`}>
                            <button onClick={markAllAsRead} className={`w-full text-center text-base py-2 transition-colors ${colors.notifMarkAllReadBtn}`}>
                                Mark all as read
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ProfileDropdown = ({ user, onSignOut }) => {
    const colors = themeColors.retro;
    const userMenuItems = [
        { name: 'Your Profile', href: `/profile/u/${user?.username}`, icon: UserCircleIcon },
        { name: 'Settings', href: '#', icon: Cog6ToothIcon },
    ];

    return (
        <Menu as="div" className="relative">
            <MenuButton className={`flex items-center gap-2 p-1 ${colors.actionButtonBase}`}>
                <div className={`w-8 h-8 overflow-hidden border-2 ${colors.notifIconBorder} ${colors.profileAvatarFallbackBg}`}>
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover"/>
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center`}>
                            <span className={`font-bold text-xl ${colors.profileAvatarFallbackText}`}>{user?.username?.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <ChevronDownIcon className={`w-5 h-5 hidden sm:block ${colors.actionButtonText}`} />
            </MenuButton>
            <MenuItems as={motion.div} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }} className={`absolute right-0 mt-3 w-64 origin-top-right focus:outline-none z-50 ${colors.profileDropdownBg} ${colors.profileDropdownBorder}`}>
                <div className={`p-3 ${colors.profileHeaderBg}`}>
                    <p className={`text-lg font-bold truncate ${colors.profileUsername}`}>{user?.username}</p>
                    <p className={`text-sm truncate ${colors.profileEmail}`}>{user?.email}</p>
                </div>
                <div className="py-1">
                    {userMenuItems.map(item => (
                        <MenuItem key={item.name}>
                            {({ active }) => (
                                <a href={item.href} className={classNames(active ? colors.profileMenuItemHover : '', 'flex items-center gap-3 px-3 py-2 text-base font-bold transition-colors', colors.profileMenuItemText)}>
                                    <item.icon className={`h-5 w-5 ${colors.profileMenuItemIcon}`} />{item.name}
                                </a>
                            )}
                        </MenuItem>
                    ))}
                </div>
                <div className={`py-1 border-t-2 ${colors.profileHeaderBg}`}>
                    <MenuItem>
                        {({ active }) => (
                            <button onClick={onSignOut} className={classNames(active ? colors.profileSignOutBtnHover : '', `w-full flex items-center gap-3 px-3 py-2 text-base font-bold transition-colors ${colors.profileSignOutBtnText}`)}>
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />Sign out
                            </button>
                        )}
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
    
    const colors = themeColors.retro;

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
            localStorage.removeItem("user");
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <Disclosure as="nav" className={`fixed w-full z-50 top-0 font-retro ${colors.navbarBg} ${colors.navbarBorder}`}>
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Logo />
                                <div className="hidden md:block">
                                    <div className="flex items-baseline space-x-2">
                                        {navigation.map((item) => (
                                            (!((item.name === "Problems" || item.name === "Admin") && !user) && !(item.name === "Admin" && user && !user.isAdmin)) && (
                                                <a 
                                                    key={item.name} 
                                                    href={item.href} 
                                                    className={classNames(
                                                        colors.navButtonBase,
                                                        item.name === activePage 
                                                            ? colors.navButtonActive
                                                            : colors.navButtonInactive
                                                    )} 
                                                    aria-current={item.name === activePage ? 'page' : undefined}
                                                >
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
                                                <button 
                                                    type="button" 
                                                    onClick={() => setNotificationsOpen(p => !p)} 
                                                    className={`relative p-2 ${colors.actionButtonBase}`}
                                                >
                                                    <span className="sr-only">View notifications</span>
                                                    <BellIcon className={`h-6 w-6 ${colors.actionButtonText}`} aria-hidden="true" />
                                                    {notificationsHook.unreadCount > 0 && <span className="absolute top-0 right-0 flex h-4 w-4 -mt-1 -mr-1"><span className="relative inline-flex h-4 w-4 bg-red-500 border border-stone-800 items-center justify-center text-xs text-white font-bold">{notificationsHook.unreadCount}</span></span>}
                                                </button>
                                                <NotificationsPopover isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} hook={notificationsHook} />
                                            </div>
                                            <div className={`w-px h-8 ${colors.separator}`}></div>
                                            <ProfileDropdown user={user} onSignOut={handleSignOut} />
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <a href="/login" className={`px-4 py-2 text-lg font-bold transition-all duration-150 ${colors.authLoginBtn}`}>Log in</a>
                                            <a href="/signup" className={`px-4 py-2 text-lg font-bold transition-all duration-150 ${colors.authSignupBtn}`}>Sign up</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                <DisclosureButton className={`inline-flex items-center justify-center rounded-sm p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-800 ${colors.actionButtonText} ${colors.navLinkHoverBg}`}>
                                    <span className="sr-only">Open main menu</span>
                                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className={`md:hidden border-t-2 ${colors.navbarBorder}`}>
                        <div className="space-y-2 px-2 pt-2 pb-3 sm:px-3">
                            {navigation.map((item) => (
                                (!((item.name === "Problems" || item.name === "Admin") && !user) && !(item.name === "Admin" && user && !user.isAdmin)) && (
                                    <DisclosureButton 
                                        key={item.name} 
                                        as="a" 
                                        href={item.href} 
                                        className={classNames(
                                            'block px-3 py-3 text-xl font-bold transition-colors border-2 border-stone-800 text-center',
                                            item.name === activePage ? `bg-teal-300 text-stone-800` : `bg-stone-100 text-stone-700 hover:bg-stone-200`
                                        )} 
                                        aria-current={item.name === activePage ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                )
                            ))}
                        </div>
                        <div className={`border-t-2 border-stone-400 border-dashed pt-4 pb-3`}>
                            {user ? (
                                <div className="flex items-center px-5">
                                    <div className={`flex-shrink-0 w-12 h-12 border-2 ${colors.notifIconBorder} ${colors.profileAvatarFallbackBg}`}>
                                        {user.profilePicture ? <img className="h-full w-full object-cover" src={user.profilePicture} alt="" /> : <div className={`w-full h-full flex items-center justify-center`}><span className={`font-bold text-2xl ${colors.profileAvatarFallbackText}`}>{user.username.charAt(0).toUpperCase()}</span></div>}
                                    </div>
                                    <div className="ml-3">
                                        <div className={`text-xl font-bold ${colors.profileUsername}`}>{user.username}</div>
                                        <div className={`text-base ${colors.profileEmail}`}>{user.email}</div>
                                    </div>
                                    <button type="button" onClick={() => setNotificationsOpen(p => !p)} className={`relative ml-auto flex-shrink-0 p-1 ${colors.actionButtonText} ${colors.navLinkHoverBg}`}>
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-7 w-7" aria-hidden="true" />
                                        {notificationsHook.unreadCount > 0 && <span className="absolute top-0 right-0 flex h-4 w-4"><span className="relative inline-flex h-4 w-4 bg-red-500 border border-stone-800 items-center justify-center text-xs text-white font-bold">{notificationsHook.unreadCount}</span></span>}
                                    </button>
                                    <NotificationsPopover isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} hook={notificationsHook} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-3 mt-2 px-2">
                                    <a href="/login" className={`flex-1 text-center px-4 py-2 text-lg font-bold rounded-sm ${colors.authBtnMobileLogin}`}>Log in</a>
                                    <a href="/signup" className={`flex-1 text-center px-4 py-2 text-lg font-bold rounded-sm ${colors.authBtnMobileSignup}`}>Sign up</a>
                                </div>
                            )}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}
