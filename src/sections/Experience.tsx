import { createMemo, createEffect, createSignal, onMount, onCleanup, For, Show } from 'solid-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolio } from '../context/PortfolioContext';
import { safeImageUrl } from '../lib/urls';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceEntry {
    role: string;
    company: string;
    duration: string;
    description: string[];
    type: 'work' | 'education';
    logo: string;
}

function CompanyLogo(props: { company: string; url: string; onSizeChange: () => void }) {
    const [failed, setFailed] = createSignal(false);
    const [aspectRatio, setAspectRatio] = createSignal<number>();
    let image: HTMLImageElement | undefined;

    const measureImage = (img: HTMLImageElement) => {
        if (img.getAttribute('src') !== props.url || !img.naturalWidth || !img.naturalHeight) return;
        setAspectRatio(img.naturalWidth / img.naturalHeight);
        props.onSizeChange();
    };

    createEffect(() => {
        const url = props.url;
        setFailed(false);
        setAspectRatio(undefined);
        props.onSizeChange();
        // Cached images can finish loading before an event handler is attached.
        if (image?.complete && image.getAttribute('src') === url) measureImage(image);
    });
    const isSquare = () => {
        const ratio = aspectRatio();
        return ratio !== undefined && ratio >= 0.8 && ratio <= 1.2;
    };
    const initials = () => props.company.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase() || '—';

    return (
        <div
            class="exp-logo"
            classList={{
                'exp-logo--loaded': aspectRatio() !== undefined,
                'exp-logo--square': isSquare(),
                'exp-logo--initials': !props.url || failed(),
            }}
            style={{ '--exp-logo-ratio': aspectRatio()?.toString() }}
            aria-hidden="true"
        >
            <Show when={props.url && !failed()} fallback={<span>{initials()}</span>}>
                <img
                    ref={image}
                    src={props.url}
                    alt=""
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    onLoad={event => measureImage(event.currentTarget)}
                    onError={() => {
                        setFailed(true);
                        setAspectRatio(undefined);
                        props.onSizeChange();
                    }}
                />
            </Show>
        </div>
    );
}

function ExperienceEntries(props: { items: ExperienceEntry[] }) {
    let refreshFrame: number | undefined;
    let disposed = false;

    const refreshLayout = () => {
        if (disposed || refreshFrame !== undefined) return;
        refreshFrame = requestAnimationFrame(() => {
            refreshFrame = undefined;
            if (!disposed) ScrollTrigger.refresh();
        });
    };

    onCleanup(() => {
        disposed = true;
        if (refreshFrame !== undefined) cancelAnimationFrame(refreshFrame);
    });

    onMount(() => {
        refreshLayout();
        void document.fonts.ready.then(() => {
            if (!disposed) refreshLayout();
        });
    });

    return (
        <div class="exp-list">
            <For each={props.items}>{(item, index) => (
                <article class="exp-entry fade-in" aria-labelledby={`experience-company-${index()}`}>
                    <div class="exp-card glass-card">
                        <div class="exp-card-header">
                            <CompanyLogo company={item.company} url={item.logo} onSizeChange={refreshLayout} />
                            <h3 class="exp-company" id={`experience-company-${index()}`}>{item.company}</h3>
                            <span class="exp-badge exp-type-badge">
                                <i class={item.type === 'education' ? 'fas fa-graduation-cap' : 'fas fa-briefcase'} aria-hidden="true" />
                                {item.type === 'education' ? 'Education' : 'Work'}
                            </span>
                        </div>

                        <div class="exp-body">
                            <div class="exp-overview">
                                <div class="exp-tenure">
                                    <p class="exp-duration">
                                        <i class="far fa-calendar-alt" aria-hidden="true" />
                                        <span>{item.duration}</span>
                                    </p>
                                </div>

                                <dl class="exp-facts">
                                    <div class="exp-fact" classList={{ 'exp-fact--work': item.type === 'work' }}>
                                        <dt>{item.type === 'education' ? 'Qualification' : 'Position'}</dt>
                                        <dd class="exp-position">{item.role}</dd>
                                    </div>
                                </dl>
                            </div>

                            <Show when={item.description.length > 0}>
                                <div class="exp-description">
                                    <h4 class="exp-content-label">Overview</h4>
                                    <For each={item.description}>{paragraph => <p>{paragraph}</p>}</For>
                                </div>
                            </Show>
                        </div>
                    </div>
                </article>
            )}</For>
        </div>
    );
}

function ExperienceLoading() {
    return (
        <div class="exp-loading" role="status">
            <span class="exp-status-label">Loading experience…</span>
            <div class="exp-list" aria-hidden="true">
                <For each={[0, 1]}>{() => (
                    <div class="exp-card exp-skeleton glass-card">
                        <div class="exp-card-header">
                            <span class="exp-skeleton-bar exp-skeleton-logo" />
                            <span class="exp-skeleton-bar exp-skeleton-title" />
                            <span class="exp-skeleton-bar exp-skeleton-type exp-type-badge" />
                        </div>
                        <div class="exp-body">
                            <div class="exp-overview">
                                <div class="exp-tenure"><span class="exp-skeleton-bar" /></div>
                                <div class="exp-skeleton-group"><span class="exp-skeleton-bar" /></div>
                            </div>
                            <div class="exp-description exp-skeleton-group"><span class="exp-skeleton-bar" /><span class="exp-skeleton-bar" /><span class="exp-skeleton-bar" /></div>
                        </div>
                    </div>
                )}</For>
            </div>
        </div>
    );
}

export default function Experience() {
    const { portfolioData, loading } = usePortfolio();
    const items = createMemo<ExperienceEntry[]>(() => (portfolioData()?.experience ?? []).map(item => ({
        role: item.role,
        company: item.company,
        duration: item.duration,
        description: (item.description ?? '').split(/-,|\r?\n/).map(text => text.trim()).filter(Boolean),
        type: item.type,
        logo: safeImageUrl(item['Company Logo']),
    })));

    return (
        <section class="experience" id="experience" aria-labelledby="experience-title" aria-busy={loading()}>
            <div class="container">
                <div class="section-header fade-in">
                    <span class="section-label">Journey</span>
                    <h2 class="section-title font-display" id="experience-title">Experience &amp; <span class="gradient-text">Education</span></h2>
                </div>
                <Show when={!loading()} fallback={<ExperienceLoading />}>
                    <Show when={items().length > 0} fallback={
                        <div class="exp-empty" role="status">
                            <span class="exp-empty-mark" aria-hidden="true">◇</span>
                            <p>{portfolioData() ? 'No experience details available' : 'Experience is temporarily unavailable'}</p>
                        </div>
                    }>
                        <ExperienceEntries items={items()} />
                    </Show>
                </Show>
            </div>
        </section>
    );
}
