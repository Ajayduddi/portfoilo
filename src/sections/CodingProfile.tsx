import React, { useEffect, useState } from 'react';
import { DATA } from '../data/portfolio';
import './CodingProfile.css';
import { motion } from 'framer-motion';

// Interfaces for API Responses
interface GitHubProfile {
    public_repos: number;
    followers: number;
    public_gists: number;
}

interface LeetCodeStats {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    acceptanceRate: number;
    status?: string;
}

interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

interface GitHubContributions {
    total: {
        [year: number]: number;
    };
    contributions: ContributionDay[];
}

export default function CodingProfile() {
    const githubUsername = 'Ajayduddi';
    const leetcodeUsername = 'Ajayduddi';

    // State for External Stats
    const [stats, setStats] = useState<{
        hackerrank: string | number;
        codechef: string | number;
        code360: string | number;
        geeksforgeeks: string | number;
    }>({
        hackerrank: '-',
        codechef: '-',
        code360: '-',
        geeksforgeeks: '-'
    });

    const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null);
    const [contributionData, setContributionData] = useState<ContributionDay[]>([]);
    const [totalContributions, setTotalContributions] = useState<number>(0);

    // Graph specific state
    const [graphPath, setGraphPath] = useState('');
    const [points, setPoints] = useState<{ x: number, y: number, count: number, date: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. LeetCode Stats
                const lcRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`);
                const lcData = await lcRes.json();
                if (lcData.status === 'success') {
                    setLeetcodeStats(lcData);
                }

                // 2. GitHub Contributions
                const ghContribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}`);
                const ghContribData: GitHubContributions = await ghContribRes.json();

                if (ghContribData) {
                    // Calculate Total Contributions
                    if (ghContribData.total) {
                        const total = Object.values(ghContribData.total).reduce((acc: number, curr: number) => acc + curr, 0);
                        setTotalContributions(total);
                    }

                    if (ghContribData.contributions) {
                        const today = new Date().toISOString().split('T')[0];

                        // Sort by date ascending to ensure correct order
                        const sortedContribs = ghContribData.contributions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                        // Filter out future dates
                        const validContribs = sortedContribs.filter(day => day.date <= today);

                        // Get last 30 days
                        const last30Days = validContribs.slice(-30);
                        setContributionData(last30Days);

                        // Process graph data
                        if (last30Days.length > 0) {
                            const width = 600; // SVG ViewBox width
                            const height = 200; // SVG ViewBox height
                            const padding = 20;

                            // Ensure we have at least a scale of 5, but if max is 0, graph is flat.
                            const maxCount = Math.max(...last30Days.map(d => d.count), 5);

                            const calculatedPoints = last30Days.map((day, index) => {
                                const x = (index / (last30Days.length - 1)) * (width - 2 * padding) + padding;
                                const y = height - ((day.count / maxCount) * (height - 2 * padding) + padding);
                                return { x, y, count: day.count, date: day.date };
                            });

                            setPoints(calculatedPoints);

                            // Generate smooth bezier curve
                            if (calculatedPoints.length > 1) {
                                let d = `M ${calculatedPoints[0].x} ${calculatedPoints[0].y}`;

                                for (let i = 0; i < calculatedPoints.length - 1; i++) {
                                    const p0 = calculatedPoints[i];
                                    const p1 = calculatedPoints[i + 1];

                                    // Control points for smooth curve
                                    const cp1x = p0.x + (p1.x - p0.x) / 3;
                                    const cp1y = p0.y;
                                    const cp2x = p1.x - (p1.x - p0.x) / 3;
                                    const cp2y = p1.y;

                                    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
                                }
                                setGraphPath(d);
                            }
                        }
                    }
                }

                // 3. Fetch External Stats (CodeChef & Code360) via Proxy
                // Note: HackerRank is difficult to scrape via proxy due to client-side rendering protection.
                // We will try CodeChef and Code360.

                // CodeChef
                try {
                    const ccRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.codechef.com/users/ajayduddi')}`);
                    const ccJson = await ccRes.json();
                    if (ccJson.contents) {
                        // Look for "Fully Solved (<i>2</i>)" or similar pattern
                        const match = ccJson.contents.match(/Fully Solved.*?\(.*?(\d+).*?\)/s);
                        if (match && match[1]) {
                            setStats(prev => ({ ...prev, codechef: parseInt(match[1]) }));
                        }
                    }
                } catch (e) {
                    console.warn("Failed to fetch CodeChef stats", e);
                }

                // Code360
                try {
                    const c360Res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.naukri.com/code360/profile/2dfd421c-a637-4508-bce2-2aa3bcabc2db')}`);
                    const c360Json = await c360Res.json();
                    if (c360Json.contents) {
                        const match = c360Json.contents.match(/Problems Solved.*?(\d+)/s);
                        if (match && match[1]) {
                            setStats(prev => ({ ...prev, code360: parseInt(match[1]) }));
                        }
                    }
                } catch (e) {
                    console.warn("Failed to fetch Code360 stats", e);
                }

                // GeeksforGeeks
                try {
                    const gfgRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.geeksforgeeks.org/profile/ajayprofesd5f1')}`);
                    const gfgJson = await gfgRes.json();
                    if (gfgJson.contents) {
                        const match = gfgJson.contents.match(/Problems Solved.*?(\d+)/s);
                        if (match && match[1]) {
                            setStats(prev => ({ ...prev, geeksforgeeks: parseInt(match[1]) }));
                        } else {
                            const match2 = gfgJson.contents.match(/problem_solved_section.*?(\d+)/s);
                            if (match2 && match2[1]) {
                                setStats(prev => ({ ...prev, geeksforgeeks: parseInt(match2[1]) }));
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Failed to fetch GFG stats", e);
                }


            } catch (error) {
                console.error("Error fetching coding stats:", error);
            }
        };

        fetchData();
    }, [githubUsername, leetcodeUsername]);

    return (
        <section className="coding-profile" id="coding">
            <div className="container">
                <div className="section-header fade-in">
                    <span className="section-label">Coding Profile</span>
                    <h2 className="section-title font-display">
                        Contributions & <span className="gradient-text">Stats</span>
                    </h2>
                </div>

                <div className="bento-grid">
                    {/* 1. GitHub Activity - Wide Block (Span 8) */}
                    <div className="bento-card github-main-stats fade-in stagger-1">
                        <div className="card-header">
                            <i className="fab fa-github card-icon"></i>
                            <h3 className="card-title">GitHub Activity (Last 30 Days)</h3>
                            <a href={DATA.profile.socials.github} target="_blank" rel="noreferrer" className="card-link-icon">
                                <i className="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <div className="stats-content graph-container">
                            {graphPath ? (
                                <div className="github-graph-wrapper">
                                    <svg viewBox="0 0 600 200" className="github-graph-svg">
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#2563eb" />
                                                <stop offset="50%" stopColor="#3b82f6" />
                                                <stop offset="100%" stopColor="#60a5fa" />
                                            </linearGradient>
                                        </defs>

                                        {/* Grid lines (Optional) */}
                                        <line x1="30" y1="180" x2="580" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                        <line x1="30" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5,5" />
                                        <line x1="30" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5,5" />

                                        {/* Y-Axis Labels */}
                                        <text x="10" y="185" fill="#94a3b8" fontSize="10" textAnchor="middle">0</text>
                                        <text x="10" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle">{Math.round(Math.max(...contributionData.map(d => d.count), 5) / 2)}</text>
                                        <text x="10" y="25" fill="#94a3b8" fontSize="10" textAnchor="middle">{Math.max(...contributionData.map(d => d.count), 5)}</text>

                                        {/* X-Axis Labels (Every 7 days) */}
                                        {contributionData.map((d, i) => {
                                            if (i % 7 === 0 || i === contributionData.length - 1) {
                                                const x = (i / (contributionData.length - 1)) * (600 - 2 * 20) + 20;
                                                const date = new Date(d.date);
                                                const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
                                                return (
                                                    <text key={i} x={x} y="198" fill="#94a3b8" fontSize="10" textAnchor="middle">
                                                        {dateStr}
                                                    </text>
                                                );
                                            }
                                            return null;
                                        })}

                                        {/* The Line */}
                                        <motion.path
                                            d={graphPath}
                                            fill="none"
                                            stroke="url(#lineGradient)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 2, ease: "easeInOut" }}
                                        />

                                        {/* Data Points */}
                                        {points.map((p, i) => (
                                            <motion.circle
                                                key={i}
                                                cx={p.x}
                                                cy={p.y}
                                                r="4"
                                                fill="#1e293b"
                                                stroke="#60a5fa"
                                                strokeWidth="2"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 1 + (i * 0.03), duration: 0.3 }}
                                                className="graph-point"
                                            >
                                                <title>{`${p.date}: ${p.count} contributions`}</title>
                                            </motion.circle>
                                        ))}
                                    </svg>
                                </div>
                            ) : (
                                <div className="loading-graph">Loading activity data...</div>
                            )}
                        </div>
                    </div>

                    {/* 2. LeetCode Stats - Vertical/Side Block (Span 4) */}
                    <div className="bento-card leetcode-main-stats fade-in stagger-2">
                        <div className="card-header">
                            <i className="fas fa-code card-icon"></i>
                            <h3 className="card-title">LeetCode</h3>
                            <a href={DATA.profile.socials.leetcode} target="_blank" rel="noreferrer" className="card-link-icon">
                                <i className="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <div className="stats-content">
                            <div className="stat-item main-stat">
                                <span className="stat-value">{leetcodeStats?.totalSolved || '-'}</span>
                                <span className="stat-label">Problems Solved</span>
                            </div>

                            <div className="progress-bars">
                                <div className="progress-item">
                                    <div className="progress-text">
                                        <span className="difficulty easy">Easy</span>
                                        <span>{leetcodeStats?.easySolved || 0}</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill easy-bg" style={{ width: `${leetcodeStats?.totalSolved ? (leetcodeStats.easySolved / leetcodeStats.totalSolved) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                                <div className="progress-item">
                                    <div className="progress-text">
                                        <span className="difficulty medium">Medium</span>
                                        <span>{leetcodeStats?.mediumSolved || 0}</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill medium-bg" style={{ width: `${leetcodeStats?.totalSolved ? (leetcodeStats.mediumSolved / leetcodeStats.totalSolved) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                                <div className="progress-item">
                                    <div className="progress-text">
                                        <span className="difficulty hard">Hard</span>
                                        <span>{leetcodeStats?.hardSolved || 0}</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill hard-bg" style={{ width: `${leetcodeStats?.totalSolved ? (leetcodeStats.hardSolved / leetcodeStats.totalSolved) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. GitHub Details/Community - Bottom Left (Span 6) */}
                    <div className="bento-card github-details-stats fade-in stagger-3">
                        <div className="card-header">
                            <i className="fas fa-chart-pie card-icon"></i>
                            <h3 className="card-title">Statistics</h3>
                        </div>
                        <div className="stat-grid">
                            <div className="stat-card github">
                                <div className="stat-icon-wrapper">
                                    <i className="fab fa-github"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{totalContributions > 0 ? totalContributions.toLocaleString() : '-'}</span>
                                    <span className="stat-label">Contributions</span>
                                </div>
                            </div>
                        </div>
                        <div className="stat-grid">
                            <div className="stat-card github">
                                <div className="stat-icon-wrapper">
                                    <i className="fab fa-hackerrank"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{3}</span>
                                    <span className="stat-label">Badges</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Other Profiles Grid - Bottom Right (Span 6) */}
                    <div className="profiles-grid fade-in stagger-4">
                        <a href={DATA.profile.socials.hackerrank} target="_blank" rel="noreferrer" className="profile-card">
                            <i className="fab fa-hackerrank profile-icon"></i>
                            <div className="profile-info">
                                <h4>HackerRank</h4>
                                <span>Problem Solving</span>
                            </div>
                        </a>
                        <a href={DATA.profile.socials.codechef} target="_blank" rel="noreferrer" className="profile-card">
                            <i className="fas fa-utensils profile-icon"></i>
                            <div className="profile-info">
                                <h4>CodeChef</h4>
                                <span>Competitive</span>
                            </div>
                        </a>
                        <a href={DATA.profile.socials.code360} target="_blank" rel="noreferrer" className="profile-card">
                            <i className="fas fa-code-branch profile-icon"></i>
                            <div className="profile-info">
                                <h4>Code360</h4>
                                <span>Naukri Profile</span>
                            </div>
                        </a>
                        <a href={DATA.profile.socials['geeksforgeeks'] || 'https://www.geeksforgeeks.org/profile/ajayprofesd5f1'} target="_blank" rel="noreferrer" className="profile-card">
                            <i className="fas fa-terminal profile-icon"></i>
                            <div className="profile-info">
                                <h4>GeeksforGeeks</h4>
                                <span>DSA & Coding</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
