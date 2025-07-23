import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from 'date-fns';
import { getAllGlobalContests } from '../Tasks/getAllGlobalContests';
import { Calendar, Clock, Award, Users, Check, Edit3, LogIn } from 'lucide-react';

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    bgPrimary: "bg-stone-100",
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-purple-600",
    panelBg: "bg-white",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-purple-400 hover:bg-purple-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonDisabledBg: "bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-amber-100",
    status: {
        upcoming: "bg-amber-200 text-amber-800",
        current: "bg-emerald-200 text-emerald-800",
        past: "bg-stone-200 text-stone-800",
    },
};

// --- Reusable UI Components ---
const Button = ({ children, onClick, disabled, className = '', small = false, type = 'primary' }) => {
    const sizeStyle = small ? 'px-4 py-2 text-base' : 'px-5 py-2.5 text-lg';
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2`;
    const typeStyle = disabled ? retroThemeColors.buttonDisabledBg : (type === 'primary' ? retroThemeColors.buttonPrimaryBg : retroThemeColors.buttonSecondaryBg);
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}>
            {children}
        </button>
    );
};

const RetroCard = ({ children, className = '', ...props }) => (
    <div className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`} {...props}>
        {children}
    </div>
);

const TabButton = ({ children, isActive, onClick }) => (
    <button onClick={onClick} className={`flex-1 p-4 text-2xl border-r-4 last:border-r-0 ${retroThemeColors.panelBorder} transition-colors ${isActive ? `${retroThemeColors.panelBg} ${retroThemeColors.textAccent}` : `${retroThemeColors.buttonSecondaryBg} ${retroThemeColors.textPrimary} hover:bg-stone-300`}`}>
        {children}
    </button>
);

// --- Page Specific Components ---
const LoadingState = () => <div className="flex items-center justify-center min-h-[60vh]"><div className={`w-16 h-16 border-4 ${retroThemeColors.panelBorder} border-t-transparent rounded-full animate-spin`}></div></div>;
const EmptyState = ({ icon: Icon, title, message }) => <RetroCard className="text-center py-20 bg-stone-50"><Icon className={`mx-auto h-20 w-20 mb-6 ${retroThemeColors.textSecondary}`} strokeWidth={1} /><h3 className={`text-3xl font-bold mb-2 ${retroThemeColors.textPrimary}`}>{title}</h3><p className={`text-lg ${retroThemeColors.textSecondary}`}>{message}</p></RetroCard>;

const ContestCard = ({ contest, status, onRegister, user }) => {
    const navigate = useNavigate();
    const isRegistered = contest.Participants.includes(user?._id);

    const formatContestDate = (date) => format(new Date(date), 'MMM dd, yyyy - h:mm a');
    const getTimeRemaining = (targetDate) => formatDistanceToNow(new Date(targetDate), { addSuffix: true });
    
    // **FIX**: The entire card is no longer a button. Navigation is handled by specific buttons.
    return (
        <RetroCard className="p-6 flex flex-col gap-4">
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className={`px-3 py-1 text-sm border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.status[status]}`}>{status.toUpperCase()}</span>
                    {contest.isPrivate && <span className="text-sm">Private</span>}
                </div>
                <h3 className={`text-2xl font-bold ${retroThemeColors.textAccent}`}>{contest.title}</h3>
                <p className={`text-base mt-1 ${retroThemeColors.textSecondary}`}>By {contest.creator.username}</p>
            </div>
            
            <hr className={`border-t-2 border-dashed border-stone-300`} />

            <div className="space-y-2 text-lg">
                <p className="flex items-center gap-2"><Calendar size={20} /><span>{formatContestDate(contest.startTime)}</span></p>
                <p className={`flex items-center gap-2 font-bold ${retroThemeColors.status[status]}`}>
                    <Clock size={20} />
                    <span>
                        {status === 'current' ? `Ends ${getTimeRemaining(contest.endTime)}`
                         : status === 'upcoming' ? `Starts ${getTimeRemaining(contest.startTime)}`
                         : `Ended ${getTimeRemaining(contest.endTime)}`}
                    </span>
                </p>
            </div>

            <div className="flex justify-between items-center mt-auto pt-4">
                <div className={`flex items-center gap-2 px-3 py-1 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg}`}>
                    <Users size={20} />
                    <span className="font-bold">{contest.Participants.length}</span>
                </div>

                {/* --- ACTION BUTTON LOGIC --- */}
                {status === 'upcoming' && (
                    <Button onClick={() => onRegister(contest._id)} disabled={isRegistered} small>
                        {isRegistered ? <><Check size={20} /> Registered</> : <><Edit3 size={20} /> Register</>}
                    </Button>
                )}

                {status === 'current' && (
                    <>
                        {isRegistered ? (
                            // **FIX**: "Enter" button now handles navigation.
                            <Button onClick={() => navigate(`/contests/${contest.slug}`)} small>
                                <LogIn size={20} /> Enter
                            </Button>
                        ) : contest.registrationOpen ? (
                            // **FIX**: "Register" button is now shown for ongoing contests if open.
                            <Button onClick={() => onRegister(contest._id)} small>
                                <Edit3 size={20} /> Register
                            </Button>
                        ) : (
                            <Button small disabled={true}>Registration Closed</Button>
                        )}
                    </>
                )}

                {status === 'past' && (
                    // **FIX**: "Results" button now handles navigation.
                    <Button onClick={() => navigate(`/contests/${contest.slug}`)} small type="secondary">
                        <Award size={20} /> Results
                    </Button>
                )}
            </div>
        </RetroCard>
    );
};

// --- Main Dashboard Component ---
export default function ContestDashboard() {
    const { user } = useContext(UserContext);
    const [contests, setContests] = useState({ upcoming: [], current: [], past: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('upcoming');
    const navigate = useNavigate();

    const fetchContests = async () => {
        try {
            setLoading(true);
            const data = await getAllGlobalContests();
            const now = new Date();
            setContests({
                upcoming: data.filter(c => new Date(c.startTime) > now).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
                current: data.filter(c => new Date(c.startTime) <= now && new Date(c.endTime) > now).sort((a, b) => new Date(b.endTime) - new Date(a.endTime)),
                past: data.filter(c => new Date(c.endTime) <= now).sort((a, b) => new Date(b.endTime) - new Date(a.endTime)),
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch contests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContests();
    }, []);

    const handleRegister = async (contestId) => {
        if (!user?._id) {
            navigate('/login');
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/contests/${contestId}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId: user._id }),
            });
            if (!response.ok) throw new Error('Registration failed');
            await fetchContests(); // Re-fetch all data to ensure UI consistency
        } catch (err) {
            console.error('Registration failed:', err.message);
        }
    };
    
    const contestsToDisplay = contests[tab] || [];

    return (
        <div className={`min-h-screen ${retroThemeColors.bgPrimary} px-4 py-16 font-retro`}>
            <div className="max-w-7xl mx-auto">
                <h1 className={`text-6xl font-bold text-center mb-4 ${retroThemeColors.textPrimary}`}>Coding Contests</h1>
                <p className={`text-xl text-center mb-10 ${retroThemeColors.textSecondary}`}>Test your skills. Compete with the best.</p>

                <RetroCard className="p-2 mb-10">
                    <div className="flex">
                        <TabButton isActive={tab === 'upcoming'} onClick={() => setTab('upcoming')}>Upcoming</TabButton>
                        <TabButton isActive={tab === 'current'} onClick={() => setTab('current')}>Ongoing</TabButton>
                        <TabButton isActive={tab === 'past'} onClick={() => setTab('past')}>Past</TabButton>
                    </div>
                </RetroCard>

                {loading ? <LoadingState /> :
                 error ? <EmptyState icon={Clock} title="Error" message={error} /> :
                 contestsToDisplay.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {contestsToDisplay.map((contest) => (
                            <ContestCard key={contest._id} contest={contest} status={tab} onRegister={handleRegister} user={user} />
                        ))}
                    </div>
                 ) : (
                    <EmptyState 
                        icon={tab === 'past' ? Award : Calendar} 
                        title={`No ${tab} contests`} 
                        message="Check back later for new events!" 
                    />
                 )}
            </div>
        </div>
    );
};