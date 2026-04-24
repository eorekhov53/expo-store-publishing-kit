# expo-store-publishing-kit

Shared **documentation**, an **optional Playwright script** for web store screenshots, and an **AI prompt template** for drafting listing metadata. Use it with [EAS Metadata](https://docs.expo.dev/eas/metadata/) to publish **Expo** apps to the **App Store** and **Google Play**.

This repository is **not** your application. Your Expo app lives in **its own** repo. For store listings, EAS reads **`store.config.json`** from the **app root** (next to `app.json` / `package.json`).

**You do not have to clone this kit** to use EAS Metadata. Cloning is only useful if you want local copies of the templates, the screenshot script, or the AI prompt file.

---

## 1. Add `store.config.json` to your Expo app

Put the file in the **app root** (same folder as `app.json` / `package.json`), not inside this kit repo.

Ways to create it:

- **`templates/store.config.example.json`** — a **small skeleton**: correct top-level shape for EAS Metadata (`apple` / `google`, `en-US`, placeholders). Copy it into your app as `store.config.json` and replace text and every `FILL_IN`. You can skip it if you already have a config from `eas metadata:pull` or from your own template.
- **[`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md)** — copy-paste prompt for an AI (e.g. Cursor Agent) to generate a full `store.config.json` from your codebase.

Replace every `FILL_IN` and placeholder URL before you push.

---

## 2. Push store listing (EAS Metadata)

From **your app root**:

```bash
npm install -g eas-cli
eas login
eas metadata:push
```

Official reference: [EAS Metadata](https://docs.expo.dev/eas/metadata/).

`eas metadata:pull` updates your local `store.config.json` from the stores. Do **not** assume it re-downloads every screenshot file; keep PNGs in git or regenerate them if you rely on local paths (see optional screenshots below).

---

## 3. (Optional) Clone this kit and place it beside your app

**Only needed** if you want the convenience of:

- running `node ../expo-store-publishing-kit/scripts/...` from your app folder (short relative path), or  
- copying files from `templates/` without opening GitHub in a browser.

You may clone this repo **anywhere** on disk and use **absolute paths** instead. The sibling layout is **not** a requirement for Apple or Google.

Example layout (optional):

```text
~/Dev/
  my-expo-app/
  expo-store-publishing-kit/
```

---

## 4. (Optional) Web screenshots before filling `apple.screenshots`

Only if you want PNGs on disk and paths in `store.config.json`. Full instructions: **[`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md)**.

Skip this if designers upload images directly in App Store Connect / Play Console.

---

## 5. Build the app and submit the binary

Use your app’s `eas.json` and `package.json` scripts (profile names differ per project). Typical shape:

```bash
eas build --profile production --platform ios
eas submit --profile production -p ios --latest
```

Repeat for Android with the right profile.

---

## 6. What you still do in the browser (not covered by this kit)

| Apple (App Store Connect) | Google (Play Console) |
|---------------------------|------------------------|
| App record, pricing, regions | App record, pricing, regions |
| App Privacy questionnaire | Content rating, Data safety |
| Review submission after upload | Feature graphic 1024×500, screenshots if not via Metadata |
| Demo account / review notes in `store.config.json` | Promote release track when ready |

---

## 7. `.gitignore` in your app (short)

Always ignore Playwright login state (only if you use the screenshot script):

```gitignore
scripts/.auth/
```

Ignore `store-assets/screenshots/` **only** if you do **not** commit listing PNGs. If the team **commits** screenshots so every clone can run `eas metadata:push`, **do not** ignore that folder.

---

## More in this repo

| File | Purpose |
|------|---------|
| [`templates/store.config.example.json`](./templates/store.config.example.json) | Minimal `store.config.json` skeleton (optional starting point) |
| [`templates/store-screens.config.json`](./templates/store-screens.config.json) | Example routes for the screenshot script (copy into your app if you use screenshots) |
| [`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md) | Optional web screenshots; paths from your app to this repo |
| [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) | Copy-paste prompt for an AI to draft `store.config.json` |

## License

MIT — see [`LICENSE`](./LICENSE).
