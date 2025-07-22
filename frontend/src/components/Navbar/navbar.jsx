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

// --- THEME COLORS ---
const themeColors = {
    light: {
        // Navbar background and border
        navbarBg: 'bg-white/80 backdrop-blur-lg',
        navbarBorder: 'border-gray-200',

        // Logo
        logoBg: 'bg-indigo-600',
        logoIcon: 'text-white',
        logoText: 'text-gray-900',
        logoTextHover: 'group-hover:text-indigo-600',

        // Navigation links
        navLinkActiveBg: 'bg-indigo-50',
        navLinkActiveText: 'text-indigo-700',
        navLinkInactiveText: 'text-gray-600',
        navLinkHoverBg: 'hover:bg-indigo-50',
        navLinkHoverText: 'hover:text-indigo-700',

        // User actions (notification, profile)
        actionButtonBg: 'hover:bg-gray-100',
        actionButtonText: 'text-gray-500',
        actionButtonFocusRing: 'focus:ring-indigo-500',
        actionButtonHoverText: 'hover:text-gray-700',
        separator: 'bg-gray-300',

        // Notification Popover
        notifPopoverBg: 'bg-white/90 backdrop-blur-xl',
        notifPopoverBorder: 'ring-gray-200',
        notifHeader: 'text-gray-900',
        notifCloseBtn: 'text-gray-500 hover:text-gray-700',
        notifTabActiveText: 'text-indigo-600',
        notifTabInactiveText: 'text-gray-500 hover:text-gray-700',
        notifTabUnderline: 'bg-indigo-500',
        notifListItemHover: 'hover:bg-gray-50',
        notifIconBg: {
            new_badge: 'bg-yellow-100 text-yellow-600',
            post_comment: 'bg-blue-100 text-blue-600',
            system_update: 'bg-purple-100 text-purple-600',
            default: 'bg-gray-100 text-gray-600',
        },
        notifIconRing: {
            new_badge: 'ring-yellow-500/20',
            post_comment: 'ring-blue-500/20',
            system_update: 'ring-purple-500/20',
            default: 'ring-gray-300',
        },
        notifMessage: 'text-gray-800',
        notifTime: 'text-gray-500',
        notifMarkReadDot: 'bg-indigo-500',
        notifMarkReadBtnHover: 'hover:bg-indigo-50',
        notifMarkAllReadBtnBg: 'bg-gray-50',
        notifMarkAllReadBtnText: 'text-indigo-600 hover:text-indigo-700',
        notifEmptyText: 'text-gray-600',
        notifLoadingText: 'text-gray-500',

        // Profile Dropdown
        profileDropdownBg: 'bg-white/90 backdrop-blur-xl',
        profileDropdownBorder: 'ring-gray-200',
        profileHeaderBg: 'border-gray-200',
        profileUsername: 'text-gray-900',
        profileEmail: 'text-gray-600',
        profileMenuItemHover: 'hover:bg-gray-50',
        profileMenuItemText: 'text-gray-700',
        profileMenuItemIcon: 'text-gray-500',
        profileSignOutBtnHover: 'hover:bg-red-50',
        profileSignOutBtnText: 'text-red-600',
        profileAvatarFallbackBg: 'bg-gray-200',
        profileAvatarFallbackText: 'text-gray-700',

        // Auth Buttons (mobile and desktop)
        authBtnText: 'text-gray-600 hover:text-indigo-700',
        authBtnBg: 'bg-indigo-600 hover:bg-indigo-700',
        authBtnMobileBg: 'bg-indigo-100 hover:bg-indigo-200',
        authBtnMobileText: 'text-indigo-700',
    },
    dark: {
        // Navbar background and border
        navbarBg: 'bg-slate-900/80 backdrop-blur-lg',
        navbarBorder: 'border-white/10',

        // Logo
        logoBg: 'bg-slate-800',
        logoIcon: 'text-sky-400',
        logoText: 'text-slate-100',
        logoTextHover: 'group-hover:text-sky-400',

        // Navigation links
        navLinkActiveBg: 'bg-slate-800',
        navLinkActiveText: 'text-sky-400',
        navLinkInactiveText: 'text-slate-300',
        navLinkHoverBg: 'hover:bg-slate-800/50',
        navLinkHoverText: 'hover:text-slate-100',

        // User actions (notification, profile)
        actionButtonBg: 'hover:bg-slate-800',
        actionButtonText: 'text-slate-400',
        actionButtonFocusRing: 'focus:ring-sky-500',
        actionButtonHoverText: 'hover:text-slate-100',
        separator: 'bg-slate-700',

        // Notification Popover
        notifPopoverBg: 'bg-slate-800/90 backdrop-blur-xl',
        notifPopoverBorder: 'ring-white/10',
        notifHeader: 'text-slate-100',
        notifCloseBtn: 'text-slate-400 hover:text-slate-100',
        notifTabActiveText: 'text-sky-400',
        notifTabInactiveText: 'text-slate-400 hover:text-slate-100',
        notifTabUnderline: 'bg-sky-500',
        notifListItemHover: 'hover:bg-slate-700/50',
        notifIconBg: {
            new_badge: 'bg-yellow-500/10 text-yellow-400',
            post_comment: 'bg-sky-500/10 text-sky-400',
            system_update: 'bg-purple-500/10 text-purple-400',
            default: 'bg-slate-600/30 text-slate-400',
        },
        notifIconRing: {
            new_badge: 'ring-yellow-500/20',
            post_comment: 'ring-sky-500/20',
            system_update: 'ring-purple-500/20',
            default: 'ring-slate-500/30',
        },
        notifMessage: 'text-slate-200',
        notifTime: 'text-slate-400',
        notifMarkReadDot: 'bg-sky-500',
        notifMarkReadBtnHover: 'hover:bg-sky-500/20',
        notifMarkAllReadBtnBg: 'bg-slate-800/50',
        notifMarkAllReadBtnText: 'text-sky-400 hover:text-sky-300',
        notifEmptyText: 'text-slate-300',
        notifLoadingText: 'text-slate-400',

        // Profile Dropdown
        profileDropdownBg: 'bg-slate-800/90 backdrop-blur-xl',
        profileDropdownBorder: 'ring-white/10',
        profileHeaderBg: 'border-slate-700/80',
        profileUsername: 'text-slate-100',
        profileEmail: 'text-slate-400',
        profileMenuItemHover: 'hover:bg-slate-700/50',
        profileMenuItemText: 'text-slate-300',
        profileMenuItemIcon: 'text-slate-400',
        profileSignOutBtnHover: 'hover:bg-red-500/10',
        profileSignOutBtnText: 'text-red-400/90',
        profileAvatarFallbackBg: 'bg-slate-700',
        profileAvatarFallbackText: 'text-slate-300',

        // Auth Buttons (mobile and desktop)
        authBtnText: 'text-slate-300 hover:text-sky-400',
        authBtnBg: 'bg-sky-600 hover:bg-sky-700',
        authBtnMobileBg: 'bg-slate-800',
        authBtnMobileText: 'text-sky-400',
    }
};

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

const Logo = ({ theme }) => {
    const colors = themeColors[theme];
    return (
        <a href="/home" className="flex-shrink-0 flex items-center gap-3 group">
            <motion.div 
                whileHover={{ scale: 1.05, rotate: -5 }} 
                className={`w-9 h-9 rounded-lg flex items-center justify-center border shadow-lg ${colors.logoBg} ${theme === 'light' ? 'border-indigo-700 shadow-indigo-200' : 'border-slate-700'}`}
            >
                <CodeBracketIcon className={`w-5 h-5 ${colors.logoIcon}`} />
            </motion.div>
            <span className={`text-xl font-bold hidden sm:block tracking-tight transition-colors ${colors.logoText} ${colors.logoTextHover}`}>
                DeCodeByCode
            </span>
        </a>
    );
};

const NotificationsPopover = ({ isOpen, onClose, hook, theme }) => {
    const { unreadNotifications, readNotifications, isLoading, markAsRead, markAllAsRead, unreadCount } = hook;
    const [activeTab, setActiveTab] = useState('unread');
    const colors = themeColors[theme];

    useEffect(() => {
        if (unreadCount === 0 && readNotifications.length > 0) setActiveTab('read');
    }, [unreadCount, readNotifications.length]);

    const renderNotificationList = (list) => {
        if (isLoading) return <div className={`p-8 text-center ${colors.notifLoadingText}`}><Cog6ToothIcon className={`h-8 w-8 mx-auto ${colors.notifLoadingText} animate-spin`} /><p className="mt-2 text-sm">Loading notifications...</p></div>;
        if (list.length === 0) return <div className={`p-8 text-center ${colors.notifEmptyText}`}><BellIcon className={`h-8 w-8 mx-auto ${colors.notifEmptyText}`} /><p className="mt-2 text-base font-medium">All caught up!</p><p className="text-sm">No new notifications here.</p></div>;
        
        return (
            <ul className={`divide-y ${colors.borderLight}`}>
                {list.map((notification) => {
                    const notificationAssets = getNotificationAssets(notification.type);
                    const Icon = notificationAssets.icon;
                    const iconColorClass = colors.notifIconBg[notification.type] || colors.notifIconBg.default;
                    const iconRingClass = colors.notifIconRing[notification.type] || colors.notifIconRing.default;
                    
                    return (
                        <li key={notification._id} className={`${colors.notifListItemHover} transition-colors group relative`}>
                            <a href={notification.link || '#'} className="block w-full text-left p-4 flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ring-1 ${iconColorClass} ${iconRingClass}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${colors.notifMessage}`}>{notification.message}</p>
                                    <p className={`text-xs mt-1 ${colors.notifTime}`}>{timeSince(notification.createdAt)}</p>
                                </div>
                                {!notification.isRead && (
                                    <motion.button 
                                        whileHover={{ scale: 1.2 }} 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); markAsRead(notification._id); }} 
                                        title="Mark as read" 
                                        className={`absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${colors.notifMarkReadBtnHover}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${colors.notifMarkReadDot}`}></div>
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
            {isOpen && ( // Only render motion.div if isOpen is true
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`absolute right-0 mt-3 w-96 origin-top-right rounded-xl shadow-2xl ring-1 focus:outline-none z-50 overflow-hidden ${colors.notifPopoverBg} ${colors.notifPopoverBorder}`}
                >
                    <div className={`p-4 border-b ${colors.borderLight} flex justify-between items-center`}>
                        <h3 className={`text-base font-semibold ${colors.notifHeader}`}>Notifications</h3>
                        <button onClick={onClose} className={`${colors.notifCloseBtn} transition-colors`}><XMarkIcon className="h-5 w-5" /></button>
                    </div>
                    <div className={`border-b ${colors.borderLight} px-2 pt-2`}>
                        <div className="flex space-x-1">
                            {['unread', 'read'].map(tab => (
                                <button 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)} 
                                    className={`relative w-full py-2 text-sm font-medium rounded-t-md transition-colors ${activeTab === tab ? colors.notifTabActiveText : colors.notifTabInactiveText}`}
                                >
                                    <span className="capitalize">{tab}</span>
                                    {tab === 'unread' && unreadCount > 0 && <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unreadCount}</span>}
                                    {activeTab === tab && <motion.div className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.notifTabUnderline}`} layoutId="underline" />}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {activeTab === 'unread' ? renderNotificationList(unreadNotifications) : renderNotificationList(readNotifications)}
                    </div>
                    {unreadCount > 0 && activeTab === 'unread' && (
                        <div className={`p-2 ${colors.notifMarkAllReadBtnBg} border-t ${colors.borderLight}`}>
                            <button onClick={markAllAsRead} className={`w-full text-center text-sm font-medium py-2 rounded-lg transition-colors ${colors.notifMarkAllReadBtnText} ${colors.notifListItemHover}`}>
                                Mark all as read
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ProfileDropdown = ({ user, onSignOut, theme }) => {
    const colors = themeColors[theme];
    const userMenuItems = [
        { name: 'Your Profile', href: `/profile/u/${user?.username}`, icon: UserCircleIcon },
        { name: 'Settings', href: '#', icon: Cog6ToothIcon },
    ];

    return (
        <Menu as="div" className="relative">
            <MenuButton className={`flex items-center gap-2 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'light' ? 'focus:ring-offset-white' : 'focus:ring-offset-slate-900'} ${colors.actionButtonBg} ${colors.actionButtonText} ${colors.actionButtonFocusRing}`}>
                <div className={`w-8 h-8 rounded-full overflow-hidden ring-1 ${theme === 'light' ? 'ring-gray-300' : 'ring-slate-600'}`}>
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover"/>
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${colors.profileAvatarFallbackBg}`}>
                            <span className={`font-semibold text-sm ${colors.profileAvatarFallbackText}`}>{user?.username?.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <ChevronDownIcon className={`w-4 h-4 hidden sm:block ${colors.actionButtonText}`} />
            </MenuButton>
            <MenuItems as={motion.div} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className={`absolute right-0 mt-3 w-64 origin-top-right rounded-xl shadow-2xl ring-1 focus:outline-none z-50 overflow-hidden ${colors.profileDropdownBg} ${colors.profileDropdownBorder}`}>
                <div className={`p-4 border-b ${colors.profileHeaderBg}`}>
                    <p className={`text-sm font-semibold truncate ${colors.profileUsername}`}>{user?.username}</p>
                    <p className={`text-xs truncate ${colors.profileEmail}`}>{user?.email}</p>
                </div>
                <div className="py-1">
                    {userMenuItems.map(item => (
                        <MenuItem key={item.name}>
                            {({ active }) => (
                                <a href={item.href} className={classNames(active ? `${colors.profileMenuItemHover} ${theme === 'light' ? 'text-gray-900' : colors.profileUsername}` : colors.profileMenuItemText, 'flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors')}>
                                    <item.icon className={`h-5 w-5 ${colors.profileMenuItemIcon}`} />{item.name}
                                </a>
                            )}
                        </MenuItem>
                    ))}
                </div>
                <div className={`py-1 border-t ${colors.profileHeaderBg}`}>
                    <MenuItem>
                        {({ active }) => (
                            <button onClick={onSignOut} className={classNames(active ? `${colors.profileSignOutBtnHover}` : '', `w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${colors.profileSignOutBtnText}`)}>
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

    // Dynamic theme (assuming a useTheme hook or context is available)
    const [theme, setTheme] = useState('dark'); // Default to dark, but ideally from a global theme context
    useEffect(() => {
        // This is a placeholder for a real theme context/hook.
        // For now, it just sets the theme to 'dark' as in your original code.
        // If you have a global theme context, replace this with useContext(ThemeContext)
        const storedTheme = localStorage.getItem('theme') || 'dark'; // Assuming you save theme to localStorage
        setTheme(storedTheme);
    }, []);

    const colors = themeColors[theme];

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
        <Disclosure as="nav" className={`fixed w-full z-50 top-0 border-b ${colors.navbarBg} ${colors.navbarBorder}`}>
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-6">
                                <Logo theme={theme} /> {/* Pass theme to Logo */}
                                <div className="hidden md:block">
                                    <div className="flex items-baseline space-x-2">
                                        {navigation.map((item) => (
                                            (!((item.name === "Problems" || item.name === "Admin") && !user) && !(item.name === "Admin" && user && !user.isAdmin)) && (
                                                <a 
                                                    key={item.name} 
                                                    href={item.href} 
                                                    className={classNames(
                                                        item.name === activePage ? `${colors.navLinkActiveBg} ${colors.navLinkActiveText} font-semibold` : `${colors.navLinkInactiveText} ${colors.navLinkHoverBg} ${colors.navLinkHoverText}`,
                                                        'rounded-md px-3 py-2 text-sm font-medium transition-colors'
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
                                                    className={`relative rounded-full p-2 transition-colors ${colors.actionButtonBg} ${colors.actionButtonText} ${colors.actionButtonFocusRing} ${colors.actionButtonHoverText}`}
                                                >
                                                    <span className="sr-only">View notifications</span>
                                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                                    {notificationsHook.unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-xs text-white">{notificationsHook.unreadCount}</span></span>}
                                                </button>
                                                <NotificationsPopover isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} hook={notificationsHook} theme={theme} />
                                            </div>
                                            <div className={`w-px h-6 ${colors.separator}`}></div>
                                            <ProfileDropdown user={user} onSignOut={handleSignOut} theme={theme} />
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-3">
                                            <a href="/login" className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${colors.authBtnText} ${theme === 'light' ? colors.actionButtonBg : ''}`}>Log in</a>
                                            <a href="/signup" className={`px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg ${colors.authBtnBg} ${colors.buttonText}`}>Sign up</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                <DisclosureButton className={`inline-flex items-center justify-center rounded-md p-2 transition-colors focus:outline-none focus:ring-2 ${colors.actionButtonBg} ${colors.actionButtonText} ${colors.actionButtonFocusRing}`}>
                                    <span className="sr-only">Open main menu</span>
                                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className={`md:hidden border-t ${colors.navbarBorder}`}>
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {navigation.map((item) => (
                                (!((item.name === "Problems" || item.name === "Admin") && !user) && !(item.name === "Admin" && user && !user.isAdmin)) && (
                                    <DisclosureButton 
                                        key={item.name} 
                                        as="a" 
                                        href={item.href} 
                                        className={classNames(
                                            item.name === activePage ? `${colors.navLinkActiveBg} ${colors.navLinkActiveText}` : `${colors.navLinkInactiveText} ${colors.navLinkHoverBg} ${colors.navLinkHoverText}`,
                                            'block rounded-md px-3 py-2 text-base font-medium transition-colors'
                                        )} 
                                        aria-current={item.name === activePage ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                )
                            ))}
                        </div>
                        <div className={`border-t ${colors.separator} pt-4 pb-3`}>
                            {user ? (
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-full overflow-hidden ring-1 ${theme === 'light' ? 'ring-gray-300' : 'ring-slate-600'}`}>
                                            {user.profilePicture ? <img className="h-10 w-10 rounded-full object-cover" src={user.profilePicture} alt="" /> : <div className={`w-full h-full flex items-center justify-center ${colors.profileAvatarFallbackBg}`}><span className={`font-semibold text-lg ${colors.profileAvatarFallbackText}`}>{user.username.charAt(0).toUpperCase()}</span></div>}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className={`text-base font-medium ${colors.profileUsername}`}>{user.username}</div>
                                        <div className={`text-sm font-medium ${colors.profileEmail}`}>{user.email}</div>
                                    </div>
                                    <button type="button" onClick={() => setNotificationsOpen(p => !p)} className={`relative ml-auto flex-shrink-0 rounded-full p-1 transition-colors ${colors.actionButtonText} ${colors.actionButtonBg} ${colors.actionButtonFocusRing} ${colors.actionButtonHoverText}`}>
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        {notificationsHook.unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center text-xs text-white">{notificationsHook.unreadCount}</span></span>}
                                    </button>
                                    <NotificationsPopover isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} hook={notificationsHook} theme={theme} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-3 mt-2">
                                    <a href="/login" className={`flex-1 text-center px-4 py-2 text-base font-medium rounded-md ${colors.authBtnText} ${colors.authBtnMobileBg}`}>Log in</a>
                                    <a href="/signup" className={`flex-1 text-center px-4 py-2 rounded-md text-base font-medium shadow-md ${colors.authBtnBg} ${colors.buttonText}`}>Sign up</a>
                                </div>
                            )}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
}