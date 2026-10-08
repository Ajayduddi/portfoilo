import assert from 'node:assert/strict';
import { test } from 'node:test';
import { requestJson, requestOk, HttpError } from '../src/lib/request.ts';

function untilAbort(signal: AbortSignal): Promise<never> {
    return new Promise((_, reject) => {
        if (signal.aborted) reject(signal.reason);
        else signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    });
}

test('JSON requests reject HTTP errors and malformed bodies', async context => {
    context.mock.method(globalThis, 'fetch', async () => new Response('private server detail', { status: 503 }));
    await assert.rejects(requestJson('https://example.test'), error => error instanceof HttpError && error.status === 503 && !error.message.includes('private'));
    context.mock.method(globalThis, 'fetch', async () => new Response('{broken', { status: 200 }));
    await assert.rejects(requestJson('https://example.test'), SyntaxError);
});

test('deadlines abort a stalled connection', async context => {
    context.mock.method(globalThis, 'fetch', async (_url, init) => untilAbort(init.signal));
    await assert.rejects(requestJson('https://example.test', {}, 20), error => error.name === 'TimeoutError');
});

test('deadlines remain active until the JSON response body is consumed', async context => {
    context.mock.method(globalThis, 'fetch', async (_url, init) => ({ ok: true, json: () => untilAbort(init.signal) }));
    await assert.rejects(requestJson('https://example.test', {}, 20), error => error.name === 'TimeoutError');
});

test('caller cancellation preserves its reason and also handles an already-aborted caller', async context => {
    context.mock.method(globalThis, 'fetch', async (_url, init) => untilAbort(init.signal));
    const controller = new AbortController();
    const pending = requestJson('https://example.test', { signal: controller.signal });
    const reason = new DOMException('Component unmounted', 'AbortError');
    controller.abort(reason);
    await assert.rejects(pending, error => error === reason);
    await assert.rejects(requestJson('https://example.test', { signal: controller.signal }), error => error === reason);
});

test('contact requests send one POST and accept an OK response without requiring JSON', async context => {
    const calls: RequestInit[] = [];
    context.mock.method(globalThis, 'fetch', async (_url, init) => { calls.push(init); return new Response(null, { status: 204 }); });
    await requestOk('https://example.test', { method: 'POST', body: '{"message":"test"}' });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].method, 'POST');
    context.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 429 }));
    await assert.rejects(requestOk('https://example.test', { method: 'POST' }), error => error instanceof HttpError && error.status === 429);
});
