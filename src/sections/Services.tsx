import React from 'react';
import './Services.css';

const services = [
    {
        id: 'websites',
        icon: 'fas fa-globe',
        title: 'Website Development',
        description: 'Custom, responsive websites built with modern technologies. From landing pages to complex multi-page sites, designed for performance and user experience.',
        features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Modern UI/UX']
    },
    {
        id: 'webapps',
        icon: 'fas fa-laptop-code',
        title: 'Web Applications',
        description: 'Full-stack web applications tailored to your business needs. Scalable, secure, and built with the latest frameworks and best practices.',
        features: ['React / Angular', 'Node.js / Laravel', 'Database Design', 'Authentication']
    },
    {
        id: 'api',
        icon: 'fas fa-server',
        title: 'API Development',
        description: 'RESTful APIs and backend services that power your applications. Clean, documented, and built for reliability and scalability.',
        features: ['RESTful Design', 'Documentation', 'Security', 'Performance']
    }
];

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
                    {services.map((service, index) => (
                        <div key={service.id} className="service-card glass-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="service-icon">
                                <i className={service.icon}></i>
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
