import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { DATA } from '../data/portfolio';
import './Navbar.css';

export default function Navbar() {
    const [scrolled, setScrolled] = createSignal(false);
    const [menuOpen, setMenuOpen] = createSignal(false);

    onMount(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        onCleanup(() => window.removeEventListener('scroll', handleScroll));
    });

    const links = [
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Works', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Experience', href: '#experience' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <nav class={`navbar ${scrolled() ? 'scrolled' : ''}`}>
            <div class="navbar-container">
                <a href="#" class="navbar-logo">
                    {DATA.profile.name.split(' ').map(n => n[0]).join('')}
                </a>

                <div class={`navbar-links ${menuOpen() ? 'open' : ''}`}>
                    <For each={links}>{(link) => (
                        <a href={link.href} onClick={() => setMenuOpen(false)}>
                            {link.name}
                        </a>
                    )}</For>
                </div>

                <button
                    class={`navbar-toggle ${menuOpen() ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen())}
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
