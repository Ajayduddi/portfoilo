import { normalizeApiBase } from './apiConfig.ts';

/** Keep production connections limited to the configured API and the activity feed. */
export function productionCsp(apiBase: string): string {
    const apiOrigin = new URL(normalizeApiBase(apiBase)).origin;
    return [
        "default-src 'self'",
        "script-src 'self'",
        // Solid and GSAP set inline styles; script execution remains restricted.
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
        "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
        "img-src 'self' https: data:",
        `connect-src 'self' ${apiOrigin} https://github-contributions-api.jogruber.de`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
    ].join('; ');
}

/** Header-only controls must also be installed at the production host. */
export function productionHeaders(apiBase: string): Record<string, string> {
    return {
        'Content-Security-Policy': `${productionCsp(apiBase)}; frame-ancestors 'none'`,
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'X-Frame-Options': 'DENY',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
}
