# expo-store-publishing-kit

A reusable toolkit for publishing **Expo** apps (including **StartupJS + Expo**) to the **App Store** and **Google Play**: EAS Metadata workflow docs, manual checklists, an AI agent prompt, and a Playwright screenshot script for web-rendered screens.

The repo is designed for **one company / many apps**: each app keeps its own `store.config.json`, while shared process docs and tooling live here.

## Quick start (for app developers)

1. Read [`docs/STORE_PUBLISHING.md`](./docs/STORE_PUBLISHING.md) (includes **suggested order** and optional steps).
2. In your Expo app root, create **`store.config.json`** (often generated with the prompt in [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md)).

**Optional — web screenshots first (useful before an AI fills `store.config.json`):** if you want stable local paths for `apple.screenshots` before editing metadata:

- one-time: `yarn add -D playwright && npx playwright install chromium`
- copy [`templates/store-screens.config.json`](./templates/store-screens.config.json) into your app as **`scripts/store-screens.config.json`** and edit routes
- from your app root (replace with your local clone path):

```bash
yarn web
APP_URL=http://localhost:8081 node /path/to/expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
```

The current working directory is treated as app root unless `APP_ROOT` is set. Then point `apple.screenshots` in `store.config.json` at files under `store-assets/screenshots/` (see docs for **git vs ignored** tradeoffs).

3. Push listing metadata from your app root: `eas metadata:push`.

## Repository contents

| Path | Purpose |
|------|---------|
| [`docs/STORE_PUBLISHING.md`](./docs/STORE_PUBLISHING.md) | End-to-end workflow: metadata, screenshots, build/submit, and manual tasks |
| [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) | Prompt for Cursor/AI agent to generate app-specific listing files |
| [`scripts/generate-store-screenshots.mjs`](./scripts/generate-store-screenshots.mjs) | Playwright capture with persisted login session and store-size outputs |
| [`templates/store-screens.config.json`](./templates/store-screens.config.json) | Example screenshot route config to copy into an app |
| [`templates/store.config.example.json`](./templates/store.config.example.json) | Minimal `store.config.json` skeleton |

## Recommended app `.gitignore` entries

Always ignore the Playwright session file:

```gitignore
scripts/.auth/
```

`store-assets/screenshots/` is **optional to ignore**: ignore it if screenshots are only generated locally and not committed; **do not** ignore that folder if your team **commits** listing PNGs so clones and CI can run `eas metadata:push` without regenerating images (see [`docs/STORE_PUBLISHING.md`](./docs/STORE_PUBLISHING.md)).

## License

MIT — see [`LICENSE`](./LICENSE).
