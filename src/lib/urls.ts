function cleanUrl(value: unknown): string {
    return typeof value === 'string' ? value.trim().replace(/^['"`]+|['"`]+$/g, '').trim() : '';
}

/** API links are data, not trusted navigation instructions. */
export function safeExternalUrl(value: unknown): string {
    const clean = cleanUrl(value);
    if (!/^https?:\/\//i.test(clean) || /[\u0000-\u0020\\]/.test(clean)) return '';
    try {
        const url = new URL(clean);
        return !url.username && !url.password ? url.href : '';
    } catch {
        return '';
    }
}

/** Preserve image-only data URLs and relative storage paths, rejecting other schemes. */
export function safeImageUrl(value: unknown, storageBase?: string): string {
    const clean = cleanUrl(value);
    if (!clean || /[\u0000-\u001f\\]/.test(clean)) return '';
    if (/^data:image\/(?:png|jpe?g|gif|webp|avif|svg\+xml)(?:;base64)?,/i.test(clean)) return clean;
    if (/^https?:\/\//i.test(clean)) {
        const safe = safeExternalUrl(clean);
        if (!safe) return '';
        const url = new URL(safe);
        url.protocol = 'https:';
        return url.href;
    }
    if (/^[a-z][a-z\d+.-]*:|^\/\//i.test(clean)) return '';
    if (storageBase) {
        const base = safeExternalUrl(storageBase);
        if (!base) return '';
        try {
            const url = new URL(clean, `${base.replace(/\/+$/, '')}/`);
            return url.origin === new URL(base).origin ? url.href : '';
        } catch {
            return '';
        }
    }
    return /^\/(?!\/)/.test(clean) ? clean : '';
}

export function safeAccentColor(value: unknown): string {
    return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value.trim()) ? value.trim() : '#646cff';
}
