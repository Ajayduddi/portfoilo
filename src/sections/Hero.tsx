import { DATA } from '../data/portfolio';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

export default function Hero() {
    return (
        <section id="hero" style={{ padding: '0' }}>
            <HeroGeometric
                badge={DATA.profile.title}
                title1={DATA.profile.name}
                title2="Building Future Tech"
                description="Architecting scalable web ecosystems and mentoring the next generation of developers. Empowering 1K+ students to master full-stack excellence."
            >
                <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <a
                        href="#projects"
                        class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
                    >
                        View My Work
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                    <a
                        href="#contact"
                        class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
                    >
                        Get In Touch
                    </a>
                </div>
            </HeroGeometric>
        </section>
    );
}
