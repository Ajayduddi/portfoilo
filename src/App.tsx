import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
    useEffect(() => {
        // Enhanced fade-in animations with stagger
        const fadeElements = document.querySelectorAll('.fade-in');

        fadeElements.forEach((el) => {
            gsap.fromTo(el,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.98
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        end: 'top 20%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Parallax effect for section backgrounds
        gsap.utils.toArray<HTMLElement>('.parallax-bg').forEach((bg) => {
            gsap.to(bg, {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });

        // Smooth reveal for images
        gsap.utils.toArray<HTMLImageElement>('img').forEach((img) => {
            gsap.fromTo(img,
                { opacity: 0.5, scale: 1.1 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: img,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Animate section headers
        gsap.utils.toArray<HTMLElement>('.section-header').forEach((header) => {
            const label = header.querySelector('.section-label');
            const title = header.querySelector('.section-title');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%'
                }
            });

            if (label) {
                tl.fromTo(label,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6 }
                );
            }
            if (title) {
                tl.fromTo(title,
                    { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' },
                    { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8 },
                    '-=0.3'
                );
            }
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

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            window.removeEventListener('scroll', handleNavScroll);
        };
    }, []);

    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Services />
                <Projects />
                <Skills />
                <Experience />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

export default App;
