# expo-store-publishing-kit

Shared docs, an optional Playwright screenshot script, and an AI prompt template for Expo store publishing.

This repository is **not** your app. Your Expo app stays in its own repo.

---

## Two separate processes

### Process A — EAS Metadata config (`store.config.json`)

Use this process for listing text/metadata synced by EAS Metadata.

1. Create/update `store.config.json` in your **app root** (next to `app.json` / `package.json`).
2. Validate and push from app root:

```bash
npm install -g eas-cli
eas login
eas metadata:lint --profile development
eas metadata:push --profile development
```

Notes:
- EAS Metadata currently covers **Apple-only** in `store.config.json` root schema.
- Keep Google Play copy in a separate app file (for example `store.google-play-listing.json`) and paste in Play Console.
- `eas metadata:pull` updates local config fields, but do not treat it as guaranteed screenshot binary restore.

---

### Process B — Screenshot generation (manual upload flow)

Use this process only if you want automated screenshot capture from web.

- Output files are local PNGs under `store-assets/screenshots/...` in your app.
- These PNGs are for **manual upload** in App Store Connect / Google Play Console.
- They are **not** synced by `eas metadata:push` in the current schema.

Read: **[`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md)**

Screenshot policy:
- Minimum **3** screenshots.
- Typical set **3–5** total.
- Prefer **phone + tablet** outputs.
- Add 4th/5th only if they show distinct high-value flows.

---

## Build and submit binaries

Use your app scripts from `package.json` with profiles from `eas.json` (names differ per repo). Typical pattern:

```bash
yarn build-submit:ios:production
yarn build-submit:android:production
```

---

## What is always manual in store consoles

| Apple (App Store Connect) | Google (Play Console) |
|---------------------------|------------------------|
| App record, pricing, regions | App record, pricing, regions |
| App Privacy questionnaire | Content rating, Data safety |
| Review submission after binary upload | Feature graphic 1024×500 |
| Screenshot upload (from Process B outputs) | Screenshot upload (from Process B outputs) |

---

## Files in this repo

| File | Purpose |
|------|---------|
| [`templates/store.config.example.json`](./templates/store.config.example.json) | Minimal `store.config.json` skeleton for Process A |
| [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) | AI prompt for generating `store.config.json` (Process A) |
| [`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md) | Full screenshot flow (Process B) |
| [`templates/store-screens.config.json`](./templates/store-screens.config.json) | Example route list for Process B |

## License

MIT — see [`LICENSE`](./LICENSE).
