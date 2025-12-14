import React from 'react';
import { DATA } from '../data/portfolio';
import './Skills.css';

export default function Skills() {
    const categories = [
        { key: 'frontend', label: 'Frontend' },
        { key: 'backend', label: 'Backend' },
        { key: 'languages', label: 'Languages' },
        { key: 'tools', label: 'Tools' }
    ];

    return (
        <section className="skills" id="skills">
            <div className="container">
                <div className="section-header fade-in">
                    <span className="section-label">Expertise</span>
                    <h2 className="section-title font-display">Skills & Technologies</h2>
                </div>

                {/* Skill Categories */}
                <div className="skills-grid fade-in">
                    {categories.map(cat => {
                        const skills = DATA.skills.filter(s => s.category === cat.key);
                        return (
                            <div key={cat.key} className="skill-category">
                                <h3 className="skill-category-title">{cat.label}</h3>
                                <div className="skill-list">
                                    {skills.map(skill => (
                                        <div key={skill.name} className="skill-item glass-card">
                                            <i className={skill.icon}></i>
                                            <span>{skill.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Marquee */}
                <div className="skills-marquee fade-in">
                    <div className="marquee-track">
                        {[...DATA.skills, ...DATA.skills].map((skill, index) => (
                            <span key={`${skill.name}-${index}`} className="marquee-item">
                                <i className={skill.icon}></i>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
