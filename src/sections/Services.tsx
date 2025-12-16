import React from 'react';
import { DATA } from '../data/portfolio';
import './Services.css';

// Helper to render icon (supports Font Awesome or custom images)
function ServiceIcon({ icon, title, color }: { icon: string; title: string; color: string }) {
    if (icon.startsWith('img:')) {
        const src = icon.replace('img:', '');
        return (
            <img
                src={src}
                alt={title}
                className="service-icon-img"
                style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
            />
        );
    }
    return <i className={icon} style={{ color }}></i>;
}

export default function Services() {
    return (
        <section className="services" id="services">
            <div className="container">
                <div className="section-header fade-in">
                    <span className="section-label">What I Offer</span>
                    <h2 className="section-title font-display">Services</h2>
                    <p className="section-subtitle">
                        I help businesses and startups bring their ideas to life with quality code and thoughtful design.
                    </p>
                </div>

                <div className="services-grid">
                    {DATA.services.map((service, index) => (
                        <div key={service.id} className="service-card glass-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="service-icon">
                                <ServiceIcon icon={service.icon} title={service.title} color={service.color} />
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <ul className="service-features">
                                {service.features.map((feature) => (
                                    <li key={feature}>
                                        <i className="fas fa-check"></i>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="services-cta fade-in">
                    <p>Have a project in mind?</p>
                    <a href="#contact" className="btn btn-primary">
                        Let's Discuss
                        <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    );
}
