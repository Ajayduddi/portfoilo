import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { gsap } from 'gsap';
import { createMotionAnimation } from '../context/MotionContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** A failed URL is removed once; changing the source permits a fresh load. */
export default function ImageWithFallback(props: {
    src: string;
    alt: string;
    loading?: 'eager' | 'lazy';
    fallbackLabel?: string;
}) {
    const [failed, setFailed] = createSignal(false);
    let wrapper!: HTMLDivElement;
    let revealed = false;
    let reducedSeen = false;
    let observer: IntersectionObserver | undefined;
    onCleanup(() => { observer?.disconnect(); });
    createMotionAnimation(animate => {
        observer?.disconnect();
        if (!animate) {
            reducedSeen = true;
            observer = new IntersectionObserver(entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    revealed = true;
                    observer?.disconnect();
                }
            });
            observer.observe(wrapper);
            return () => observer?.disconnect();
        }
        const rect = wrapper.getBoundingClientRect();
        if (revealed || (reducedSeen && rect.top < innerHeight && rect.bottom > 0)) {
            revealed = true;
            return;
        }
        gsap.fromTo(wrapper, { opacity: 0.6, scale: 1.05 }, {
            opacity: 1, scale: 1, duration: 1, ease: 'power2.out', clearProps: 'opacity,transform',
            onStart: () => { revealed = true; },
            scrollTrigger: { trigger: wrapper, start: 'top 92%', once: true },
        });
    });
    createEffect(() => {
        props.src;
        setFailed(false);
    });
    return (
        <div ref={wrapper} class="image-reveal">
            <Show when={props.src && !failed()} fallback={
                <div class="image-placeholder" role="img" aria-label={`${props.alt}: ${props.fallbackLabel ?? 'Image unavailable'}`}>
                    <i class="far fa-image" aria-hidden="true" />
                    <span>{props.fallbackLabel ?? 'Image unavailable'}</span>
                </div>
            }>
                <img src={props.src} alt={props.alt} loading={props.loading ?? 'lazy'} referrerpolicy="no-referrer" onError={() => setFailed(true)} />
            </Show>
        </div>
    );
}
