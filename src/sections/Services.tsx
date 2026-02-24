import { For } from 'solid-js';
import { DATA } from '../data/portfolio';
import './Services.css';

function ServiceIcon(props: { icon: string; title: string; color: string }) {
    if (props.icon.startsWith('img:')) {
        const src = props.icon.replace('img:', '');
        return (
            <img
                src={src}
                alt={props.title}
                class="service-icon-img"
                style={{ filter: `drop-shadow(0 0 8px ${props.color}40)` }}
            />
        );
    }
    return <i class={props.icon} style={{ color: props.color }}></i>;
}

export default function Services() {
    return (
        <section class="services" id="services">
            <div class="container">
                <div class="section-header fade-in">
                    <span class="section-label">What I Offer</span>
                    <h2 class="section-title font-display">Services</h2>
                    <p class="section-subtitle">
                        I help businesses and startups bring their ideas to life with quality code and thoughtful design.
                    </p>
                </div>

                <div class="services-grid">
                    <For each={DATA.services}>{(service, index) => (
                        <div class="service-card glass-card fade-in" style={{ 'animation-delay': `${index() * 0.1}s` }}>
                            <div class="service-icon">
                                <ServiceIcon icon={service.icon} title={service.title} color={service.color} />
                            </div>
                            <h3 class="service-title">{service.title}</h3>
                            <p class="service-description">{service.description}</p>
                            <ul class="service-features">
                                <For each={service.features}>{(feature) => (
                                    <li>
                                        <i class="fas fa-check"></i>
                                        {feature}
                                    </li>
                                )}</For>
                            </ul>
                        </div>
                    )}</For>
                </div>

                <div class="services-cta fade-in">
                    <p>Have a project in mind?</p>
                    <a href="#contact" class="btn btn-primary">
                        Let's Discuss
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    );
}
