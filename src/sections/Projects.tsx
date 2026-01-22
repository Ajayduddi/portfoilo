import React, { useState } from 'react';
import { DATA, Project } from '../data/portfolio';
import './Projects.css';

export default function Projects() {
    const [activeProject, setActiveProject] = useState<Project | null>(null);

    return (
        <section className="projects" id="projects">
            <div className="container">
                <div className="section-header fade-in">
                    <span className="section-label">Portfolio</span>
                    <h2 className="section-title font-display">My Works</h2>
                </div>

                <div className="projects-list">
                    {DATA.projects.map((project, index) => (
                        <article
                            key={project.id}
                            className={`project-spotlight fade-in ${index % 2 !== 0 ? 'reverse' : ''}`}
                            onClick={() => setActiveProject(project)}
                        >
                            <div className="project-image">
                                <img src={project.image} alt={project.title} loading="lazy" />
                                <div className="project-image-overlay" style={{ background: `linear-gradient(135deg, ${project.color}33, transparent)` }}></div>
                            </div>

                            <div className="project-content">
                                <span className="project-number">0{index + 1}</span>
                                <h3 className="project-title font-display gradient-text">{project.title}</h3>
                                <p className="project-description">{project.longDescription || project.description}</p>

                                <div className="project-tech">
                                    {project.tech.map(tech => (
                                        <span key={tech} className="tech-tag">{tech}</span>
                                    ))}
                                </div>

                                <div className="project-actions">
                                    <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary">
                                        View Project <i className="fas fa-external-link-alt"></i>
                                    </a>
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
                                            <i className="fab fa-github"></i> Source
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
