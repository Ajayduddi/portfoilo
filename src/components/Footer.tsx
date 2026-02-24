import { DATA } from '../data/portfolio';
import './Footer.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <p class="footer-copyright">
                        © {year} {DATA.profile.name}. Crafted with passion and precision.
                    </p>

                    <div class="footer-socials">
                        <a href={DATA.profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href={DATA.profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href={DATA.profile.socials.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode">
                            <i class="fas fa-code"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
