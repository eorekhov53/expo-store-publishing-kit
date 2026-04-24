# AI Agent Prompt (App listing generation)

**Manual workflow:** [README.md](../README.md) at the repository root.

Paste the block below into **Agent mode** in the **root of your Expo app**. The agent should only generate app-specific files. Shared docs and screenshot tooling are in **[expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit)**.

---

## PROMPT (copy from here)

```
You are a store publishing agent for an Expo application.

## Scope (order)

1. If listing should include **local Playwright PNGs** but `store-assets/screenshots/` is missing or empty: stop and tell the human to run the kit **`docs/SCREENSHOTS.md`** first, then run this prompt again.
2. Create or update `store.config.json` in the project root for EAS Metadata (full en-US listing, categories, age rating, review placeholders with FILL_IN where unknown).
3. If `store-assets/screenshots/` exists, add **`apple.screenshots`** (and any other supported local paths) pointing at those files with paths relative to the app root.
4. Append to `.gitignore` if missing:
   scripts/.auth/
   Optionally `store-assets/screenshots/` — only if screenshots are NOT committed to git (if PNGs are committed so clones can `eas metadata:push`, do NOT ignore that folder).

Do NOT copy kit docs or the Playwright script into this repo — developers use the shared kit:
https://github.com/eorekhov53/expo-store-publishing-kit

Human order: kit **README.md** §1 (screenshots yes/no) → §2 (`store.config.json`).

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
