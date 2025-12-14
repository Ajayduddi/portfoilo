import { DATA } from '../data/portfolio';
import './Skills.css';

// Helper to render icon (supports Font Awesome or custom images)
function SkillIcon({ icon, name }: { icon: string; name: string }) {
    if (icon.startsWith('img:')) {
        const src = icon.replace('img:', '');
        return <img src={src} alt={name} className="skill-icon-img" />;
    }
    return <i className={icon}></i>;
}

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
                                            <SkillIcon icon={skill.icon} name={skill.name} />
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
                                <SkillIcon icon={skill.icon} name={skill.name} />
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
