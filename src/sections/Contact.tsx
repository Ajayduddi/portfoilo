import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { DATA } from '../data/portfolio';
import './Contact.css';

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current) return;

        setStatus('sending');

        try {
            // EmailJS credentials - User needs to set these in their .env file
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (!serviceId || !templateId || !publicKey) {
                console.error('EmailJS credentials not configured. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.');
                setStatus('error');
                return;
            }

            await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);

            setStatus('success');
            formRef.current.reset();

            // Reset status after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('EmailJS error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
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
                                disabled={status === 'sending'}
                            >
                                {status === 'idle' && (
                                    <>
                                        Send Message
                                        <i className="fas fa-paper-plane"></i>
                                    </>
                                )}
                                {status === 'sending' && (
                                    <>
                                        Sending...
                                        <i className="fas fa-spinner fa-spin"></i>
                                    </>
                                )}
                                {status === 'success' && (
                                    <>
                                        Message Sent!
                                        <i className="fas fa-check"></i>
                                    </>
                                )}
                                {status === 'error' && (
                                    <>
                                        Failed to Send
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </>
                                )}
                            </button>

                            {status === 'success' && (
                                <p className="form-message success">
                                    Thanks for reaching out! I'll get back to you soon.
                                </p>
                            )}
                            {status === 'error' && (
                                <p className="form-message error">
                                    Something went wrong. Please try again or email me directly.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
