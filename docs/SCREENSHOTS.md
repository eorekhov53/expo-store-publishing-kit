# Web screenshots (optional, manual upload flow)

Generate store-sized PNGs from your app’s web build using Playwright.

Important:
- Output screenshots are for **manual upload** in App Store Connect / Play Console.
- In current EAS Metadata schema, screenshots are **not** pushed via `store.config.json`.

---

## Screenshot policy

- Minimum **3** screenshots.
- Typical set **3–5** total.
- Prefer **phone + tablet** outputs.
- Add screenshot 4/5 only if it shows a clearly different high-value flow.

---

## 0. Folder layout

You need:
1. Your Expo app repo (`package.json`, `store.config.json`).
2. This kit clone (can be anywhere on disk).

Sibling layout is just convenient:

```text
~/Dev/
  my-expo-app/
  expo-store-publishing-kit/
```

Then from app root, path to kit is `../expo-store-publishing-kit`.

---

## 1. One-time install (inside the kit clone)

Install Playwright where the script lives (this repo):

```bash
cd /path/to/expo-store-publishing-kit
npm install
npm run playwright:install
```

(Yarn equivalent: `yarn install && yarn playwright:install`)

---

## 2. Configure routes (inside your app)

Create `scripts/store-screens.config.json` in your app by copying:
- `templates/store-screens.config.json` from this kit.

Set 3–5 routes in `screens`.

---

## 3. Start app web server (inside your app)

```bash
cd /path/to/my-expo-app
yarn web
```

---

## 4. Run capture script (inside your app)

```bash
cd /path/to/my-expo-app
APP_URL=http://localhost:8081 node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
```

If your app is not current directory:

```bash
APP_ROOT=/path/to/my-expo-app APP_URL=http://localhost:8081 node /path/to/expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
```

Defaults:
- `waitUntil=domcontentloaded` (to avoid Expo HMR/WebSocket hangs).

Useful flags:

```bash
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --reset-session
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --platform=ios
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --platform=android
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --wait-until=load
node ../expo-store-publishing-kit/scripts/generate-store-screenshots.mjs --goto-timeout-ms=45000
```

---

## 5. First run login

On first run, browser opens for login.
Session is saved to:

```text
my-expo-app/scripts/.auth/session.json
```

Add to app `.gitignore`:

```gitignore
scripts/.auth/
```

---

## 6. Output location

```text
my-expo-app/store-assets/screenshots/
  ios/iphone-6.7/
  ios/iphone-6.5/
  ios/ipad-pro-12.9/
  android/phone/
  android/tablet-10/
```

---

## 7. Upload screenshots manually

Upload generated PNGs manually in:
- App Store Connect
- Google Play Console

If a flow requires real camera/BLE/native hardware, capture on device or use designer mockups.
