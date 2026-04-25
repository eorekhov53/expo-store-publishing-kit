# AI Agent Prompt (App listing generation)

**Manual workflow:** [README.md](../README.md) at the repository root.

Paste the block below into **Agent mode** in the **root of your Expo app**. The agent should only generate app-specific files. Shared docs and screenshot tooling are in **[expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit)**.

---

## PROMPT (copy from here)

```
You are a store publishing agent for an Expo application.

## Scope (order)

1. If listing should include **local Playwright PNGs** but `store-assets/screenshots/` is missing or empty: stop and tell the human to run the kit **`docs/SCREENSHOTS.md`** first, then run this prompt again.
2. Create or update `store.config.json` in the project root for EAS Metadata (full en-US listing, categories, `apple.advisory` per Expo schema, review + demo credentials — use **defaults below** unless the repo already defines different review contacts).
3. If `store-assets/screenshots/` exists, add **`apple.screenshots`** (and any other supported local paths) pointing at those files with paths relative to the app root.
4. Append to `.gitignore` if missing:
   scripts/.auth/
   Optionally `store-assets/screenshots/` — only if screenshots are NOT committed to git (if PNGs are committed so clones can `eas metadata:push`, do NOT ignore that folder).

Do NOT copy kit docs or the Playwright script into this repo — developers use the shared kit:
https://github.com/eorekhov53/expo-store-publishing-kit

Human order: kit **README.md** §1 (screenshots yes/no) → §2 (`store.config.json`).

## Default `apple.review` (App Store) — use unless overridden

When generating `store.config.json`, set **`apple.review`** to:

- `firstName`: `Niraj`
- `lastName`: `Kumar`
- `email`: `info@zenkoder.com`
- `phone`: `+1 512 394 4786` (same number as `+15123944786`, EAS-friendly spacing)
- `demoUsername`: `test@appletest.com`
- `demoPassword`: `qweqwe123`
- `demoRequired`: `true`
- `notes`: app-specific steps for reviewers (permissions, where to tap, how to reach the main flow). Do not put demo secrets in `notes`; use `demoUsername` / `demoPassword`.

## Analysis

Read app.json / app.config.js, app/** screens, components/**, permission strings, and eas.json. Infer audience, core features, and privacy story.

## store.config.json

- Apple: title (≤30), subtitle (≤30), description (≤4000), keywords array (joined ≤100 chars), releaseNotes, URLs (placeholders if unknown), categories, `apple.advisory` with least-restrictive defaults unless mature content, **`apple.review`** using **Default `apple.review`** above unless the codebase specifies other contacts.
- EAS Metadata today is **Apple-only** at the root of `store.config.json` ([schema](https://docs.expo.dev/eas/metadata/schema/)). For Google Play copy, use a separate file in the app repo (e.g. `store.google-play-listing.json`) or omit.
- If listing images exist on disk, add `apple.screenshots` for `en-US` (and other locales if applicable) with paths that match the repo layout.

## store-screens.config.json

- screens: { route, label, waitFor? } for each major tab/screen safe to open in web after login.
- manualNotes: bullets for camera-only / native-only screens designers must capture.

Output files only; end with a short checklist of any remaining `FILL_IN` fields (URLs, app-specific review notes) and manual store-console steps (one paragraph).
```

---

## After generation

- Review legally sensitive wording (privacy, biometrics, children).
- Fill any remaining `FILL_IN` values (e.g. marketing URLs) before `eas metadata:push`. Review contact and demo login are already defaulted in the prompt above.
- For screenshots, follow kit `docs/SCREENSHOTS.md`.
