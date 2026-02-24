import { createContext, useContext, createSignal, onMount, type JSX } from 'solid-js';
import {
    fetchPortfolioData,
    fetchLeetcodeStats,
    fetchCodechefStats,
    type PortfolioApiResponse,
    type LeetcodeStats,
    type CodechefApiResponse,
} from '../services/portfolioApi';

// ─── Context Shape ─────────────────────────────────────────────────────────────
// All values are accessor functions (signals) so consumers re-render reactively

interface PortfolioContextValue {
    loading: () => boolean;
    portfolioData: () => PortfolioApiResponse | null;
    leetcodeStats: () => LeetcodeStats | null;
    codechefData: () => CodechefApiResponse | null;
}

const PortfolioContext = createContext<PortfolioContextValue>({
    loading: () => true,
    portfolioData: () => null,
    leetcodeStats: () => null,
    codechefData: () => null,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PortfolioProvider(props: { children: JSX.Element }) {
    const [loading, setLoading] = createSignal(true);
    const [portfolioData, setPortfolioData] = createSignal<PortfolioApiResponse | null>(null);
    const [leetcodeStats, setLeetcodeStats] = createSignal<LeetcodeStats | null>(null);
    const [codechefData, setCodechefData] = createSignal<CodechefApiResponse | null>(null);

    onMount(async () => {
        setLoading(true);

        const [portfolioResult, leetcodeResult, codechefResult] =
            await Promise.allSettled([
                fetchPortfolioData(),
                fetchLeetcodeStats(),
                fetchCodechefStats(),
            ]);

        if (portfolioResult.status === 'fulfilled' && portfolioResult.value) {
            const data = portfolioResult.value;
            // Sort once here so all components receive pre-sorted data
            if (data.projects) data.projects = [...data.projects].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
            if (data.experience) data.experience = [...data.experience].sort((a, b) => (b.sort ?? 0) - (a.sort ?? 0));
            setPortfolioData(data);
        }
        if (leetcodeResult.status === 'fulfilled') setLeetcodeStats(leetcodeResult.value);
        if (codechefResult.status === 'fulfilled') setCodechefData(codechefResult.value);

        setLoading(false);
    });

    return (
        <PortfolioContext.Provider value={{ loading, portfolioData, leetcodeStats, codechefData }}>
            {props.children}
        </PortfolioContext.Provider>
    );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function usePortfolio(): PortfolioContextValue {
    return useContext(PortfolioContext);
}
