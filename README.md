# expo-store-publishing-kit

Shared **documentation**, an **optional Playwright script** for web store screenshots, and an **AI prompt template** for drafting listing metadata. Use it with [EAS Metadata](https://docs.expo.dev/eas/metadata/) to publish **Expo** apps to the **App Store** and **Google Play**.

This repository is **not** your application. Your Expo app lives in **its own** repo. EAS reads **`store.config.json`** from the **app root** (next to `app.json` / `package.json`).

You **do not** need this kit on disk for a minimal flow: only `store.config.json` + `eas metadata:push` in your app.

---

## 1. Decide whether you want automated web screenshots

| Situation | What to do first |
|-----------|------------------|
| **Yes** — listing images should come from the app’s **web** build (Playwright), and you want paths like `apple.screenshots` in `store.config.json` | Follow **[`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md)** **before** you lock in `store.config.json`. When PNGs exist under `store-assets/screenshots/`, you or an AI can point `store.config.json` at those files. |
| **No** — screenshots will be done in **App Store Connect / Play Console** or by a **designer** | Skip screenshots. Go straight to **§2**. |

Everything in **[`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md)** (clone location, Playwright, `scripts/store-screens.config.json`, `node …/generate-store-screenshots.mjs`) belongs to the **“yes”** branch only.

---

## 2. Add or update `store.config.json` in your Expo app

Do this **after** screenshots on disk **if** you chose “yes” in §1. If you chose “no”, do this step immediately.

Put the file in the **app root** (same folder as `app.json` / `package.json`), not inside this kit repo.

Ways to create it:

- **`templates/store.config.example.json`** — minimal **skeleton** (shape for EAS Metadata, placeholders). Copy into your app as `store.config.json` and edit. Skip if you already have a config (e.g. from `eas metadata:pull`).
- **[`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md)** — prompt for an AI to generate a full `store.config.json` from your codebase. If `store-assets/screenshots/` already exists, the prompt tells the agent to fill **`apple.screenshots`** with real paths.

Replace every `FILL_IN` and placeholder URL before you push.

---

## 3. Push store listing (EAS Metadata)

From **your app root**:

```bash
npm install -g eas-cli
eas login
eas metadata:push
```

Official reference: [EAS Metadata](https://docs.expo.dev/eas/metadata/).

`eas metadata:pull` updates local `store.config.json` from the stores. Do **not** assume it restores every screenshot binary; keep PNGs in git or regenerate them if `store.config.json` references local files.

---

## 4. Build the app and submit the binary

Use the **scripts your app already defines** in `package.json` together with profiles in `eas.json`. This kit does not prescribe raw `eas` CLI invocations — teams usually wrap them (for example **`yarn build-submit:<platform>:<profile>`** or separate `build:*` / `submit:*` scripts).

Pick the right **platform** (`ios`, `android`) and **profile** (`development`, `production`, etc.) for your release. Example **pattern** (names differ per repository):

```bash
yarn build-submit:ios:production
yarn build-submit:android:production
```

If your `package.json` uses different script names, follow those instead.

---

## 5. What you still do in the browser (not covered by this kit)

| Apple (App Store Connect) | Google (Play Console) |
|---------------------------|------------------------|
| App record, pricing, regions | App record, pricing, regions |
| App Privacy questionnaire | Content rating, Data safety |
| Review submission after upload | Feature graphic 1024×500, screenshots if not via Metadata |
| Demo account / review notes in `store.config.json` | Promote release track when ready |

---

## 6. `.gitignore` in your app (only if you use Playwright screenshots)

If you followed §1 “yes”:

```gitignore
scripts/.auth/
```

Add `store-assets/screenshots/` **only** if you do **not** commit listing PNGs. If the team **commits** screenshots so every clone can run `eas metadata:push`, **do not** ignore that folder.

---

## Files in this repo

| File | Purpose |
|------|---------|
| [`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md) | Full Playwright flow (only for the “yes” branch in §1) |
| [`templates/store.config.example.json`](./templates/store.config.example.json) | Minimal `store.config.json` skeleton |
| [`templates/store-screens.config.json`](./templates/store-screens.config.json) | Example routes — copy into your app as `scripts/store-screens.config.json` when using screenshots |
| [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) | AI prompt to draft `store.config.json` (after PNGs exist if you use §1 “yes”) |

## License

MIT — see [`LICENSE`](./LICENSE).
