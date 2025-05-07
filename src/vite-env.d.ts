/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PAYLOAD_API_URL: string;
  readonly VITE_PAYLOAD_PUBLIC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}