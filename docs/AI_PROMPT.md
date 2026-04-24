# AI Agent Prompt (App listing generation)

Humans: start with [`GETTING_STARTED.md`](./GETTING_STARTED.md).

Paste the block below into **Agent mode** in the **root of your Expo app**. The agent should only generate app-specific files. Shared docs and screenshot tooling are in **[expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit)**.

---

## PROMPT (copy from here)

```
You are a store publishing agent for an Expo (StartupJS + Expo) application.

## Scope

1. Create or update `store.config.json` in the project root for EAS Metadata (full en-US listing, categories, age rating, review placeholders with FILL_IN where unknown).
2. If the repo already contains generated listing images under `store-assets/screenshots/` (any layout), wire **`apple.screenshots`** (and any other supported local file paths) in `store.config.json` to those files using correct relative paths for the project.
3. Optionally create `scripts/store-screens.config.json` for the Playwright flow (see expo-store-publishing-kit templates: screens[], manualNotes[]). This file is only needed if the team uses the optional screenshot script.
4. Append to `.gitignore` if missing:
   scripts/.auth/
   Optionally `store-assets/screenshots/` — only if screenshots are NOT committed to git (if PNGs are committed so clones can `eas metadata:push`, do NOT ignore that folder).

Do NOT copy kit docs or the Playwright script into this repo — developers use the shared kit:
https://github.com/eorekhov53/expo-store-publishing-kit

Optional order: run web screenshots first (see kit `docs/SCREENSHOTS.md`), then fill `store.config.json` including `apple.screenshots` paths — human onboarding is `docs/GETTING_STARTED.md`.

## Analysis

Read app.json / app.config.js, app/** screens, components/**, permission strings, and eas.json. Infer audience, core features, and privacy story.

## store.config.json

- Apple: title (≤30), subtitle (≤30), description (≤4000), keywords array (joined ≤100 chars), releaseNotes, URLs (placeholders if unknown), categories, ageRating all NONE unless mature content, review section with FILL_IN for human data + clear review notes.
- Google: title (≤50), shortDescription (≤80), fullDescription (≤4000).
- If listing images exist on disk, add `apple.screenshots` for `en-US` (and other locales if applicable) with paths that match the repo layout.

## store-screens.config.json

- screens: { route, label, waitFor? } for each major tab/screen safe to open in web after login.
- manualNotes: bullets for camera-only / native-only screens designers must capture.

Output files only; end with a short checklist of FILL_IN fields and manual store-console steps (one paragraph).
```

---

## After generation

- Review legally sensitive wording (privacy, biometrics, children).
- Fill every `FILL_IN` value before `eas metadata:push`.
- For screenshots, follow kit `docs/SCREENSHOTS.md`.
