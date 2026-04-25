# Web screenshots (optional)

Generates store-sized PNGs from your app’s **web** build using **Playwright**. Anything that needs a **real camera**, BLE, or native-only UI must be shot on a device or supplied by a designer.

**When to run this:** **before** you finalize `store.config.json` if you want **`apple.screenshots`** (or similar) to reference these files. After PNGs exist, generate or edit `store.config.json` (see root `README.md` §1–2 and [`AI_PROMPT.md`](./AI_PROMPT.md)).

---

## Screenshot policy (recommended)

- Capture **3 screenshots minimum**.
- Typical set is **3–5 screenshots total**.
- Use **phone + tablet** outputs.
- Add the 4th/5th screenshot only if it shows clearly different, high-value functionality.

Recommended baseline order:
1. Primary value screen (main app action)
2. Secondary core flow
3. Key supporting screen (profile/settings/listing context)
4. Optional differentiator
5. Optional differentiator

---

## 0. Folder layout

You need **two** paths on your machine:

1. **Your Expo app** — e.g. `~/Dev/my-expo-app` (where `package.json` and `store.config.json` live).
2. **This kit** — a **git clone** of `expo-store-publishing-kit` (clone can live **anywhere**).

**Sibling folders** (same parent directory) are only a **convenience** so the path from your app to the script is short, for example:

```text
~/Dev/
  my-expo-app/
  expo-store-publishing-kit/
```

From `my-expo-app/`, the kit is then `../expo-store-publishing-kit` (one level up, into the clone). That is a normal relative path, not a special variable. If the clone lives elsewhere, use the correct **relative** or **absolute** path to `scripts/generate-store-screenshots.mjs` in your `node ...` command.

---

## 1. One-time install (inside the kit clone)

Install Playwright where the script lives (this repository), not in your Expo app:

```bash
cd /path/to/expo-store-publishing-kit
npm install
npm run playwright:install
```

(Equivalent with Yarn: `yarn install && yarn playwright:install`)

---

## 2. Tell the script which URLs to open (in your app) (in your app) (in your app) (in your app) (in your app)

In your app, create **`scripts/store-screens.config.json`** by copying [`templates/store-screens.config.json`](../templates/store-screens.config.json) from the kit. Edit `screens` so each `route` is a real **Expo Router** path (e.g. `/home`, `/settings`). Keep the list short: **3 minimum**, usually **3–5**.

---

## 3. Run the web server (in your app) (in your app) (in your app) (in your app)

In a **second** terminal, from your app root:

```bash
yarn web
```

Note the URL (often `http://localhost:8081`). The script defaults to that if you omit `APP_URL`.

---

## 4. Run the screenshot script from your app root

**Example** (sibling clone named `expo-store-publishing-kit`):

```bash
cd /path/to/my-expo-app
APP_URL=http://localhost:8081 node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
```

- **`APP_URL`** — where `yarn web` is serving your app.
- **`../expo-store-publishing-kit/...`** — path to **this** repository’s `scripts/generate-store-screenshots.mjs` on **your** disk. Change it if your folders are named differently.

If your app is **not** the current directory, set **`APP_ROOT`** to the app root:

```bash
APP_ROOT=/path/to/my-expo-app APP_URL=http://localhost:8081 node /path/to/expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
```

---

## 5. First run = login once

The browser opens. Sign in to your app, then press **Enter** in the terminal. Playwright saves session data to:

```text
my-expo-app/scripts/.auth/session.json
```

That folder is created automatically. Add `scripts/.auth/` to **`.gitignore`** in the app (contains session cookies).

Next runs reuse that file until you pass **`--reset-session`**.

---

## 6. Output files

PNG files are written under your app:

```text
my-expo-app/store-assets/screenshots/
  ios/iphone-6.7/
  ios/iphone-6.5/
  ios/ipad-pro-12.9/
  android/phone/
  android/tablet-10/
```

---

## 7. Use the PNGs in `store.config.json`

Add paths under `apple.screenshots` (see [EAS Metadata](https://docs.expo.dev/eas/metadata/)), then from your app root:

```bash
eas metadata:push
```

Files must exist on disk at push time. Google Play listing images are often still uploaded in Play Console — check current Expo docs for Android metadata support.

---

## 8. Useful flags

```bash
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --reset-session
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --platform=ios
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --platform=android
```

---

## 9. Designer-only shots

If you already have 3 strong screenshots, do not force extra images. Use optional slots only when they improve conversion.

List them in `manualNotes` inside `store-screens.config.json` so the script prints a reminder at the end. Free device mockups: [Shots.so](https://shots.so), [AppMockUp](https://app-mockup.com).
