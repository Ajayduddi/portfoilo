/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PORTFOLIO_API_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
