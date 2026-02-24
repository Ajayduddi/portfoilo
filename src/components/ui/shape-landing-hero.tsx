import { onMount, type JSX } from 'solid-js';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// ElegantShape — replaces <motion.div> entrance + float animations with GSAP
// ─────────────────────────────────────────────────────────────────────────────
function ElegantShape(props: {
    class?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    const delay = props.delay ?? 0;
    const width = props.width ?? 400;
    const height = props.height ?? 100;
    const rotate = props.rotate ?? 0;
    const gradient = props.gradient ?? 'from-white/[0.08]';

    let outerEl!: HTMLDivElement;
    let innerEl!: HTMLDivElement;

    onMount(() => {
        // Entrance animation (replaces framer-motion initial/animate)
        gsap.fromTo(
            outerEl,
            { opacity: 0, y: -150, rotate: rotate - 15 },
            {
                opacity: 1, y: 0, rotate,
                duration: 2.4, delay,
                ease: 'power3.out',
            }
        );

        // Continuous float loop (replaces framer-motion repeat: Infinity)
        gsap.to(innerEl, {
            y: 15,
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: delay + 2.4,
        });
    });

    return (
        <div ref={outerEl} class={cn('absolute', props.class)} style={{ opacity: '0' }}>
            <div ref={innerEl} style={{ width: `${width}px`, height: `${height}px` }} class="relative">
                <div
                    class={cn(
                        'absolute inset-0 rounded-full',
                        'bg-gradient-to-r to-transparent',
                        gradient,
                        'backdrop-blur-[2px] border-2 border-white/[0.15]',
                        'shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]',
                        'after:absolute after:inset-0 after:rounded-full',
                        'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]'
                    )}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroGeometric — replaces <motion.div fadeUpVariants> with GSAP onMount
// ─────────────────────────────────────────────────────────────────────────────
function HeroGeometric(props: {
    badge?: string;
    title1?: string;
    title2?: string;
    description?: string;
    children?: JSX.Element;
}) {
    let badgeEl!: HTMLDivElement;
    let titleEl!: HTMLDivElement;
    let descEl!: HTMLDivElement;
    let dotEl!: HTMLDivElement;

    onMount(() => {
        const tl = gsap.timeline();

        // Fade-up entrance for text blocks (replaces framer-motion fadeUpVariants)
        tl.fromTo(badgeEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power2.out' })
            .fromTo(titleEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.7')
            .fromTo(descEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.7');

        // Scroll-dot pulsing loop (replaces framer-motion animate y/opacity)
        gsap.to(dotEl, {
            y: 8, opacity: 1,
            duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
    });

    return (
        <div class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

            {/* Floating shapes */}
            <div class="absolute inset-0 overflow-hidden">
                <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-indigo-500/[0.15]" class="left-[-10%] md:left-[-5%] top-[15%] md:top-[10%]" />
                <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-rose-500/[0.15]" class="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]" />
                <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-violet-500/[0.15]" class="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]" />
                <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="from-amber-500/[0.15]" class="right-[15%] md:right-[20%] top-[10%] md:top-[5%]" />
                <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="from-cyan-500/[0.15]" class="left-[20%] md:left-[25%] top-[5%] md:top-[10%]" />
            </div>

            {/* Main content */}
            <div class="relative z-10 container mx-auto px-4 md:px-6">
                <div class="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div
                        ref={badgeEl}
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
                        style={{ opacity: '0' }}
                    >
                        {/* Inline circle icon (replaces lucide-react Circle) */}
                        <svg class="h-2 w-2 fill-rose-500/80" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" /></svg>
                        <span class="text-sm text-white/60 tracking-wide">{props.badge}</span>
                    </div>

                    {/* Titles */}
                    <div ref={titleEl} style={{ opacity: '0' }}>
                        <h1 class="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span class="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {props.title1}
                            </span>
                            <br />
                            <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                                {props.title2}
                            </span>
                        </h1>
                    </div>

                    {/* Description + children */}
                    <div ref={descEl} style={{ opacity: '0' }}>
                        <p class="text-lg sm:text-xl md:text-2xl text-zinc-300 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
                            {props.description}
                        </p>
                        {props.children}
                    </div>
                </div>
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

            {/* Scroll indicator */}
            <div class="absolute bottom-10 inset-x-0 w-full flex flex-col items-center justify-center gap-2 z-20 pointer-events-none fade-in visible">
                <span class="text-white/40 text-xs tracking-[0.2em] font-light uppercase">Scroll to explore</span>
                <div class="w-[26px] h-[42px] border border-white/20 rounded-full flex justify-center pt-2">
                    <div
                        ref={dotEl}
                        class="w-1 h-1.5 bg-indigo-500 rounded-full"
                        style={{ opacity: '0' }}
                    />
                </div>
            </div>
        </div>
    );
}

export { HeroGeometric };
