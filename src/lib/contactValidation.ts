export interface ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const CONTACT_LIMITS = { name: 100, email: 254, subject: 200, message: 5000 } as const;

export class ContactValidationError extends Error {}

export function validateContactMessage(value: unknown): ContactMessage {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new ContactValidationError('Please complete all fields.');
    const input = value as Record<string, unknown>;
    if (typeof input.name !== 'string' || typeof input.email !== 'string' || typeof input.subject !== 'string' || typeof input.message !== 'string') {
        throw new ContactValidationError('Please complete all fields.');
    }
    const result = { name: input.name.trim(), email: input.email.trim(), subject: input.subject.trim(), message: input.message.trim() };
    if ([result.name, result.email, result.subject].some(field => /[\u0000-\u001f\u007f]/.test(field)) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(result.message)) {
        throw new ContactValidationError('Please remove invalid characters from the form.');
    }
    for (const key of Object.keys(CONTACT_LIMITS) as (keyof ContactMessage)[]) {
        if (!result[key]) throw new ContactValidationError('Please complete all fields.');
        if (result[key].length > CONTACT_LIMITS[key]) throw new ContactValidationError('One or more fields exceed the allowed length.');
    }
    if (!/^[^\s@]+@[^\s@]+$/.test(result.email)) throw new ContactValidationError('Please enter a valid email address.');
    return result;
}
