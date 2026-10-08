import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeApiBase } from '../src/lib/apiConfig.ts';
import { safeExternalUrl, safeImageUrl, safeAccentColor } from '../src/lib/urls.ts';
import { validateContactMessage, CONTACT_LIMITS, ContactValidationError } from '../src/lib/contactValidation.ts';
import { parsePortfolio, parseLeetcode, parseCodechef } from '../src/services/portfolioValidation.ts';
import { parseGitHubActivity } from '../src/services/githubValidation.ts';
import { productionCsp, productionHeaders } from '../src/lib/securityPolicy.ts';

test('API configuration requires an HTTPS base and preserves its webhook prefix', () => {
    assert.equal(normalizeApiBase(' https://api.example.test/webhook/// '), 'https://api.example.test/webhook');
    for (const value of [undefined, '', '/webhook', 'https:example.test', 'http://api.example.test', 'https://user:password@example.test', 'https://example.test?token=secret', 'https://example.test#x', 'https://exam\nple.test', 'https://example.test\\path', 'https://example.test;foo']) {
        assert.throws(() => normalizeApiBase(value));
    }
    assert.equal(normalizeApiBase('http://127.0.0.1:5678/webhook', true), 'http://127.0.0.1:5678/webhook');
    assert.throws(() => normalizeApiBase('http://192.168.1.1:5678/webhook', true));
    assert.throws(() => normalizeApiBase('https://user:secret@example.test'), error => !String(error).includes('secret'));
});

test('remote links cannot execute scripts or smuggle credentials', () => {
    assert.equal(safeExternalUrl('`https://example.test/work?q=1`'), 'https://example.test/work?q=1');
    for (const value of ['javascript:alert(1)', 'data:text/html,test', 'vbscript:test', '//evil.test', 'https:evil.test', 'https://u:p@example.test', 'https://exam\nple.test', 'https://example.test\\foo', {}, null]) {
        assert.equal(safeExternalUrl(value), '');
    }
});

test('image URLs accept supported images and storage paths, with stable placeholders otherwise', () => {
    assert.equal(safeImageUrl('projects/image.png', 'https://storage.example.test'), 'https://storage.example.test/projects/image.png');
    assert.equal(safeImageUrl('/icons/java.svg'), '/icons/java.svg');
    assert.equal(safeImageUrl('http://images.example.test/photo.png'), 'https://images.example.test/photo.png');
    assert.equal(safeImageUrl('data:image/png;base64,AA=='), 'data:image/png;base64,AA==');
    for (const value of ['javascript:alert(1)', 'data:text/html,<script/>', '//evil.test/image.svg', '\\evil.test/image', 'https://u:p@example.test/a.png', 'blob:test', 'missing.jpg']) assert.equal(safeImageUrl(value), '');
    assert.equal(safeImageUrl('//evil.test/image.svg', 'https://storage.example.test'), '');
    assert.equal(safeAccentColor('url(javascript:test)'), '#646cff');
    assert.equal(safeAccentColor('#AABBCC'), '#AABBCC');
});

test('portfolio boundary filters malformed rows and unsafe fields while retaining complete descriptions', () => {
    const description = 'First complete paragraph-,Second paragraph\nThird paragraph';
    const result = parsePortfolio([{ data: {
        profile: { bio: description, image: 'javascript:alert(1)' },
        projects: [null, 1, {}, { id: 'a', title: 'Example', description, tech: ['Solid', {}, 1], sort: '2', link: 'javascript:alert(1)', github: 'https://example.test/source', image: '/project.svg', color: 'red' }],
        experience: [{ company: 'Example', role: 'Engineer', duration: '2025 - Present', description, type: 'work', sort: '3', 'Company Logo': 'data:text/html,test' }, { company: 'Other', role: 'X', duration: '2020', type: 'invalid' }],
        socials: [{ Name: 'GitHub', link: 'javascript:test' }, { Name: 'LeetCode', link: 'https://example.test/code' }],
        stats: [null, { Name: 'studentsTrained', value: '2K+' }, { Name: 'bad', value: {} }],
    } }]);
    assert.equal(result.profile.bio, description);
    assert.equal(result.profile.image, '');
    assert.equal(result.projects.length, 1);
    assert.deepEqual(result.projects[0].tech, ['Solid']);
    assert.equal(result.projects[0].sort, 2);
    assert.equal(result.projects[0].description, description);
    assert.equal(result.projects[0].link, '');
    assert.equal(result.projects[0].color, '#646cff');
    assert.equal(result.experience.length, 1);
    assert.equal(result.experience[0]['Company Logo'], '');
    assert.deepEqual(result.socials, [{ Name: 'LeetCode', link: 'https://example.test/code' }]);
    assert.deepEqual(result.stats, [{ Name: 'studentsTrained', value: '2K+' }]);
    assert.deepEqual(parsePortfolio([{ data: { experience: [] } }]).experience, []);
    assert.deepEqual(parsePortfolio([{ data: { profile: {} } }]).experience, []);
    for (const value of [null, {}, [], [{ data: 'bad' }], [{ data: {} }]]) assert.throws(() => parsePortfolio(value));
});

test('coding platform counts reject negative, nonnumeric, fractional and unsafe numbers', () => {
    assert.deepEqual(parseLeetcode({ data: [{ difficulty: 'All', count: '7' }, { difficulty: 'easy', count: 4 }, { difficulty: 'Medium', count: -2 }, { difficulty: 'Hard', count: {} }, { difficulty: '__proto__', count: 100 }] }), { total: 7, easy: 4, medium: 0, hard: 0 });
    const chef = parseCodechef({ name: 'Test', data: { practicePaths: '3', contests: 1.5, totalProblemsSolved: Number.MAX_SAFE_INTEGER + 1 }, badges: ['One', {}] });
    assert.equal(chef.data.practicePaths, 3);
    assert.equal(chef.data.contests, 0);
    assert.equal(chef.data.totalProblemsSolved, 0);
    assert.deepEqual(chef.badges, ['One']);
    assert.throws(() => parseLeetcode({ data: {} }));
    assert.throws(() => parseCodechef({ name: 'Test', data: null }));
});

test('GitHub activity retains real date positions and rejects invalid or duplicate days', () => {
    const result = parseGitHubActivity({ total: { 2025: 10, 2026: 20, bad: -1, invalid: '10' }, contributions: [null, {}, { date: '2026-02-30', count: 1 }, { date: '2025-01-01', count: 5 }, { date: '2026-02-02', count: -2 }, { date: '2026-02-03', count: 0 }, { date: '2026-03-02', count: 3 }, { date: '2026-03-02', count: 4 }, { date: '2027-01-01', count: 1 }] }, '2026-01-01', '2026-12-31');
    assert.equal(result.total, 30);
    assert.deepEqual(result.contributions, [{ date: '2026-02-03', count: 0 }, { date: '2026-03-02', count: 4 }]);
    assert.throws(() => parseGitHubActivity({ contributions: {} }, '2026-01-01', '2026-12-31'));
    assert.equal(parseGitHubActivity({ total: { a: Number.MAX_SAFE_INTEGER, b: 1 }, contributions: [] }, '', '').total, 0);
});

test('contact data is trimmed, length-limited and validated without discarding normal message newlines', () => {
    const valid = { name: ' Test ', email: ' test@example.test ', subject: ' Example ', message: ' A\nB ' };
    assert.deepEqual(validateContactMessage(valid), { name: 'Test', email: 'test@example.test', subject: 'Example', message: 'A\nB' });
    for (const value of [null, {}, { ...valid, name: '' }, { ...valid, email: 'invalid' }, { ...valid, subject: 'Title\r\nBcc: evil@test.test' }, { ...valid, message: 'A\u0000B' }]) assert.throws(() => validateContactMessage(value), ContactValidationError);
    for (const [key, limit] of Object.entries(CONTACT_LIMITS)) assert.throws(() => validateContactMessage({ ...valid, [key]: 'x'.repeat(limit + 1) }), ContactValidationError);
});

test('production security policy follows the configured API and requires server-side framing headers', () => {
    const policy = productionCsp('https://api.example.test/webhook');
    assert(policy.includes("script-src 'self'"));
    assert(policy.includes("connect-src 'self' https://api.example.test https://github-contributions-api.jogruber.de"));
    assert(!policy.includes('unsafe-eval'));
    assert(!policy.includes('frame-ancestors'));
    assert(productionHeaders('https://api.example.test/webhook')['Content-Security-Policy'].endsWith("frame-ancestors 'none'"));
});
