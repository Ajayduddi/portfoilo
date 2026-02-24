import { createMemo } from 'solid-js';
import { DATA } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import './About.css';

export default function About() {
    const { portfolioData } = usePortfolio();

    const getStatValue = (name: string, fallback: string) => {
        const entry = portfolioData()?.stats?.find(
            s => s.Name.trim().toLowerCase() === name.toLowerCase()
        );
        return entry?.value ?? fallback;
    };

    const studentsTrained = createMemo(() => getStatValue('studentsTrained', DATA.profile.stats.studentsTrainted));
    const projects = createMemo(() => getStatValue('projects', DATA.profile.stats.projects));
    const technologies = createMemo(() => getStatValue('technologies', DATA.profile.stats.technologies));
    const photoSrc = createMemo(() => portfolioData()?.profile?.image ?? '/photo.jpg');

    return (
        <section class="about" id="about" style={{ 'padding-top': '60px' }}>
            <div class="container">
                <div class="about-grid">
                    {/* Left: Image */}
                    <div class="about-image fade-in">
                        <div class="about-image-wrapper">
                            <img
                                src={photoSrc()}
                                alt={DATA.profile.name}
                                referrerpolicy="no-referrer"
                                onError={(e) => {
                                    const el = e.currentTarget as HTMLImageElement;
                                    if (!el.src.endsWith('/photo.jpg')) el.src = '/photo.jpg';
                                }}
                            />
                            <div class="about-image-overlay"></div>
                        </div>
                        <div class="about-image-badge glass-card">
                            <i class="fas fa-code"></i>
                            <span>Clean Code Advocate</span>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div class="about-content fade-in">
                        <span class="section-label">About Me</span>
                        <h2 class="about-title font-display">
                            Turning Ideas Into<br />
                            <span class="gradient-text">Digital Reality</span>
                        </h2>
                        <p class="about-bio">{DATA.profile.bio}</p>

                        {/* Stats */}
                        <div class="about-stats">
                            <div class="stat-item">
                                <span class="stat-number">{studentsTrained()}</span>
                                <span class="stat-label">Students Trained</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">{projects()}</span>
                                <span class="stat-label">Projects Built</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">{technologies()}</span>
                                <span class="stat-label">Technologies</span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div class="about-contact">
                            <a href={`mailto:${DATA.profile.email}`} class="contact-link">
                                <i class="fas fa-envelope"></i>
                                <span>{DATA.profile.email}</span>
                            </a>
                            <div class="contact-link">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>{DATA.profile.location}</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div class="about-socials">
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
                </div>
            </div>
        </section>
    );
}
