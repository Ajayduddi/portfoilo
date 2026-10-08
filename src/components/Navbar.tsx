import { createSignal, createEffect, onMount, onCleanup, For } from 'solid-js';
import { DATA } from '../data/portfolio';
import './Navbar.css';

export default function Navbar() {
    const [scrolled, setScrolled] = createSignal(false);
    const [hidden, setHidden] = createSignal(false);
    let lastScroll = 0;
    const [menuOpen, setMenuOpen] = createSignal(false);
    let menuEl!: HTMLDivElement;
    let toggleEl!: HTMLButtonElement;

    createEffect(() => {
        if (!menuOpen()) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        // Wait until Solid has applied the open class before focusing a visible link.
        const focusFrame = requestAnimationFrame(() => {
            menuEl.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
        });
        onCleanup(() => {
            cancelAnimationFrame(focusFrame);
            document.body.style.overflow = previousOverflow;
        });
    });

    const toggleMenu = () => {
        setMenuOpen(open => !open);
    };

    onMount(() => {
        lastScroll = window.scrollY;
        setScrolled(lastScroll > 50);
        const handleScroll = () => {
            const current = window.scrollY;
            setScrolled(current > 50);
            if (current <= 100 || menuOpen() || current < lastScroll) setHidden(false);
            else if (current > lastScroll) setHidden(true);
            lastScroll = current;
        };
        const mobile = window.matchMedia('(max-width: 900px)');
        const handleBreakpoint = () => { if (!mobile.matches) setMenuOpen(false); };
        const handleKeydown = (event: KeyboardEvent) => {
            if (!menuOpen()) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                setMenuOpen(false);
                toggleEl.focus();
            } else if (event.key === 'Tab') {
                const firstLink = menuEl.querySelector<HTMLAnchorElement>('a');
                if (event.shiftKey && document.activeElement === firstLink) {
                    event.preventDefault();
                    toggleEl.focus();
                } else if (!event.shiftKey && document.activeElement === toggleEl) {
                    event.preventDefault();
                    firstLink?.focus();
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeydown);
        mobile.addEventListener('change', handleBreakpoint);
        onCleanup(() => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeydown);
            mobile.removeEventListener('change', handleBreakpoint);
        });
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
        <nav class="navbar" aria-label="Primary navigation" onFocusIn={() => setHidden(false)} classList={{ scrolled: scrolled(), 'navbar--hidden': hidden() && !menuOpen() }}>
            <div class="navbar-container">
                <a href="#hero" class="navbar-logo" aria-label={`${DATA.profile.name} home`}>
                    {DATA.profile.name.split(' ').map(n => n[0]).join('')}
                </a>

                <div ref={menuEl} id="primary-navigation" class={`navbar-links ${menuOpen() ? 'open' : ''}`}>
                    <For each={links}>{(link) => (
                        <a href={link.href} onClick={() => setMenuOpen(false)}>
                            {link.name}
                        </a>
                    )}</For>
                </div>

                <button
                    ref={toggleEl}
                    class={`navbar-toggle ${menuOpen() ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen()}
                    aria-controls="primary-navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
