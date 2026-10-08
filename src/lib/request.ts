export class HttpError extends Error {
    readonly status: number;

    constructor(status: number) {
        super(`Request failed with HTTP ${status}`);
        this.name = 'HttpError';
        this.status = status;
    }
}

/** The deadline includes response-body consumption; caller cancellation is preserved. */
async function request<T>(
    url: string,
    init: RequestInit,
    consume: (response: Response) => T | Promise<T>,
    timeoutMs: number,
): Promise<T> {
    const controller = new AbortController();
    const abort = () => controller.abort(init.signal?.reason);
    if (init.signal?.aborted) abort();
    else init.signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), timeoutMs);
    try {
        const response = await fetch(url, { ...init, signal: controller.signal });
        if (!response.ok) throw new HttpError(response.status);
        return await consume(response);
    } finally {
        clearTimeout(timer);
        init.signal?.removeEventListener('abort', abort);
    }
}

export function requestJson(url: string, init: RequestInit = {}, timeoutMs = 15_000): Promise<unknown> {
    return request(url, init, response => response.json(), timeoutMs);
}

/** Contact success means an OK webhook response, not independently verified email delivery. */
export function requestOk(url: string, init: RequestInit, timeoutMs = 20_000): Promise<void> {
    return request(url, init, () => undefined, timeoutMs);
}
