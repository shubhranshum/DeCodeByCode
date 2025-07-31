import React, { useEffect, useState } from "react";
import { FiEdit, FiUserPlus, FiCheck } from "react-icons/fi";
import {
    GitHubIcon,
    CodeforcesIcon,
    LinkedInIcon,
    CodeChefIcon,
    LeetcodeIcon
} from "../icons/icons";
import { Link2 } from "lucide-react";
import { getAllGlobalProblems } from "../../Tasks/getAllGlobalProblems.jsx";

// --- RETRO THEME DEFINITIONS ---
const retroThemeColors = {
    textPrimary: "text-stone-800",
    textSecondary: "text-stone-600",
    textAccent: "text-teal-600",
    panelBorder: "border-stone-800",
    buttonPrimaryBg: "bg-teal-400 hover:bg-teal-500",
    buttonSecondaryBg: "bg-stone-200 hover:bg-stone-300",
    buttonText: "text-stone-800",
    accentBg: "bg-teal-100",
    statBg: "bg-stone-50",
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
        <div className="bg-stone-50 p-3 border-2 border-stone-200">
            <p className={`text-xs uppercase tracking-wider ${retroThemeColors.textSecondary}`}>
                {label}
            </p>
            <p className={`font-bold text-base mt-1 ${retroThemeColors.textPrimary}`}>
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
            className={`p-2 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.buttonSecondaryBg} text-stone-700 hover:bg-teal-100 hover:text-teal-700 transition-colors rounded-full`}
        >
            {icon}
        </a>
    );
};

const CircularStat = ({ label, solved, total, colorClass, size = 90 }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? (solved / total) : 0;
    const offset = circumference - percentage * circumference;

    return (
        <div className="flex flex-col items-center">
            <div style={{ width: size, height: size }} className="relative">
                <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                    <circle
                        className="text-stone-200"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    <circle
                        className={`${colorClass} transition-all duration-700 ease-out`}
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
                </div>
            </div>
            <p className={`mt-2 text-xs uppercase font-semibold ${retroThemeColors.textSecondary}`}>{label}</p>
        </div>
    );
};

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
    const [totalProblems, setTotalProblems] = useState({ Easy: 0, Medium: 0, Hard: 0, Veteran: 0, Decoder: 0 });
    const [isLoading, setIsLoading] = useState(true);

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
        { label: "Easy", color: "text-green-400" },
        { label: "Medium", color: "text-yellow-500" },
        { label: "Hard", color: "text-red-500" },
        { label: "Veteran", color: "text-teal-500" },
        { label: "Decoder", color: "text-indigo-500" },
    ];

    return (
        <RetroCard className="overflow-hidden">
            {/* Profile Header Section */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-50 to-stone-50 border-b-4 border-stone-800">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={
                                    profile.profilePicture ||
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`
                                }
                                alt="Profile"
                                className="w-28 h-28 object-cover border-4 border-stone-800 rounded-full bg-white"
                            />
                            <div className={`mt-3 px-3 py-1 border-2 ${retroThemeColors.panelBorder} ${retroThemeColors.accentBg} rounded-full`}>
                                <p className="font-bold text-base">RANK #{stats.ranking || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{displayName}</h1>
                                <p className={`text-lg ${retroThemeColors.textSecondary} mt-1`}>
                                    @{profile.username}
                                </p>
                            </div>
                            
                            <div className="flex gap-3">
                                {isOwnProfile ? (
                                    <Button onClick={onEditClick} type="secondary" small>
                                        <FiEdit className="text-lg" /> Edit Profile
                                    </Button>
                                ) : (
                                    isFollowingAllowed && (
                                        <Button
                                            onClick={handleFollow}
                                            type={isFollowing ? "secondary" : "primary"}
                                            small
                                        >
                                            {isFollowing ? (
                                                <><FiCheck className="text-lg" /> Following</>
                                            ) : (
                                                <><FiUserPlus className="text-lg" /> Follow</>
                                            )}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start mt-4 mb-3">
                            <div className="flex flex-wrap gap-2">
                                <SocialLink href={socialLinks?.personalsite} icon={<Link2 size={18} />} />
                                <SocialLink href={socialLinks?.github} icon={<GitHubIcon size={18} />} />
                                <SocialLink href={socialLinks?.linkedin} icon={<LinkedInIcon size={18} />} />
                                <SocialLink href={socialLinks?.codeforces} icon={<CodeforcesIcon size={18} />} />
                                <SocialLink href={socialLinks?.leetcode} icon={<LeetcodeIcon size={18} />} />
                                <SocialLink href={socialLinks?.codechef} icon={<CodeChefIcon size={18} />} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <DetailItem label="Location" value={profile.city && profile.country ? `${profile.city}, ${profile.country}` : profile.country} />
                    <DetailItem label="Institution" value={profile.college} />
                    <DetailItem label="Age" value={profile.age} />
                    <DetailItem label="Email" value={profile.email} />
                </div>
            </div>

            {/* Stats Section */}
            <div className={`border-t-4 ${retroThemeColors.panelBorder} p-5 sm:p-6 ${retroThemeColors.statBg}`}>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-stone-700 mb-3 sm:mb-0">
                        Problem Statistics
                    </h3>
                    <div className="text-center">
                        <div className="inline-block bg-white border-2 border-stone-800 px-5 py-3">
                            <p className="text-4xl font-bold text-stone-800">{totalSolved}</p>
                            <p className="text-sm uppercase font-semibold text-stone-600">Total Solved</p>
                        </div>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="text-center p-8">Loading problem stats...</div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                        {statCategories.map(cat => (
                            <CircularStat
                                key={cat.label}
                                label={cat.label}
                                solved={difficultyCounts[cat.label]}
                                total={totalProblems[cat.label]}
                                colorClass={cat.color}
                                size={window.innerWidth < 640 ? 80 : 90}
                            />
                        ))}
                    </div>
                )}
            </div>
        </RetroCard>
    );
}