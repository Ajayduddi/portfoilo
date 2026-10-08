import { createMemo } from 'solid-js';
import { DATA } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import ImageWithFallback from '../components/ImageWithFallback';
import { safeImageUrl } from '../lib/urls';
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
    const bio = createMemo(() => portfolioData()?.profile?.bio?.trim() || DATA.profile.bio);
    const photoSrc = createMemo(() => safeImageUrl(portfolioData()?.profile?.image));

    return (
        <section class="about" id="about" style={{ 'padding-top': '60px' }}>
            <div class="container">
                <div class="about-grid">
                    {/* Left: Image */}
                    <div class="about-image fade-in">
                        <div class="about-image-wrapper">
                            <ImageWithFallback
                                src={photoSrc()}
                                alt={DATA.profile.name}
                                loading="eager"
                                fallbackLabel="Photo unavailable"
                            />
                            <div class="about-image-overlay"></div>
                        </div>
                        <div class="about-image-badge glass-card">
                            <i class="fas fa-code"></i>
                            <span>Clean Code Advocate</span>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div class="about-content">
                        <div class="fade-in">
                            <span class="section-label">About Me</span>
                            <h2 class="about-title section-title font-display">
                                Turning Ideas Into<br />
                                <span class="gradient-text">Digital Reality</span>
                            </h2>
                        </div>
                        <p class="about-bio section-description fade-in stagger-1">{bio()}</p>

                        {/* Stats */}
                        <div class="about-stats">
                            <div class="stat-item fade-in stagger-1">
                                <span class="stat-number">{studentsTrained()}</span>
                                <span class="stat-label">Students Trained</span>
                            </div>
                            <div class="stat-item fade-in stagger-2">
                                <span class="stat-number">{projects()}</span>
                                <span class="stat-label">Projects Built</span>
                            </div>
                            <div class="stat-item fade-in stagger-3">
                                <span class="stat-number">{technologies()}</span>
                                <span class="stat-label">Technologies</span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div class="about-contact fade-in stagger-2">
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
                        <div class="about-socials fade-in stagger-3">
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
