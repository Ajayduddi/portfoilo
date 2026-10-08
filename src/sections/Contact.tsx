import { createSignal, onCleanup } from 'solid-js';
import { DATA } from '../data/portfolio';
import { sendContactMessage } from '../services/portfolioApi';
import { CONTACT_LIMITS, ContactValidationError } from '../lib/contactValidation';
import { HttpError } from '../lib/request';
import './Contact.css';

export default function Contact() {
    let formEl!: HTMLFormElement;
    const [status, setStatus] = createSignal<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = createSignal('');
    let controller: AbortController | undefined;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const resetStatus = () => {
        clearTimeout(resetTimer);
        resetTimer = undefined;
        setStatus('idle');
    };

    onCleanup(() => {
        disposed = true;
        controller?.abort();
        clearTimeout(resetTimer);
    });

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        if (status() === 'loading' || !formEl.reportValidity()) return;
        clearTimeout(resetTimer);
        const formData = new FormData(formEl);
        const field = (key: string) => {
            const value = formData.get(key);
            return typeof value === 'string' ? value : '';
        };
        const name = field('user_name'), email = field('user_email'), subject = field('subject'), message = field('message');
        controller = new AbortController();
        setStatus('loading');
        setErrorMsg('');

        try {
            await sendContactMessage({ name, email, subject, message }, controller.signal);
            if (disposed) return;
            setStatus('success');
            formEl.reset();

            // Auto-reset back to form after 4 seconds
            resetTimer = setTimeout(resetStatus, 4000);
        } catch (err: unknown) {
            if (disposed) return;
            setStatus('error');
            setErrorMsg(err instanceof ContactValidationError ? err.message :
                err instanceof HttpError && err.status === 429 ? 'Too many attempts. Please try again later.' :
                err instanceof DOMException && err.name === 'TimeoutError' ? 'The request timed out. Please try again.' :
                'Your message could not be sent. Please try again.');
        } finally {
            controller = undefined;
        }
    };

    return (
        <section class="contact" id="contact">
            <div class="contact-glow"></div>

            <div class="container">
                <div class="contact-wrapper">
                    {/* Left: Info */}
                    <div class="contact-info">
                        <div class="fade-in">
                            <span class="section-label">Get In Touch</span>
                            <h2 class="contact-title section-title font-display">
                                Let's Build Something<br />
                                <span class="gradient-text">Amazing Together</span>
                            </h2>
                        </div>
                        <p class="contact-description section-description fade-in stagger-1">
                            Always ready to discuss innovative projects and architectural challenges.
                            Let's connect and explore how we can create exceptional value together.
                        </p>

                        <div class="contact-details fade-in stagger-2">
                            <a href={`mailto:${DATA.profile.email}`} class="contact-detail-item">
                                <i class="fas fa-envelope"></i>
                                <span>{DATA.profile.email}</span>
                            </a>
                            <div class="contact-detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>{DATA.profile.location}</span>
                            </div>
                        </div>

                        <div class="contact-socials fade-in stagger-3">
                            <a href={DATA.profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href={DATA.profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href={DATA.profile.socials.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode">
                                <i class="fas fa-code"></i>
                            </a>
                        </div>
                    </div>

                    {/* Right: Form card */}
                    <div class="contact-form-wrapper fade-in">
                        <div class="contact-form glass-card">

                            {/* ── SUCCESS STATE ── */}
                            {status() === 'success' ? (
                                <div class="inline-success" role="status">
                                    {/* Ripple rings */}
                                    <div class="ripple-ring ring-1" />
                                    <div class="ripple-ring ring-2" />
                                    <div class="ripple-ring ring-3" />

                                    {/* Animated SVG checkmark */}
                                    <div class="success-icon-wrap">
                                        <svg class="success-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <circle class="success-circle" cx="50" cy="50" r="44" />
                                            <polyline class="success-check" points="26,52 42,68 74,34" />
                                        </svg>
                                    </div>

                                    <h2 class="success-title">Message Sent!</h2>
                                    <p class="success-subtitle">
                                        Thanks for reaching out.<br />I'll get back to you soon 🚀
                                    </p>

                                    <button class="success-close-btn" onClick={resetStatus}>
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                /* ── FORM STATE ── */
                                <form ref={formEl} onSubmit={handleSubmit} class="inner-form" aria-busy={status() === 'loading'}>
                                    <div class="form-group">
                                        <label for="user_name">Your Name</label>
                                        <input type="text" id="user_name" name="user_name" required maxlength={CONTACT_LIMITS.name} disabled={status() === 'loading'} placeholder="John Doe" />
                                    </div>

                                    <div class="form-group">
                                        <label for="user_email">Email Address</label>
                                        <input type="email" id="user_email" name="user_email" required maxlength={CONTACT_LIMITS.email} disabled={status() === 'loading'} placeholder="john@example.com" />
                                    </div>

                                    <div class="form-group">
                                        <label for="subject">Subject</label>
                                        <input type="text" id="subject" name="subject" required maxlength={CONTACT_LIMITS.subject} disabled={status() === 'loading'} placeholder="Project Inquiry" />
                                    </div>

                                    <div class="form-group">
                                        <label for="message">Message</label>
                                        <textarea id="message" name="message" rows={5} required maxlength={CONTACT_LIMITS.message} disabled={status() === 'loading'} placeholder="Tell me about your project..."></textarea>
                                    </div>

                                    {status() === 'error' && (
                                        <p class="form-feedback form-error" role="alert">
                                            <i class="fas fa-exclamation-circle"></i> {errorMsg()}
                                        </p>
                                    )}

                                    <button type="submit" class="contact-submit-btn" disabled={status() === 'loading'}>
                                        {status() === 'loading' ? (
                                            <>Sending… <i class="fas fa-spinner fa-spin"></i></>
                                        ) : (
                                            <>Send Message <i class="fas fa-envelope-open"></i></>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
