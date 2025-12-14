import React from 'react';
import { DATA } from '../data/portfolio';
import './Experience.css';

export default function Experience() {
    return (
        <section className="experience" id="experience">
            <div className="container">
                <div className="section-header fade-in">
                    <span className="section-label">Journey</span>
                    <h2 className="section-title font-display">Experience & Education</h2>
                </div>

                <div className="timeline">
                    {DATA.experience.map((item, index) => (
                        <div key={item.id} className="timeline-item fade-in">
                            <div className="timeline-marker">
                                <div className="timeline-dot" style={{ background: item.type === 'education' ? '#8b5cf6' : 'var(--accent)' }}></div>
                                {index < DATA.experience.length - 1 && <div className="timeline-line"></div>}
                            </div>

                            <div className="timeline-content glass-card">
                                <div className="timeline-header">
                                    <span className="timeline-duration">{item.duration}</span>
                                    <span className={`timeline-badge ${item.type}`}>
                                        {item.type === 'education' ? '🎓' : '💼'}
                                    </span>
                                </div>
                                <h3 className="timeline-role">{item.role}</h3>
                                <p className="timeline-company">{item.company}</p>
                                <ul className="timeline-details">
                                    {item.description.map((desc, i) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
