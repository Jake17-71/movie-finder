/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMDB_TOKEN: string
  readonly VITE_GROQ_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
