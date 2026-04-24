# expo-store-publishing-kit

Shared **documentation**, an **optional Playwright script** for web store screenshots, and an **AI prompt template** for drafting listing metadata. Use it with [EAS Metadata](https://docs.expo.dev/eas/metadata/) to publish **Expo** apps to the **App Store** and **Google Play**.

**expo-store-publishing-kit** is not your application. Your Expo app lives in **its own** repository. EAS Metadata reads **`store.config.json`** from the **app root** (next to `app.json` / `package.json`). Clone this repo **separately** and point commands at it when needed.

---

## 1. Put the kit clone next to your app on disk

Clone this repository so it sits **beside** your Expo project (sibling folders). Names can be anything; these are examples:

```text
~/Dev/
  my-expo-app/                    ← your Expo app (you run most commands here)
  expo-store-publishing-kit/      ← this repo (clone of github.com/eorekhov53/expo-store-publishing-kit)
```

From `my-expo-app/`, the kit folder is reachable as `../expo-store-publishing-kit` (up one directory, then into the kit clone).

---

## 2. Add `store.config.json` to your app (not inside the kit)

In **your app root** (same level as `app.json` / `package.json`):

- Start from [`templates/store.config.example.json`](./templates/store.config.example.json), or  
- Use the copy-paste prompt in [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) in Cursor Agent mode to generate a full file.

Replace every `FILL_IN` and placeholder URL before you push.

---

## 3. Push store listing to Apple / Google (EAS Metadata)

From **your app root**:

```bash
npm install -g eas-cli
eas login
eas metadata:push
```

Official reference: [EAS Metadata](https://docs.expo.dev/eas/metadata/).

`eas metadata:pull` updates your local `store.config.json` from the stores. Do **not** assume it re-downloads every screenshot file; keep PNGs in git or regenerate them if you rely on local paths (see step 5).

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

Always ignore Playwright login state:

```gitignore
scripts/.auth/
```

Ignore `store-assets/screenshots/` **only** if you do **not** commit listing PNGs. If the team **commits** screenshots so every clone can run `eas metadata:push`, **do not** ignore that folder.

---

## More in this repo

| File | Purpose |
|------|---------|
| [`docs/SCREENSHOTS.md`](./docs/SCREENSHOTS.md) | Optional web screenshots; path from your app to this clone |
| [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) | Copy-paste prompt for an AI to draft `store.config.json` in an app repo |

## License

MIT — see [`LICENSE`](./LICENSE).
