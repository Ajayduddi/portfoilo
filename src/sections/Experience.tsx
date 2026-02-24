import { createMemo, For, Show } from 'solid-js';
import { DATA } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import './Experience.css';

function parseDescription(raw: string): string[] {
    return raw
        .split('-,')
        .flatMap(chunk => chunk.split(/\n/))
        .map(s => s.replace(/^[-.,\s]+|[-.,\s]+$/g, '').trim())
        .filter(s => s.length > 2);
}

export default function Experience() {
    const { portfolioData } = usePortfolio();

    const items = createMemo(() => {
        const api = portfolioData();
        if (api?.experience && api.experience.length > 0) {
            return api.experience.map((item, i) => ({
                id: `exp-${i}`,
                role: item.role,
                company: item.company,
                duration: item.duration,
                description: parseDescription(item.description),
                type: item.type,
            }));
        }
        return [...DATA.experience].reverse();
    });

    return (
        <section class="experience" id="experience">
            <div class="container">
                <div class="section-header fade-in">
                    <span class="section-label">Journey</span>
                    <h2 class="section-title font-display">Experience &amp; Education</h2>
                </div>

                <div class="timeline">
                    <For each={items()}>{(item, index) => (
                        <div class="timeline-item fade-in">
                            <div class="timeline-marker">
                                <div class="timeline-dot" style={{ background: item.type === 'education' ? '#8b5cf6' : 'var(--accent)' }}></div>
                                <Show when={index() < items().length - 1}>
                                    <div class="timeline-line"></div>
                                </Show>
                            </div>

                            <div class="timeline-content glass-card">
                                <div class="timeline-header">
                                    <span class="timeline-duration">{item.duration}</span>
                                    <span class={`timeline-badge ${item.type}`}>
                                        {item.type === 'education' ? '🎓' : '💼'}
                                    </span>
                                </div>
                                <h3 class="timeline-role">{item.role}</h3>
                                <p class="timeline-company">{item.company}</p>
                                <ul class="timeline-details">
                                    <For each={item.description}>{(desc) => (
                                        <li>{desc}</li>
                                    )}</For>
                                </ul>
                            </div>
                        </div>
                    )}</For>
                </div>
            </div>
        </section>
    );
}
