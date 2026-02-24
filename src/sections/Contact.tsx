import { createSignal } from 'solid-js';
import { DATA } from '../data/portfolio';
import './Contact.css';

export default function Contact() {
    let formEl!: HTMLFormElement;
    const [status, setStatus] = createSignal<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = createSignal('');

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        const formData = new FormData(formEl);
        const name = formData.get('user_name') as string;
        const email = formData.get('user_email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        try {
            const res = await fetch('https://n8n.ajayduddi.site/webhook/portfolioEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            });

            if (!res.ok) throw new Error(`Server responded with ${res.status}`);

            setStatus('success');
            formEl.reset();

            // Auto-reset back to form after 4 seconds
            setTimeout(() => setStatus('idle'), 4000);
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <section class="contact" id="contact">
            <div class="contact-glow"></div>

            <div class="container">
                <div class="contact-wrapper">
                    {/* Left: Info */}
                    <div class="contact-info fade-in">
                        <span class="section-label">Get In Touch</span>
                        <h2 class="contact-title font-display">
                            Let's Build Something<br />
                            <span class="gradient-text">Amazing Together</span>
                        </h2>
                        <p class="contact-description">
                            Always ready to discuss innovative projects and architectural challenges.
                            Let's connect and explore how we can create exceptional value together.
                        </p>

                        <div class="contact-details">
                            <a href={`mailto:${DATA.profile.email}`} class="contact-detail-item">
                                <i class="fas fa-envelope"></i>
                                <span>{DATA.profile.email}</span>
                            </a>
                            <div class="contact-detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>{DATA.profile.location}</span>
                            </div>
                        </div>

                        <div class="contact-socials">
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
                                <div class="inline-success">
                                    {/* Ripple rings */}
                                    <div class="ripple-ring ring-1" />
                                    <div class="ripple-ring ring-2" />
                                    <div class="ripple-ring ring-3" />

                                    {/* Animated SVG checkmark */}
                                    <div class="success-icon-wrap">
                                        <svg class="success-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <circle class="success-circle" cx="50" cy="50" r="44" />
                                            <polyline class="success-check" points="26,52 42,68 74,34" />
                                        </svg>
                                    </div>

                                    <h2 class="success-title">Message Sent!</h2>
                                    <p class="success-subtitle">
                                        Thanks for reaching out.<br />I'll get back to you soon 🚀
                                    </p>

                                    <button class="success-close-btn" onClick={() => setStatus('idle')}>
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                /* ── FORM STATE ── */
                                <form ref={formEl} onSubmit={handleSubmit} class="inner-form">
                                    <div class="form-group">
                                        <label for="user_name">Your Name</label>
                                        <input type="text" id="user_name" name="user_name" required placeholder="John Doe" />
                                    </div>

                                    <div class="form-group">
                                        <label for="user_email">Email Address</label>
                                        <input type="email" id="user_email" name="user_email" required placeholder="john@example.com" />
                                    </div>

                                    <div class="form-group">
                                        <label for="subject">Subject</label>
                                        <input type="text" id="subject" name="subject" required placeholder="Project Inquiry" />
                                    </div>

                                    <div class="form-group">
                                        <label for="message">Message</label>
                                        <textarea id="message" name="message" rows={5} required placeholder="Tell me about your project..."></textarea>
                                    </div>

                                    {status() === 'error' && (
                                        <p class="form-feedback form-error">
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
