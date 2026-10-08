import { createEffect, onCleanup, onMount, type Accessor, type JSX } from 'solid-js';
import { gsap } from 'gsap';

/** The portfolio always enables motion, independently of system or saved preferences. */
export function MotionProvider(props: { children: JSX.Element }) {
    const previous = document.documentElement.getAttribute('data-motion');
    document.documentElement.dataset.motion = 'on';
    onCleanup(() => {
        if (previous === null) document.documentElement.removeAttribute('data-motion');
        else document.documentElement.setAttribute('data-motion', previous);
    });
    return props.children;
}

/** Start a scoped animation after its elements mount and clean it up on unmount. */
export function createMotionAnimation(setup: (enabled: boolean) => void | (() => void), ready: Accessor<boolean> = () => true) {
    onMount(() => {
        createEffect(() => {
            if (!ready()) return;
            let context: gsap.Context | undefined;
            const frame = requestAnimationFrame(() => {
                context = gsap.context(() => setup(true));
            });
            onCleanup(() => {
                cancelAnimationFrame(frame);
                context?.revert();
            });
        });
    });
}
