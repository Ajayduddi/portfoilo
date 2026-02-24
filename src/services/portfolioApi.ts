// ─── API Endpoint Interfaces ──────────────────────────────────────────────────

const BASE = 'https://n8n.ajayduddi.site/webhook';

// /webhook/portfolio
export interface ApiProfileData {
    Name: string;
    title: string;
    subtitle: string;
    bio: string;
    email: string;
    location: string;
    image: string;
}

export interface ApiSocial {
    Name: string;
    link: string;
}

export interface ApiProject {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    link?: string;
    github?: string;
    color: string;
    sort: number;
    tech: string[];
}

export interface ApiExperience {
    role: string;
    company: string;
    duration: string;
    description: string;   // "-," separated string
    type: 'work' | 'education';
    sort: number;
}

export interface ApiStat {
    Name: string;
    value: string;
}

export interface PortfolioApiResponse {
    profile: ApiProfileData;
    socials: ApiSocial[];
    projects: ApiProject[];
    experience: ApiExperience[];
    stats: ApiStat[];
    ttl: string;
}

// /webhook/leetcode-profile
export interface LeetcodeEntry {
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard';
    count: number;
}

export interface LeetcodeApiResponse {
    data: LeetcodeEntry[];
}

export interface LeetcodeStats {
    total: number;
    easy: number;
    medium: number;
    hard: number;
}

// /webhook/codechef-profile
export interface CodechefApiResponse {
    name: string;
    data: {
        learningPaths: number;
        practicePaths: number;
        contests: number;
        totalProblemsSolved: number;
        certificates: unknown[];
        ranking: Record<string, unknown>;
    };
    badges: string[];
}

// ─── Fetch Functions ───────────────────────────────────────────────────────────

/** Fetch full portfolio data (profile, projects, experience, stats, socials) */
export async function fetchPortfolioData(): Promise<PortfolioApiResponse | null> {
    try {
        const res = await fetch(`${BASE}/portfolio`, { referrer: 'no-referrer', referrerPolicy: 'no-referrer' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // Response is an array wrapping one object: [{ data: {...} }]
        const json: [{ data: PortfolioApiResponse }] = await res.json();
        return json[0]?.data ?? null;
    } catch (err) {
        console.error('[portfolioApi] fetchPortfolioData failed:', err);
        return null;
    }
}

/** Fetch LeetCode problem-solving statistics */
export async function fetchLeetcodeStats(): Promise<LeetcodeStats | null> {
    try {
        const res = await fetch(`${BASE}/leetcode-profile`, { referrer: 'no-referrer', referrerPolicy: 'no-referrer' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: LeetcodeApiResponse = await res.json();
        const entries = json.data ?? [];

        const get = (diff: LeetcodeEntry['difficulty']) =>
            entries.find(e => e.difficulty === diff)?.count ?? 0;

        return {
            total: get('All'),
            easy: get('Easy'),
            medium: get('Medium'),
            hard: get('Hard'),
        };
    } catch (err) {
        console.error('[portfolioApi] fetchLeetcodeStats failed:', err);
        return null;
    }
}

/** Fetch CodeChef profile statistics */
export async function fetchCodechefStats(): Promise<CodechefApiResponse | null> {
    try {
        const res = await fetch(`${BASE}/codechef-profile`, { referrer: 'no-referrer', referrerPolicy: 'no-referrer' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: CodechefApiResponse = await res.json();
        return json;
    } catch (err) {
        console.error('[portfolioApi] fetchCodechefStats failed:', err);
        return null;
    }
}
