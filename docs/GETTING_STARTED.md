# Getting started

**expo-store-publishing-kit** is a separate repository: documentation, an AI prompt template, and an optional Playwright script for store listing work. Your Expo app stays in its own repo. EAS Metadata reads **`store.config.json`** from the **app root** (next to `app.json` / `package.json`).

---

## 1. Put the kit clone next to your app on disk

Clone **this** repo so it sits **beside** your Expo project (sibling folders). Names can be anything; these are examples:

```text
~/Dev/
  my-expo-app/                    ← your Expo app (you run most commands here)
  expo-store-publishing-kit/      ← clone of https://github.com/eorekhov53/expo-store-publishing-kit
```

From `my-expo-app/`, the kit folder is reachable as `../expo-store-publishing-kit`. That relative path means: “go up one level, then into the kit clone.”

---

## 2. Add `store.config.json` to your app (not inside the kit)

In **your app root** (same level as `app.json` / `package.json`):

- Copy ideas from [`templates/store.config.example.json`](../templates/store.config.example.json), or  
- Use the copy-paste prompt in [`AI_PROMPT.md`](./AI_PROMPT.md) in Cursor Agent mode to generate a full file.

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

Only if you want PNGs on disk and paths in `store.config.json`. All commands and variables are explained in **[SCREENSHOTS.md](./SCREENSHOTS.md)**.

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

## Where to go next

| Document | Use when |
|----------|----------|
| [SCREENSHOTS.md](./SCREENSHOTS.md) | You want automated web screenshots |
| [AI_PROMPT.md](./AI_PROMPT.md) | You want an AI to draft `store.config.json` / screen list |
