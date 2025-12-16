import { DATA } from '../data/portfolio';
import './About.css';

export default function About() {
    return (
        <section className="about" id="about">
            <div className="container">
                <div className="about-grid">
                    {/* Left: Image */}
                    <div className="about-image fade-in">
                        <div className="about-image-wrapper">
                            <img src="/photo.jpg" alt={DATA.profile.name} />
                            <div className="about-image-overlay"></div>
                        </div>
                        <div className="about-image-badge glass-card">
                            <i className="fas fa-code"></i>
                            <span>Clean Code Advocate</span>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="about-content fade-in">
                        <span className="section-label">About Me</span>
                        <h2 className="about-title font-display">
                            Turning Ideas Into<br />
                            <span className="gradient-text">Digital Reality</span>
                        </h2>
                        <p className="about-bio">{DATA.profile.bio}</p>

                        {/* Stats */}
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">{DATA.profile.stats.studentsTrainted}</span>
                                <span className="stat-label">Students Trained</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{DATA.profile.stats.projects}</span>
                                <span className="stat-label">Projects Built</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{DATA.profile.stats.technologies}</span>
                                <span className="stat-label">Technologies</span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="about-contact">
                            <a href={`mailto:${DATA.profile.email}`} className="contact-link">
                                <i className="fas fa-envelope"></i>
                                <span>{DATA.profile.email}</span>
                            </a>
                            <div className="contact-link">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{DATA.profile.location}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="about-socials">
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
                </div>
            </div>
        </section>
    );
}
