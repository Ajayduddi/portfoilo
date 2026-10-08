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
// One observer per mounted App, reused across initial mount and API refresh.
// Adds `.visible` to .fade-in elements as they enter the viewport.
function createFadeObserver(): IntersectionObserver {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // animate once
                }
            });
        },
        { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );
    return observer;
}

/** Observe all .fade-in elements, immediately marking already-visible ones */
function observeAll(observer: IntersectionObserver | undefined) {
    if (!observer) return;
    document.querySelectorAll<HTMLElement>('.fade-in').forEach(el => {
        if (el.classList.contains('visible')) return; // already done
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
            el.classList.add('visible'); // in viewport — show now
        } else {
            observer.observe(el);  // below viewport — watch for scroll
        }
    });
}

// ─── API Refresher ────────────────────────────────────────────────────────────
// After the API data loads, SolidJS re-renders Projects/Experience DOM nodes.
// Re-observe all current .fade-in elements so the new nodes get revealed.
function AnimationRefresher(props: { refresh: () => void }) {
    const { loading } = usePortfolio();
    let didRefresh = false;

    createEffect(() => {
        if (!loading() && !didRefresh) {
            didRefresh = true;
            let firstFrame: number | undefined;
            let secondFrame: number | undefined;
            firstFrame = requestAnimationFrame(() => {
                firstFrame = undefined;
                secondFrame = requestAnimationFrame(() => {
                    secondFrame = undefined;
                    props.refresh();
                    ScrollTrigger.refresh();
                });
            });
            onCleanup(() => {
                if (firstFrame !== undefined) cancelAnimationFrame(firstFrame);
                if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
            });
        }
    });

    return <></>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
    let observer: IntersectionObserver | undefined;
    let firstFrame: number | undefined;
    let secondFrame: number | undefined;

    // Register cleanup synchronously with the component owner, not inside a frame callback.
    onCleanup(() => {
        if (firstFrame !== undefined) cancelAnimationFrame(firstFrame);
        if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
        observer?.disconnect();
    });

    onMount(() => {
        firstFrame = requestAnimationFrame(() => {
            firstFrame = undefined;
            secondFrame = requestAnimationFrame(() => {
                secondFrame = undefined;
                // Create the shared IntersectionObserver
                observer = createFadeObserver();
                observeAll(observer);
            });
        });
    });

    return (
        <PortfolioProvider>
            <AnimationRefresher refresh={() => observeAll(observer)} />
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
