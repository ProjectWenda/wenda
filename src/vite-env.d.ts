/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_DISCORD_AUTH_REDIRECT: string;
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}