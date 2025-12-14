import React, { useState, useEffect } from 'react';
import { DATA } from '../data/portfolio';
import './Navbar.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Works', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <a href="#" className="navbar-logo">
                    {DATA.profile.name.split(' ').map(n => n[0]).join('')}
                </a>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {links.map(link => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <button
                    className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
