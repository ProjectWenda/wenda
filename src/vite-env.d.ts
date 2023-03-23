/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_DISCORD_AUTH_REDIRECT: string;
  readonly VITE_DISCORD_AUTH_REDIRECT_LOCAL: string;
  readonly VITE_LOCAL_BACKEND_URL: string;
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}