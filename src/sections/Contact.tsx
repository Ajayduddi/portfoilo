import { useRef } from 'react';
import { DATA } from '../data/portfolio';
import './Contact.css';

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current) return;

        // Get form data
        const formData = new FormData(formRef.current);
        const name = formData.get('user_name') as string;
        const email = formData.get('user_email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        // Create mailto link
        const mailtoBody = `Hi Ajay,

${message}

---
From: ${name}
Email: ${email}`;

        const mailtoLink = `mailto:${DATA.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

        // Open user's email client
        window.location.href = mailtoLink;
    };

    return (
        <section className="contact" id="contact">
            {/* Background glow */}
            <div className="contact-glow"></div>

            <div className="container">
                <div className="contact-wrapper">
                    {/* Left: Info */}
                    <div className="contact-info fade-in">
                        <span className="section-label">Get In Touch</span>
                        <h2 className="contact-title font-display">
                            Let's Build Something<br />
                            <span className="gradient-text">Amazing Together</span>
                        </h2>
                        <p className="contact-description">
                            I'm currently looking for new opportunities. Whether you have a project
                            in mind or just want to chat, feel free to reach out!
                        </p>

                        <div className="contact-details">
                            <a href={`mailto:${DATA.profile.email}`} className="contact-detail-item">
                                <i className="fas fa-envelope"></i>
                                <span>{DATA.profile.email}</span>
                            </a>
                            <a href={`tel:${DATA.profile.phone}`} className="contact-detail-item">
                                <i className="fas fa-phone"></i>
                                <span>{DATA.profile.phone}</span>
                            </a>
                            <div className="contact-detail-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{DATA.profile.location}</span>
                            </div>
                        </div>

                        <div className="contact-socials">
                            <a href={DATA.profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href={DATA.profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href={DATA.profile.socials.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode">
                                <i className="fas fa-code"></i>
                            </a>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="contact-form-wrapper fade-in">
                        <form ref={formRef} onSubmit={handleSubmit} className="contact-form glass-card">
                            <div className="form-group">
                                <label htmlFor="user_name">Your Name</label>
                                <input
                                    type="text"
                                    id="user_name"
                                    name="user_name"
                                    required
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="user_email">Email Address</label>
                                <input
                                    type="email"
                                    id="user_email"
                                    name="user_email"
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    placeholder="Project Inquiry"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    placeholder="Tell me about your project..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="contact-submit-btn"
                            >
                                Send Message
                                <i className="fas fa-envelope-open"></i>
                            </button>

                            {/* <p className="form-message info">
                                This will open your email client to send the message.
                            </p> */}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
