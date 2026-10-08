export const API_BASE_ENV = 'VITE_PORTFOLIO_API_BASE_URL';

/** Validate public configuration without reflecting its contents into errors. */
export function normalizeApiBase(value: unknown, allowLocalHttp = false): string {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`${API_BASE_ENV} is required. Set it in .env or the build environment.`);
    }
    if (/[\u0000-\u0020\\]/.test(value.trim()) || !/^https?:\/\//i.test(value.trim())) {
        throw new Error(`${API_BASE_ENV} must be an absolute HTTPS URL.`);
    }

    let url: URL;
    try {
        url = new URL(value.trim());
    } catch {
        throw new Error(`${API_BASE_ENV} must be an absolute HTTPS URL.`);
    }

    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(allowLocalHttp && local && url.protocol === 'http:')) ||
        url.username || url.password || url.search || url.hash || !/^[a-z\d.\-[\]:]+$/i.test(url.hostname)) {
        throw new Error(`${API_BASE_ENV} must use HTTPS with no credentials, query, or fragment. HTTP is allowed only for localhost development.`);
    }

    return url.href.replace(/\/+$/, '');
}
