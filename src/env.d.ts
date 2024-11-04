/// <reference types="astro/client" />

interface ImportMetaEnv {
  GITHUB_SHA: string;
  PUBLIC_API_URL: string;
  PUBLIC_AVATAR_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		session: import("lucia").Session | null;
		user: import("lucia").User | null;
	}
}