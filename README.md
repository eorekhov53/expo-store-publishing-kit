# expo-store-publishing-kit

A reusable toolkit for publishing **Expo** apps (including **StartupJS + Expo**) to the **App Store** and **Google Play**: EAS Metadata workflow docs, manual checklists, an AI agent prompt, and a Playwright screenshot script for web-rendered screens.

The repo is designed for **one company / many apps**: each app keeps its own `store.config.json`, while shared process docs and tooling live here.

## Quick start (for app developers)

1. In your Expo app root, create **`store.config.json`** (you can generate it with the prompt in [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md)).
2. Read [`docs/STORE_PUBLISHING.md`](./docs/STORE_PUBLISHING.md).
3. For automated web screenshots:
   - one-time: `yarn add -D playwright && npx playwright install chromium`
   - copy [`templates/store-screens.config.json`](./templates/store-screens.config.json) into your app as **`scripts/store-screens.config.json`** and edit routes
   - run from your app root (replace with your local clone path):

   ```bash
   yarn web
   APP_URL=http://localhost:8081 node /path/to/expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
   ```

   The current working directory is treated as app root unless `APP_ROOT` is set.

4. Push listing metadata from your app root: `eas metadata:push`.

## Repository contents

| Path | Purpose |
|------|---------|
| [`docs/STORE_PUBLISHING.md`](./docs/STORE_PUBLISHING.md) | End-to-end workflow: metadata, screenshots, build/submit, and manual tasks |
| [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) | Prompt for Cursor/AI agent to generate app-specific listing files |
| [`scripts/generate-store-screenshots.mjs`](./scripts/generate-store-screenshots.mjs) | Playwright capture with persisted login session and store-size outputs |
| [`templates/store-screens.config.json`](./templates/store-screens.config.json) | Example screenshot route config to copy into an app |
| [`templates/store.config.example.json`](./templates/store.config.example.json) | Minimal `store.config.json` skeleton |

## Recommended app .gitignore entries

```gitignore
scripts/.auth/
store-assets/screenshots/
```

## GitHub push note

If SSH push fails with `Permission denied` because your SSH key belongs to another GitHub account, switch to HTTPS remote:

```bash
git remote set-url origin https://github.com/eorekhov53/expo-store-publishing-kit.git
git push origin main
```

Or configure an SSH key for the account that owns the repository.

## License

MIT — see [`LICENSE`](./LICENSE).
