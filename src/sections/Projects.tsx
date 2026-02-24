import { createMemo, For, Show } from 'solid-js';
import { DATA, type Project } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import './Projects.css';

/** The file-storage server that hosts portfolio images */
const RUSTFS_BASE = 'https://rustfs-api.ajayduddi.site';

/**
 * Resolve an image URL from the API:
 *  - Absolute URLs (http/https) → returned as-is
 *  - Relative paths             → prepended with RUSTFS_BASE
 *  - Strips accidental surrounding quotes
 */
function resolveImage(url: string | undefined): string {
    const clean = (url ?? '').replace(/^['"`]+|['"`]+$/g, '').trim();
    if (!clean) return '';
    if (/^https?:\/\/|^data:/.test(clean)) return clean;
    return `${RUSTFS_BASE}${clean.startsWith('/') ? '' : '/'}${clean}`;
}

function sanitizeUrl(url: string | undefined): string {
    return (url ?? '').replace(/^['"`]+|['"`]+$/g, '').trim();
}

/**
 * TRUE local fallbacks — absolute paths served from /public/.
 * These never change regardless of what DATA.projects contains,
 * so onerror never creates an infinite loop.
 */
const LOCAL_FALLBACKS: Record<string, string> = {
    'sms-gpt': '/smsgpt.jpg',
    'coding-club': '/pu.codingclub.space.png',
    'pu-code-hackathon': '/pucodehackathon.jpg',
};

export default function Projects() {
    const { portfolioData } = usePortfolio();

    const projects = createMemo<Project[]>(() => {
        const api = portfolioData();
        if (api?.projects && api.projects.length > 0) {
            return api.projects.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                longDescription: p.longDescription,
                tech: p.tech,
                // resolve image: absolute URL passes through, relative gets RUSTFS_BASE prepended
                image: resolveImage(p.image) || LOCAL_FALLBACKS[p.id] || '',
                link: sanitizeUrl(p.link) || '#',
                github: p.github ? sanitizeUrl(p.github) : undefined,
                color: p.color,
            }));
        }
        return DATA.projects;
    });

    return (
        <section class="projects" id="projects">
            <div class="container">
                <div class="section-header fade-in">
                    <span class="section-label">Portfolio</span>
                    <h2 class="section-title font-display">My Works</h2>
                </div>

                <div class="projects-list">
                    <For each={projects()}>{(project, index) => (
                        <article class={`project-spotlight fade-in ${index() % 2 !== 0 ? 'reverse' : ''}`}>
                            <div class="project-image">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                    referrerpolicy="no-referrer"
                                    onError={(e) => {
                                        const el = e.currentTarget as HTMLImageElement;
                                        const fallback = LOCAL_FALLBACKS[project.id];
                                        // Only swap if we haven't already tried the local fallback
                                        if (fallback && el.src !== `${window.location.origin}${fallback}`) {
                                            el.src = fallback;
                                        }
                                    }}
                                />
                                <div class="project-image-overlay" style={{ background: `linear-gradient(135deg, ${project.color}33, transparent)` }}></div>
                            </div>

                            <div class="project-content">
                                <span class="project-number">0{index() + 1}</span>
                                <h3 class="project-title font-display gradient-text">{project.title}</h3>
                                <p class="project-description">{project.longDescription || project.description}</p>

                                <div class="project-tech">
                                    <For each={project.tech}>{(tech) => (
                                        <span class="tech-tag">{tech}</span>
                                    )}</For>
                                </div>

                                <div class="project-actions">
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
