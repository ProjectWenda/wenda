/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_DISCORD_AUTH_REDIRECT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}