import React, { useEffect, useState } from "react";
import { FiEdit, FiUserPlus, FiCheck } from "react-icons/fi";
import {
    GitHubIcon,
    CodeforcesIcon,
    LinkedInIcon,
    CodeChefIcon,
    LeetcodeIcon
} from "../icons/icons";
import {
    Link2,
} from "lucide-react";
import { getAllGlobalProblems } from "../../Tasks/getAllGlobalProblems.jsx";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-500",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-teal-100",
};

// --- Reusable UI Components ---
const Button = ({
    children,
    onClick,
    disabled,
    className = "",
    small = false,
    type = "primary",
}) => {
    const sizeStyle = small ? "px-4 py-2 text-base" : "px-5 py-2.5 text-lg";
    const baseStyle = `border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonText} shadow-chunky transition-all hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 font-bold`;
    const typeStyle = disabled
        ? "bg-stone-300"
        : type === "primary"
        ? retroThemeColors.buttonPrimaryBg
        : retroThemeColors.buttonSecondaryBg;
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${sizeStyle} ${typeStyle} ${className}`}
        >
            {children}
        </button>
    );
};

const RetroCard = ({ children, className = "" }) => (
    <div
        className={`border-4 ${retroThemeColors.panelBorder} bg-white shadow-chunky ${className}`}
    >
        {children}
    </div>
);

const DetailItem = ({ label, value }) => {
    if (!value || value === "Not specified") return null;
    return (
        <div>
            <p className={`text-sm ${retroThemeColors.textSecondary}`}>{label}</p>
            <p className={`font-bold text-base ${retroThemeColors.textPrimary}`}>
                {value}
            </p>
        </div>
    );
};

const SocialLink = ({ href, icon }) => {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonSecondaryBg} text-stone-700 hover:bg-teal-100 hover:text-teal-700 transition-colors`}
        >
            {icon}
        </a>
    );
};

// --- Circular Stat component for a more engaging retro UI ---
const CircularStat = ({ label, solved, total, colorClass, size = 110 }) => {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? (solved / total) : 0;
    const offset = circumference - percentage * circumference;

    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <div style={{ width: size, height: size }} className="relative">
                <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Circle */}
                    <circle
                        className="text-stone-200"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* Progress Circle */}
                    <circle
                        className={`${colorClass} transition-all duration-1000 ease-out`}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%'
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-bold text-xl ${retroThemeColors.textPrimary}`}>{solved}</span>
                    <span className={`text-xs ${retroThemeColors.textSecondary}`}>/ {total}</span>
                </div>
            </div>
            <p className={`text-sm uppercase font-bold ${retroThemeColors.textSecondary}`}>{label}</p>
        </div>
    );
};


// ================
// MAIN COMPONENT
// ================
export default function ProfileHeader({
    profile,
    stats,
    isFollowing,
    setIsFollowing,
    onEditClick,
    isOwnProfile,
    isFollowingAllowed,
    solvedProblems,
}) {
    // State to hold the total counts of all problems, fetched from the backend
    const [totalProblems, setTotalProblems] = useState({ Easy: 0, Medium: 0, Hard: 0, Veteran: 0, Decoder: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Effect to fetch all problems on component mount to calculate totals
    useEffect(() => {
        const fetchProblemsAndSetTotals = async () => {
            setIsLoading(true);
            try {
                const allProblems = await getAllGlobalProblems();
                const counts = { Easy: 0, Medium: 0, Hard: 0, Veteran: 0, Decoder: 0 };
                allProblems.forEach(problem => {
                    if (problem.difficulty && counts.hasOwnProperty(problem.difficulty)) {
                        counts[problem.difficulty]++;
                    }
                });
                setTotalProblems(counts);
            } catch (error) {
                console.error("Error fetching problems:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProblemsAndSetTotals();
    }, []);

    const handleFollow = async () => {
        const url = isFollowing
            ? `http://localhost:3000/profile/unfollow/${profile.username}`
            : `http://localhost:3000/profile/follow/${profile.username}`;
        try {
            await fetch(url, { method: "POST", credentials: "include" });
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Error toggling follow status:", error);
        }
    };

    const displayName =
        profile?.firstName || profile?.lastName
            ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
            : profile?.username;

    const socialLinks = profile?.socialLinks || {};

    // --- Calculate solved problem counts based on user's solved problems ---
    const { difficultyCounts, totalSolved } = React.useMemo(() => {
        const counts = { Easy: 0, Medium: 0, Hard: 0, Veteran: 0, Decoder: 0 };
        if (solvedProblems && Array.isArray(solvedProblems)) {
            solvedProblems.forEach((problem) => {
                if (problem.difficulty && counts.hasOwnProperty(problem.difficulty)) {
                    counts[problem.difficulty]++;
                }
            });
        }
        const solved = Object.values(counts).reduce((sum, count) => sum + count, 0);
        return { difficultyCounts: counts, totalSolved: solved };
    }, [solvedProblems]);

    const statCategories = [
        { label: "Easy", color: "text-green-500" },
        { label: "Medium", color: "text-yellow-500" },
        { label: "Hard", color: "text-red-500" },
        { label: "Veteran", color: "text-teal-500" },
        { label: "Decoder", color: "text-indigo-500" },
    ];

    return (
        <RetroCard>
            <div className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Profile Image & Rank */}
                    <div className="relative flex-shrink-0 text-center">
                        <img
                            src={
                                profile.profilePicture ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`
                            }
                            alt="Profile"
                            className={`w-32 h-32 object-cover border-4 ${retroThemeColors.panelBorder}`}
                        />
                        <div
                            className={`mt-2 px-3 py-1 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg} inline-block`}
                        >
                            <p className="font-bold text-lg">
                                RANK #{stats.ranking || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Profile Details & Actions */}
                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                            <div>
                                <h1 className="text-4xl font-bold">{displayName}</h1>
                                <p className={`text-xl ${retroThemeColors.textSecondary}`}>
                                    @{profile.username}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {isOwnProfile ? (
                                    <Button onClick={onEditClick} type="secondary" small>
                                        <FiEdit /> Edit Profile
                                    </Button>
                                ) : (
                                    isFollowingAllowed && (
                                        <Button
                                            onClick={handleFollow}
                                            type={isFollowing ? "secondary" : "primary"}
                                            small
                                        >
                                            {isFollowing ? (
                                                <><FiCheck /> Following</>
                                            ) : (
                                                <><FiUserPlus /> Follow</>
                                            )}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>

                        <hr className={`my-4 border-t-2 border-dashed border-stone-300`} />
                        
                        <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                            <SocialLink href={socialLinks?.personalsite} icon={<Link2 size={20} />} />
                            <SocialLink href={socialLinks?.github} icon={<GitHubIcon size={20} />} />
                            <SocialLink href={socialLinks?.linkedin} icon={<LinkedInIcon size={20} />} />
                            <SocialLink href={socialLinks?.codeforces} icon={<CodeforcesIcon size={20} />} />
                            <SocialLink href={socialLinks?.leetcode} icon={<LeetcodeIcon size={20} />} />
                            <SocialLink href={socialLinks?.codechef} icon={<CodeChefIcon size={20} />} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left mt-4">
                            <DetailItem label="Location" value={profile.city && profile.country ? `${profile.city}, ${profile.country}` : profile.country} />
                            <DetailItem label="Institution" value={profile.college} />
                            <DetailItem label="Age" value={profile.age} />
                            <DetailItem label="Email" value={profile.email} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Redesigned Solved Problems Stats Section with Circular Stats */}
            <div className={`border-t-4 ${retroThemeColors.panelBorder} p-4 sm:p-6 bg-stone-100`}>
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xl font-bold text-stone-700 uppercase">Problem Stats</h3>
                    <div className="text-right">
                        <p className="text-5xl font-bold text-stone-800">{totalSolved}</p>
                        <p className="text-sm uppercase font-bold text-stone-500">Total Solved</p>
                    </div>
                </div>
                {isLoading ? (
                    <div className="text-center p-8">Loading problem stats...</div>
                ) : (
                    <div className="flex flex-row flex-wrap justify-center sm:justify-around gap-x-4 gap-y-6">
                        {statCategories.map(cat => (
                            <CircularStat
                                key={cat.label}
                                label={cat.label}
                                solved={difficultyCounts[cat.label]}
                                total={totalProblems[cat.label]}
                                colorClass={cat.color}
                            />
                        ))}
                    </div>
                )}
            </div>
        </RetroCard>
    );
}
