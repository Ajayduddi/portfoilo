export interface ContributionDay { date: string; count: number; }

export function parseGitHubActivity(value: unknown, firstDay: string, lastDay: string): { total: number; contributions: ContributionDay[] } {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid GitHub activity response');
    const data = value as Record<string, unknown>;
    if (!Array.isArray(data.contributions)) throw new Error('Invalid GitHub activity response');
    const totals = data.total && typeof data.total === 'object' && !Array.isArray(data.total) ? Object.values(data.total) : [];
    const sum = totals.filter(count => Number.isSafeInteger(count) && count >= 0).reduce((a, count) => a + count, 0);
    const days = new Map<string, ContributionDay>();
    for (const raw of data.contributions) {
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
        const { date, count } = raw as Record<string, unknown>;
        if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < firstDay || date > lastDay) continue;
        const time = Date.parse(date);
        if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date || !Number.isSafeInteger(count) || (count as number) < 0) continue;
        days.set(date, { date, count: count as number });
    }
    return { total: Number.isSafeInteger(sum) ? sum : 0, contributions: [...days.values()].sort((a, b) => a.date.localeCompare(b.date)) };
}
