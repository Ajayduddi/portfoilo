import type {
    ApiExperience, ApiProfileData, ApiProject, ApiSocial, ApiStat,
    CodechefApiResponse, LeetcodeStats, PortfolioApiResponse,
} from './portfolioApi';
import { safeAccentColor, safeExternalUrl, safeImageUrl } from '../lib/urls.ts';

function record(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const text = (value: unknown): string => typeof value === 'string' ? value : '';
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
const rows = (value: unknown): Record<string, unknown>[] => Array.isArray(value) ? value.filter(record) : [];

function number(value: unknown, fallback = 0): number {
    const parsed = typeof value === 'number' ? value : typeof value === 'string' && /^-?\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : NaN;
    return Number.isFinite(parsed) ? parsed : fallback;
}

/** Only consumed, typed fields cross the remote-data boundary. Invalid rows are omitted. */
export function parsePortfolio(value: unknown): PortfolioApiResponse {
    const data: unknown = Array.isArray(value) && record(value[0]) ? value[0].data : null;
    if (!record(data) || !['profile', 'socials', 'projects', 'experience', 'stats', 'ttl'].some(key => key in data)) {
        throw new Error('Invalid portfolio response');
    }
    const rawProfile = record(data.profile) ? data.profile : {};
    const profile: ApiProfileData = {
        Name: text(rawProfile.Name), title: text(rawProfile.title), subtitle: text(rawProfile.subtitle),
        bio: text(rawProfile.bio), email: text(rawProfile.email), location: text(rawProfile.location),
        image: safeImageUrl(rawProfile.image),
    };
    const socials: ApiSocial[] = rows(data.socials).flatMap(row => {
        const Name = text(row.Name).trim(), link = safeExternalUrl(row.link);
        return Name && link ? [{ Name, link }] : [];
    });
    const stats: ApiStat[] = rows(data.stats).flatMap(row => {
        const Name = text(row.Name).trim(), value = text(row.value);
        return Name && value ? [{ Name, value }] : [];
    });
    const projects: ApiProject[] = rows(data.projects).flatMap(row => {
        const id = text(row.id).trim(), title = text(row.title).trim();
        if (!id || !title) return [];
        return [{
            id, title, description: text(row.description), longDescription: text(row.longDescription),
            image: text(row.image), link: safeExternalUrl(row.link), github: safeExternalUrl(row.github) || undefined,
            color: safeAccentColor(row.color), sort: number(row.sort), tech: strings(row.tech),
        }];
    });
    const experience: ApiExperience[] = rows(data.experience).flatMap(row => {
        const role = text(row.role), company = text(row.company), duration = text(row.duration);
        if (!role.trim() || !company.trim() || !duration.trim() || (row.type !== 'work' && row.type !== 'education')) return [];
        return [{
            role, company, duration, description: text(row.description), type: row.type,
            sort: number(row.sort), 'Company Logo': safeImageUrl(row['Company Logo']),
        }];
    });
    return { profile, socials, stats, projects, experience, ttl: text(data.ttl) };
}

export function parseLeetcode(value: unknown): LeetcodeStats {
    if (!record(value) || !Array.isArray(value.data)) throw new Error('Invalid LeetCode response');
    const stats: LeetcodeStats = { total: 0, easy: 0, medium: 0, hard: 0 };
    const keys: Record<string, keyof LeetcodeStats> = { all: 'total', easy: 'easy', medium: 'medium', hard: 'hard' };
    for (const row of rows(value.data)) {
        const difficulty = text(row.difficulty).trim().toLowerCase();
        const key = Object.prototype.hasOwnProperty.call(keys, difficulty) ? keys[difficulty] : undefined;
        const count = number(row.count, NaN);
        if (key && Number.isSafeInteger(count) && count >= 0) stats[key] = count;
    }
    return stats;
}

export function parseCodechef(value: unknown): CodechefApiResponse {
    if (!record(value) || typeof value.name !== 'string' || !record(value.data)) throw new Error('Invalid CodeChef response');
    const data = value.data;
    const count = (key: string) => {
        const n = number(data[key]);
        return Number.isSafeInteger(n) && n >= 0 ? n : 0;
    };
    return {
        name: value.name,
        data: {
            learningPaths: count('learningPaths'), practicePaths: count('practicePaths'), contests: count('contests'),
            totalProblemsSolved: count('totalProblemsSolved'), certificates: Array.isArray(data.certificates) ? data.certificates : [],
            ranking: record(data.ranking) ? data.ranking : {},
        },
        badges: strings(value.badges),
    };
}
