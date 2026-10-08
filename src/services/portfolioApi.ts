// ─── API Endpoint Interfaces ──────────────────────────────────────────────────

import { normalizeApiBase } from '../lib/apiConfig';
import { requestJson, requestOk } from '../lib/request';
import { validateContactMessage, type ContactMessage } from '../lib/contactValidation';
import { parsePortfolio, parseLeetcode, parseCodechef } from './portfolioValidation';

const BASE = normalizeApiBase(import.meta.env.VITE_PORTFOLIO_API_BASE_URL, import.meta.env.DEV);
type PortfolioEndpoint = 'portfolio' | 'leetcode-profile' | 'codechef-profile' | 'portfolioEmail';

export function portfolioEndpoint(endpoint: PortfolioEndpoint): string {
    return `${BASE}/${endpoint}`;
}

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
    'Company Logo'?: string;
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
export function fetchPortfolioData(signal?: AbortSignal): Promise<PortfolioApiResponse | null> {
    return fetchParsed('portfolio', parsePortfolio, signal);
}

/** Fetch LeetCode problem-solving statistics */
export function fetchLeetcodeStats(signal?: AbortSignal): Promise<LeetcodeStats | null> {
    return fetchParsed('leetcode-profile', parseLeetcode, signal);
}

/** Fetch CodeChef profile statistics */
export function fetchCodechefStats(signal?: AbortSignal): Promise<CodechefApiResponse | null> {
    return fetchParsed('codechef-profile', parseCodechef, signal);
}

async function fetchParsed<T>(endpoint: PortfolioEndpoint, parse: (value: unknown) => T, signal?: AbortSignal): Promise<T | null> {
    try {
        return parse(await requestJson(portfolioEndpoint(endpoint), { signal, referrerPolicy: 'no-referrer' }));
    } catch {
        if (!signal?.aborted) console.warn(`[portfolioApi] ${endpoint} is unavailable`);
        return null;
    }
}

export async function sendContactMessage(message: ContactMessage, signal?: AbortSignal): Promise<void> {
    const body = validateContactMessage(message);
    await requestOk(portfolioEndpoint('portfolioEmail'), {
        method: 'POST', signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), referrerPolicy: 'no-referrer',
    });
}
