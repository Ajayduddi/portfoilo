import { createMemo, For, Show } from 'solid-js';
import type { Project } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import ImageWithFallback from '../components/ImageWithFallback';
import { safeAccentColor, safeExternalUrl, safeImageUrl } from '../lib/urls';
import './Projects.css';

/** The file-storage server that hosts portfolio images */
const RUSTFS_BASE = 'https://rustfs-api.ajayduddi.site';

export default function Projects() {
    const { portfolioData } = usePortfolio();

    const projects = createMemo<Project[]>(() =>
        (portfolioData()?.projects ?? []).map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            longDescription: p.longDescription,
            tech: p.tech,
            image: safeImageUrl(p.image, RUSTFS_BASE),
            link: safeExternalUrl(p.link),
            github: safeExternalUrl(p.github) || undefined,
            color: safeAccentColor(p.color),
        }))
    );

    return (
        <section class="projects" id="projects">
            <div class="container">
                <div class="section-header fade-in">
                    <span class="section-label">Portfolio</span>
                    <h2 class="section-title font-display">My <span class="gradient-text">Works</span></h2>
                </div>

                <div class="projects-list">
                    <For each={projects()}>{(project, index) => (
                        <article class={`project-spotlight fade-in ${index() % 2 !== 0 ? 'reverse' : ''}`}>
                            <div class="project-image">
                                <ImageWithFallback
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                />
                                <div class="project-image-overlay" style={{ background: `linear-gradient(135deg, ${project.color}33, transparent)` }}></div>
                            </div>

                            <div class="project-content">
                                <span class="project-number fade-in">{String(index() + 1).padStart(2, '0')}</span>
                                <h3 class="project-title font-display gradient-text fade-in stagger-1">{project.title}</h3>
                                <p class="project-description fade-in stagger-2">{project.longDescription || project.description}</p>

                                <div class="project-tech fade-in stagger-2">
                                    <For each={project.tech}>{(tech) => (
                                        <span class="tech-tag">{tech}</span>
                                    )}</For>
                                </div>

                                <div class="project-actions fade-in stagger-3">
                                    <Show when={project.link && project.link !== '#'}>
                                        <a href={project.link} target="_blank" rel="noreferrer" class="btn btn-primary">
                                            View Project <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </Show>
                                    <Show when={project.github}>
                                        <a href={project.github} target="_blank" rel="noreferrer" class="btn btn-secondary">
                                            <i class="fab fa-github"></i> Source
                                        </a>
                                    </Show>
                                </div>
                            </div>
                        </article>
                    )}</For>
                </div>
            </div>
        </section>
    );
}
