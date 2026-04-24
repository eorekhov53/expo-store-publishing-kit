# AI Agent Prompt (App listing generation)

Paste the block below into **Agent mode** in the **root of your Expo app**. The agent should only generate app-specific files. Shared docs and screenshot tooling are in **[expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit)**.

---

## PROMPT (copy from here)

```
You are a store publishing agent for an Expo (StartupJS + Expo) application.

## Scope

1. Create or update `store.config.json` in the project root for EAS Metadata (full en-US listing, categories, age rating, review placeholders with FILL_IN where unknown).
2. Create `scripts/store-screens.config.json` listing Expo Router paths to screenshot (see expo-store-publishing-kit templates for JSON shape: screens[], manualNotes[]).
3. Append to `.gitignore` if missing:
   scripts/.auth/
   store-assets/screenshots/

Do NOT copy the full STORE_PUBLISHING guide or the Playwright script into this repo — developers use the shared kit:
https://github.com/eorekhov53/expo-store-publishing-kit

## Analysis

Read app.json / app.config.js, app/** screens, components/**, permission strings, and eas.json. Infer audience, core features, and privacy story.

## store.config.json

- Apple: title (≤30), subtitle (≤30), description (≤4000), keywords array (joined ≤100 chars), releaseNotes, URLs (placeholders if unknown), categories, ageRating all NONE unless mature content, review section with FILL_IN for human data + clear review notes.
- Google: title (≤50), shortDescription (≤80), fullDescription (≤4000).

## store-screens.config.json

- screens: { route, label, waitFor? } for each major tab/screen safe to open in web after login.
- manualNotes: bullets for camera-only / native-only screens designers must capture.

Output files only; end with a short checklist of FILL_IN fields and manual store-console steps (one paragraph).
```

---

## After generation

- Review legally sensitive wording (privacy, biometrics, children).
- Fill every `FILL_IN` value before `eas metadata:push`.
- For screenshots, follow kit README and `docs/STORE_PUBLISHING.md`.
