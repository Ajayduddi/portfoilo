import { onMount, onCleanup, createEffect } from 'solid-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import CodingProfile from './sections/CodingProfile';
import Contact from './sections/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

// ─── Shared IntersectionObserver ──────────────────────────────────────────────
// Single observer instance reused across initial mount and API refresh.
// Adds `.visible` to .fade-in elements as they enter the viewport.
let fadeObserver: IntersectionObserver | null = null;

function createFadeObserver(): IntersectionObserver {
    return new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver?.unobserve(entry.target); // animate once
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
}

/** Observe all .fade-in elements, immediately marking already-visible ones */
function observeAll() {
    if (!fadeObserver) return;
    document.querySelectorAll<HTMLElement>('.fade-in').forEach(el => {
        if (el.classList.contains('visible')) return; // already done
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
            el.classList.add('visible'); // in viewport — show now
        } else {
            fadeObserver!.observe(el);  // below viewport — watch for scroll
        }
    });
}

// ─── API Refresher ────────────────────────────────────────────────────────────
// After the API data loads, SolidJS re-renders Projects/Experience DOM nodes.
// Re-observe all current .fade-in elements so the new nodes get revealed.
function AnimationRefresher() {
    const { loading } = usePortfolio();
    let didRefresh = false;

    createEffect(() => {
        if (!loading() && !didRefresh) {
            didRefresh = true;
            // Small delay to let SolidJS flush new DOM nodes
            const timer = setTimeout(() => {
                observeAll();

                // Ensure all images currently visible are fully opaque
                document.querySelectorAll<HTMLImageElement>('img').forEach(img => {
                    const rect = img.getBoundingClientRect();
                    if (rect.top < window.innerHeight) {
                        gsap.set(img, { opacity: 1, scale: 1, overwrite: true });
                    }
                });

                ScrollTrigger.refresh();
            }, 150);
            onCleanup(() => clearTimeout(timer));
        }
    });

    return <></>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
    onMount(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => {
            // Create the shared IntersectionObserver
            fadeObserver = createFadeObserver();
            observeAll();

            // Smooth reveal for images via GSAP ScrollTrigger
            gsap.utils.toArray<HTMLImageElement>('img').forEach((img) => {
                gsap.fromTo(img,
                    { opacity: 0.6, scale: 1.05 },
                    {
                        opacity: 1, scale: 1, duration: 1, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top 92%',
                            toggleActions: 'play none none none',
                        }
                    }
                );
            });

            // Parallax effect for section backgrounds
            gsap.utils.toArray<HTMLElement>('.parallax-bg').forEach((bg) => {
                gsap.to(bg, {
                    yPercent: -20, ease: 'none',
                    scrollTrigger: {
                        trigger: bg.parentElement,
                        start: 'top bottom', end: 'bottom top', scrub: 1
                    }
                });
            });

            // Navbar hide/show on scroll
            let lastScroll = 0;
            const navbar = document.querySelector('.navbar');

            const handleNavScroll = () => {
                const currentScroll = window.scrollY;
                if (navbar) {
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        navbar.classList.add('hidden');
                    } else {
                        navbar.classList.remove('hidden');
                    }
                }
                lastScroll = currentScroll;
            };

            window.addEventListener('scroll', handleNavScroll, { passive: true });

            onCleanup(() => {
                ScrollTrigger.getAll().forEach(t => t.kill());
                fadeObserver?.disconnect();
                fadeObserver = null;
                window.removeEventListener('scroll', handleNavScroll);
            });
        }));
    });

    return (
        <PortfolioProvider>
            <AnimationRefresher />
            <Navbar />
            <main>
                <Hero />
                <About />
                <Services />
                <Projects />
                <Skills />
                <CodingProfile />
                <Experience />
                <Contact />
            </main>
            <Footer />
        </PortfolioProvider>
    );
}

export default App;
