import { For } from 'solid-js';
import { DATA } from '../data/portfolio';
import './Skills.css';

function SkillIcon(props: { icon: string; name: string }) {
    if (props.icon.startsWith('img:')) {
        const src = props.icon.replace('img:', '');
        return <img src={src} alt={props.name} class="skill-icon-img" />;
    }
    return <i class={props.icon}></i>;
}

export default function Skills() {
    const categories = [
        { key: 'frontend', label: 'Frontend' },
        { key: 'backend', label: 'Backend' },
        { key: 'languages', label: 'Languages' },
        { key: 'tools', label: 'Tools' }
    ];

    return (
        <section class="skills" id="skills">
            <div class="container">
                <div class="section-header fade-in">
                    <span class="section-label">Expertise</span>
                    <h2 class="section-title font-display">Skills &amp; Technologies</h2>
                </div>

                <div class="skills-grid fade-in">
                    <For each={categories}>{(cat) => {
                        const skills = DATA.skills.filter(s => s.category === cat.key);
                        return (
                            <div class="skill-category">
                                <h3 class="skill-category-title">{cat.label}</h3>
                                <div class="skill-list">
                                    <For each={skills}>{(skill) => (
                                        <div class="skill-item glass-card">
                                            <SkillIcon icon={skill.icon} name={skill.name} />
                                            <span>{skill.name}</span>
                                        </div>
                                    )}</For>
                                </div>
                            </div>
                        );
                    }}</For>
                </div>

                <div class="skills-marquee fade-in">
                    <div class="marquee-track">
                        <For each={[...DATA.skills, ...DATA.skills]}>{(skill, index) => (
                            <span class="marquee-item" data-index={index()}>
                                <SkillIcon icon={skill.icon} name={skill.name} />
                                {skill.name}
                            </span>
                        )}</For>
                    </div>
                </div>
            </div>
        </section>
    );
}
