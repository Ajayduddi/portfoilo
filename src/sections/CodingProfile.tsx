import { createSignal, onMount, onCleanup, createMemo, For, Show } from 'solid-js';
import { gsap } from 'gsap';
import { createMotionAnimation } from '../context/MotionContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DATA } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { safeExternalUrl } from '../lib/urls';
import { requestJson } from '../lib/request';
import { parseGitHubActivity, type ContributionDay } from '../services/githubValidation';
import './CodingProfile.css';

gsap.registerPlugin(ScrollTrigger);

export default function CodingProfile() {
    const githubUsername = 'Ajayduddi';
    const { leetcodeStats, codechefData, portfolioData } = usePortfolio();

    const [contributionData, setContributionData] = createSignal<ContributionDay[]>([]);
    const [totalContributions, setTotalContributions] = createSignal(0);
    const [graphPath, setGraphPath] = createSignal('');
    const [points, setPoints] = createSignal<{ x: number; y: number; count: number; date: string }[]>([]);
    const [graphStatus, setGraphStatus] = createSignal<'loading' | 'ready' | 'empty' | 'error'>('loading');
    const maxDailyCount = createMemo(() => Math.max(...contributionData().map(day => day.count), 5));
    const markerPoints = createMemo(() => points().filter((_, index, all) => index % 7 === 0 || index === all.length - 1));

    const dayMs = 24 * 60 * 60 * 1000;
    const endDate = new Date();
    endDate.setUTCHours(0, 0, 0, 0);
    const startDate = new Date(endDate.getTime() - 364 * dayMs);
    const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
    const dateTicks = Array.from({ length: 5 }, (_, index) => ({
        x: 20 + (index / 4) * 560,
        label: dateFormatter.format(new Date(startDate.getTime() + Math.round((index / 4) * 364) * dayMs)),
    }));

    let pathEl!: SVGPathElement;
    let circlesContainer!: SVGGElement;
    let graphEl!: HTMLDivElement;
    let graphStarted = false;
    let reducedSeen = false;
    let reducedObserver: IntersectionObserver | undefined;
    let disposed = false;
    const controller = new AbortController();

    onCleanup(() => {
        disposed = true;
        controller.abort();
        reducedObserver?.disconnect();
    });

    const hackerrankBadges = createMemo(() =>
        portfolioData()?.stats?.find(s =>
            s.Name.trim().toLowerCase() === 'hackerankbadges' ||
            s.Name.trim().toLowerCase() === 'hackerrankbadges'
        )?.value ?? '3'
    );

    const getSocial = (name: string, fallback: string) =>
        safeExternalUrl(portfolioData()?.socials?.find(s => s.Name.trim().toLowerCase() === name)?.link) || safeExternalUrl(fallback);

    const githubLink = createMemo(() => getSocial('github', DATA.profile.socials.github));
    const leetcodeLink = createMemo(() => getSocial('leetcode', DATA.profile.socials.leetcode));
    const hackerrankLink = createMemo(() => getSocial('hackerrank', DATA.profile.socials.hackerrank));
    const codechefLink = createMemo(() => getSocial('codechef', DATA.profile.socials.codechef));
    const code360Link = createMemo(() => getSocial('code360', DATA.profile.socials.code360));
    const gfgLink = createMemo(() => getSocial('geeksforgeeks', DATA.profile.socials['geeksforgeeks'] ?? ''));

    const solvedPercentage = (count: number) => {
        const total = leetcodeStats()?.total ?? 0;
        return total > 0 ? Math.min(100, Math.max(0, (count / total) * 100)) : 0;
    };

    createMotionAnimation(animate => {
        reducedObserver?.disconnect();
        if (!animate) {
            reducedSeen = true;
            reducedObserver = new IntersectionObserver(entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    graphStarted = true;
                    reducedObserver?.disconnect();
                }
            });
            reducedObserver.observe(graphEl);
            return () => reducedObserver?.disconnect();
        }
        const rect = graphEl.getBoundingClientRect();
        if (graphStarted || (reducedSeen && rect.top < innerHeight && rect.bottom > 0)) {
            graphStarted = true;
            return;
        }
        const timeline = gsap.timeline({
            onStart: () => { graphStarted = true; },
            scrollTrigger: { trigger: graphEl, start: 'top 90%', once: true },
        });
        if (pathEl) {
            const length = pathEl.getTotalLength();
            if (length > 0) timeline.fromTo(pathEl,
                { strokeDasharray: length, strokeDashoffset: length, opacity: 0 },
                { strokeDashoffset: 0, opacity: 1, duration: 2, ease: 'power2.inOut' }, 0
            );
        }
        if (circlesContainer) timeline.fromTo(circlesContainer.querySelectorAll('circle'),
            { scale: 0, opacity: 0, transformOrigin: 'center' },
            { scale: 1, opacity: 1, duration: 0.3, stagger: { amount: 0.8 }, ease: 'back.out(1.7)' }, 0.8
        );
    }, () => graphStatus() === 'ready');

    onMount(async () => {
        try {
            const raw = await requestJson(`https://github-contributions-api.jogruber.de/v4/${githubUsername}`, { signal: controller.signal });
            if (disposed) return;
            const today = endDate.toISOString().split('T')[0];
            const firstDay = startDate.toISOString().split('T')[0];
            const data = parseGitHubActivity(raw, firstDay, today);
            setTotalContributions(data.total);
            const lastYear = data.contributions;
            setContributionData(lastYear);

            if (!lastYear.length) {
                setGraphStatus('empty');
                return;
            }

            const W = 600, H = 200, P = 20;
            const maxCount = maxDailyCount();
            const pts = lastYear.map(day => ({
                x: ((Date.parse(day.date) - startDate.getTime()) / (364 * dayMs)) * (W - 2 * P) + P,
                y: H - ((day.count / maxCount) * (H - 2 * P) + P),
                count: day.count,
                date: day.date,
            }));
            setPoints(pts);

            let d = `M ${pts[0].x} ${pts[0].y}`;
            for (let i = 0; i < pts.length - 1; i++) {
                const p0 = pts[i], p1 = pts[i + 1];
                d += ` C ${p0.x + (p1.x - p0.x) / 3} ${p0.y}, ${p1.x - (p1.x - p0.x) / 3} ${p1.y}, ${p1.x} ${p1.y}`;
            }
            setGraphPath(d);
            setGraphStatus('ready');

        } catch {
            if (disposed) return;
            setGraphStatus('error');
            console.warn('[CodingProfile] GitHub activity is unavailable');
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
                            <h3 class="card-title">GitHub Activity (Last Year)</h3>
                            <a href={githubLink()} target="_blank" rel="noreferrer" class="card-link-icon" aria-label="View GitHub profile">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        <div class="stats-content graph-container">
                            <Show when={graphStatus() === 'ready'} fallback={
                                <div class="loading-graph" role="status">
                                    {graphStatus() === 'loading' ? 'Loading activity data...' : graphStatus() === 'empty' ? 'No activity data available for the past year.' : 'GitHub activity is temporarily unavailable.'}
                                </div>
                            }>
                                <div ref={graphEl} class="github-graph-wrapper">
                                    <svg viewBox="0 0 600 200" class="github-graph-svg" role="img" aria-label="Daily GitHub contributions over the past 365 days">
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
                                            {Math.round(maxDailyCount() / 2)}
                                        </text>
                                        <text x="10" y="25" fill="#94a3b8" font-size="10" text-anchor="middle">
                                            {maxDailyCount()}
                                        </text>

                                        <For each={dateTicks}>{tick => (
                                            <text x={tick.x} y="198" fill="#94a3b8" font-size="10" text-anchor="middle">
                                                {tick.label}
                                            </text>
                                        )}</For>

                                        {/* GSAP-animated path (replaces framer-motion motion.path) */}
                                        <path
                                            ref={pathEl}
                                            d={graphPath()}
                                            fill="none"
                                            stroke="url(#lineGradient)"
                                            stroke-width="3"
                                            stroke-linecap="round"
                                            opacity="1"
                                        />

                                        {/* GSAP-animated circles (replaces framer-motion motion.circle) */}
                                        <g ref={circlesContainer}>
                                            <For each={markerPoints()}>{(p) => (
                                                <circle
                                                    cx={p.x} cy={p.y} r="3"
                                                    fill="#1e293b" stroke="#60a5fa" stroke-width="2"
                                                    style={{ opacity: '1' }}
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
                            <a href={leetcodeLink()} target="_blank" rel="noreferrer" class="card-link-icon" aria-label="View LeetCode profile">
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
                                                width: `${solvedPercentage(row.val())}%`
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
                                { platform: 'github', icon: 'fab fa-github', value: () => graphStatus() === 'loading' || graphStatus() === 'error' ? '-' : totalContributions().toLocaleString(), label: 'Contributions' },
                                { platform: 'hackerrank', icon: 'fab fa-hackerrank', value: () => hackerrankBadges(), label: 'HackerRank Badges' },
                                { platform: 'codechef', icon: 'fas fa-utensils', value: () => String(codechefData()?.data?.totalProblemsSolved ?? '-'), label: 'CodeChef Solved' },
                            ]}>{(stat) => (
                                <div class={`stat-card ${stat.platform}`}>
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
