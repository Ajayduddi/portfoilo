import { createSignal, onMount, onCleanup, createMemo, For, Show } from 'solid-js';
import { gsap } from 'gsap';
import { DATA } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import './CodingProfile.css';

interface ContributionDay { date: string; count: number; level: number; }
interface GitHubContributions { total: { [year: number]: number }; contributions: ContributionDay[]; }

export default function CodingProfile() {
    const githubUsername = 'Ajayduddi';
    const { leetcodeStats, codechefData, portfolioData } = usePortfolio();

    const [contributionData, setContributionData] = createSignal<ContributionDay[]>([]);
    const [totalContributions, setTotalContributions] = createSignal(0);
    const [graphPath, setGraphPath] = createSignal('');
    const [points, setPoints] = createSignal<{ x: number; y: number; count: number; date: string }[]>([]);

    let pathEl!: SVGPathElement;
    let circlesContainer!: SVGGElement;

    const hackerrankBadges = createMemo(() =>
        portfolioData()?.stats?.find(s =>
            s.Name.trim().toLowerCase() === 'hackerankbadges' ||
            s.Name.trim().toLowerCase() === 'hackerrankbadges'
        )?.value ?? '3'
    );

    const getSocial = (name: string, fallback: string) =>
        portfolioData()?.socials?.find(s => s.Name.toLowerCase() === name)?.link ?? fallback;

    const githubLink = createMemo(() => getSocial('github', DATA.profile.socials.github));
    const leetcodeLink = createMemo(() => getSocial('leetcode', DATA.profile.socials.leetcode));
    const hackerrankLink = createMemo(() => getSocial('hackerrank', DATA.profile.socials.hackerrank));
    const codechefLink = createMemo(() => getSocial('codechef', DATA.profile.socials.codechef));
    const code360Link = createMemo(() => getSocial('code360', DATA.profile.socials.code360));
    const gfgLink = createMemo(() => getSocial('geeksforgeeks', DATA.profile.socials['geeksforgeeks'] ?? ''));

    onMount(async () => {
        try {
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}`);
            const data: GitHubContributions = await res.json();

            if (data?.total) {
                const total = Object.values(data.total).reduce((a, c) => a + c, 0);
                setTotalContributions(total);
            }

            if (data?.contributions) {
                const today = new Date().toISOString().split('T')[0];
                const sorted = [...data.contributions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const last30 = sorted.filter(d => d.date <= today).slice(-30);
                setContributionData(last30);

                if (last30.length > 0) {
                    const W = 600, H = 200, P = 20;
                    const maxCount = Math.max(...last30.map(d => d.count), 5);
                    const pts = last30.map((day, i) => ({
                        x: (i / (last30.length - 1)) * (W - 2 * P) + P,
                        y: H - ((day.count / maxCount) * (H - 2 * P) + P),
                        count: day.count,
                        date: day.date,
                    }));
                    setPoints(pts);

                    if (pts.length > 1) {
                        let d = `M ${pts[0].x} ${pts[0].y}`;
                        for (let i = 0; i < pts.length - 1; i++) {
                            const p0 = pts[i], p1 = pts[i + 1];
                            d += ` C ${p0.x + (p1.x - p0.x) / 3} ${p0.y}, ${p1.x - (p1.x - p0.x) / 3} ${p1.y}, ${p1.x} ${p1.y}`;
                        }
                        setGraphPath(d);

                        // Animate the SVG path with GSAP (replaces framer-motion motion.path)
                        requestAnimationFrame(() => {
                            if (pathEl) {
                                const length = pathEl.getTotalLength();
                                gsap.fromTo(pathEl,
                                    { strokeDasharray: length, strokeDashoffset: length, opacity: 0 },
                                    { strokeDashoffset: 0, opacity: 1, duration: 2, ease: 'power2.inOut' }
                                );
                            }
                            // Animate circles with GSAP (replaces framer-motion motion.circle)
                            if (circlesContainer) {
                                const circles = circlesContainer.querySelectorAll('circle');
                                circles.forEach((c, i) => {
                                    gsap.fromTo(c,
                                        { scale: 0, opacity: 0, transformOrigin: 'center' },
                                        { scale: 1, opacity: 1, duration: 0.3, delay: 1 + i * 0.03, ease: 'back.out(1.7)' }
                                    );
                                });
                            }
                        });
                    }
                }
            }
        } catch (err) {
            console.error('[CodingProfile] GitHub fetch failed:', err);
        }
    });

    return (
        <section class="coding-profile" id="coding">
            <div class="container">
                <div class="section-header fade-in">
                    <span class="section-label">Coding Profile</span>
                    <h2 class="section-title font-display">
                        Contributions &amp; <span class="gradient-text">Stats</span>
                    </h2>
                </div>

                <div class="bento-grid">
                    {/* 1. GitHub Activity */}
                    <div class="bento-card github-main-stats fade-in stagger-1">
                        <div class="card-header">
                            <i class="fab fa-github card-icon"></i>
                            <h3 class="card-title">GitHub Activity (Last 30 Days)</h3>
                            <a href={githubLink()} target="_blank" rel="noreferrer" class="card-link-icon">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <div class="stats-content graph-container">
                            <Show when={graphPath()} fallback={<div class="loading-graph">Loading activity data...</div>}>
                                <div class="github-graph-wrapper">
                                    <svg viewBox="0 0 600 200" class="github-graph-svg">
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stop-color="#2563eb" />
                                                <stop offset="50%" stop-color="#3b82f6" />
                                                <stop offset="100%" stop-color="#60a5fa" />
                                            </linearGradient>
                                        </defs>

                                        <line x1="30" y1="180" x2="580" y2="180" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                                        <line x1="30" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="5,5" />
                                        <line x1="30" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.05)" stroke-width="1" stroke-dasharray="5,5" />

                                        <text x="10" y="185" fill="#94a3b8" font-size="10" text-anchor="middle">0</text>
                                        <text x="10" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">
                                            {Math.round(Math.max(...contributionData().map(d => d.count), 5) / 2)}
                                        </text>
                                        <text x="10" y="25" fill="#94a3b8" font-size="10" text-anchor="middle">
                                            {Math.max(...contributionData().map(d => d.count), 5)}
                                        </text>

                                        <For each={contributionData()}>{(d, i) => {
                                            const show = i() % 7 === 0 || i() === contributionData().length - 1;
                                            if (!show) return null;
                                            const x = (i() / (contributionData().length - 1)) * (600 - 40) + 20;
                                            const date = new Date(d.date);
                                            return (
                                                <text x={x} y="198" fill="#94a3b8" font-size="10" text-anchor="middle">
                                                    {`${date.getMonth() + 1}/${date.getDate()}`}
                                                </text>
                                            );
                                        }}</For>

                                        {/* GSAP-animated path (replaces framer-motion motion.path) */}
                                        <path
                                            ref={pathEl}
                                            d={graphPath()}
                                            fill="none"
                                            stroke="url(#lineGradient)"
                                            stroke-width="3"
                                            stroke-linecap="round"
                                            opacity="0"
                                        />

                                        {/* GSAP-animated circles (replaces framer-motion motion.circle) */}
                                        <g ref={circlesContainer}>
                                            <For each={points()}>{(p) => (
                                                <circle
                                                    cx={p.x} cy={p.y} r="4"
                                                    fill="#1e293b" stroke="#60a5fa" stroke-width="2"
                                                    style={{ opacity: '0' }}
                                                    class="graph-point"
                                                >
                                                    <title>{`${p.date}: ${p.count} contributions`}</title>
                                                </circle>
                                            )}</For>
                                        </g>
                                    </svg>
                                </div>
                            </Show>
                        </div>
                    </div>

                    {/* 2. LeetCode Stats */}
                    <div class="bento-card leetcode-main-stats fade-in stagger-2">
                        <div class="card-header">
                            <i class="fas fa-code card-icon"></i>
                            <h3 class="card-title">LeetCode</h3>
                            <a href={leetcodeLink()} target="_blank" rel="noreferrer" class="card-link-icon">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <div class="stats-content">
                            <div class="stat-item main-stat">
                                <span class="stat-value">{leetcodeStats()?.total ?? '-'}</span>
                                <span class="stat-label">Problems Solved</span>
                            </div>

                            <div class="progress-bars">
                                <For each={[
                                    { label: 'Easy', cls: 'easy', val: () => leetcodeStats()?.easy ?? 0 },
                                    { label: 'Medium', cls: 'medium', val: () => leetcodeStats()?.medium ?? 0 },
                                    { label: 'Hard', cls: 'hard', val: () => leetcodeStats()?.hard ?? 0 },
                                ]}>{(row) => (
                                    <div class="progress-item">
                                        <div class="progress-text">
                                            <span class={`difficulty ${row.cls}`}>{row.label}</span>
                                            <span>{row.val()}</span>
                                        </div>
                                        <div class="progress-track">
                                            <div class={`progress-fill ${row.cls}-bg`} style={{
                                                width: `${leetcodeStats()?.total ? (row.val() / leetcodeStats()!.total) * 100 : 0}%`
                                            }}></div>
                                        </div>
                                    </div>
                                )}</For>
                            </div>
                        </div>
                    </div>

                    {/* 3. Stats Summary */}
                    <div class="bento-card github-details-stats fade-in stagger-3">
                        <div class="card-header">
                            <i class="fas fa-chart-pie card-icon"></i>
                            <h3 class="card-title">Statistics</h3>
                        </div>
                        <div class="stat-grid">
                            <For each={[
                                { icon: 'fab fa-github', value: () => totalContributions() > 0 ? totalContributions().toLocaleString() : '-', label: 'Contributions' },
                                { icon: 'fab fa-hackerrank', value: () => hackerrankBadges(), label: 'HackerRank Badges' },
                                { icon: 'fas fa-utensils', value: () => String(codechefData()?.data?.totalProblemsSolved ?? '-'), label: 'CodeChef Solved' },
                            ]}>{(stat) => (
                                <div class="stat-card github">
                                    <div class="stat-icon-wrapper"><i class={stat.icon}></i></div>
                                    <div class="stat-info">
                                        <span class="stat-value">{stat.value()}</span>
                                        <span class="stat-label">{stat.label}</span>
                                    </div>
                                </div>
                            )}</For>
                        </div>
                    </div>

                    {/* 4. Other Platform Links */}
                    <div class="profiles-grid fade-in stagger-4">
                        <a href={hackerrankLink()} target="_blank" rel="noreferrer" class="profile-card">
                            <i class="fab fa-hackerrank profile-icon"></i>
                            <div class="profile-info"><h4>HackerRank</h4><span>Problem Solving</span></div>
                        </a>
                        <a href={codechefLink()} target="_blank" rel="noreferrer" class="profile-card">
                            <i class="fas fa-utensils profile-icon"></i>
                            <div class="profile-info"><h4>CodeChef</h4><span>Competitive</span></div>
                        </a>
                        <a href={code360Link()} target="_blank" rel="noreferrer" class="profile-card">
                            <i class="fas fa-code-branch profile-icon"></i>
                            <div class="profile-info"><h4>Code360</h4><span>Naukri Profile</span></div>
                        </a>
                        <a href={gfgLink() || 'https://www.geeksforgeeks.org/profile/ajayprofesd5f1'} target="_blank" rel="noreferrer" class="profile-card">
                            <i class="fas fa-terminal profile-icon"></i>
                            <div class="profile-info"><h4>GeeksforGeeks</h4><span>DSA &amp; Coding</span></div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
