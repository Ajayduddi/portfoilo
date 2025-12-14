import React from 'react';
import { DATA } from '../data/portfolio';
import './Footer.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <p className="footer-copyright">
                        © {year} {DATA.profile.name}. Crafted with passion and precision.
                    </p>

                    <div className="footer-socials">
                        <a href={DATA.profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a href={DATA.profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href={DATA.profile.socials.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode">
                            <i className="fas fa-code"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
