# Store publishing (Expo / StartupJS)

End-to-end process for publishing Expo apps (including StartupJS + Expo) to the App Store and Google Play using the shared toolkit: [expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit).

Three layers:

| Layer | Tool | Purpose |
|------|------|---------|
| Build and binary upload | EAS Build + EAS Submit | Build, signing, upload |
| Listing metadata | [EAS Metadata](https://docs.expo.dev/eas/metadata/) (`store.config.json` in app root) | Descriptions, keywords, rating, some iOS listing fields |
| Screenshot automation | `scripts/generate-store-screenshots.mjs` from the kit | Playwright captures at store-required sizes |

---

## What stays in each app repo

- **`store.config.json`** — required in app root for `eas metadata:push`
- **`scripts/store-screens.config.json`** — route list for screenshot automation

Shared docs and the screenshot script stay in the kit repository to avoid duplication across apps.

---

## Prerequisites

```bash
npm install -g eas-cli

# In your app root
yarn add -D playwright
npx playwright install chromium
```

Recommended `.gitignore` entries in each app:

```gitignore
scripts/.auth/
store-assets/screenshots/
```

---

## Part 1 — EAS Metadata

From app root (where `store.config.json` lives):

```bash
eas metadata:push
eas metadata:pull   # sync back manual edits from store consoles
```

Typical fields covered by metadata push: app title, subtitle (iOS), descriptions, keywords (iOS), release notes, categories, age rating, support/privacy URLs, and App Review contact fields.

---

## Part 2 — Screenshots (web)

1. Copy `templates/store-screens.config.json` from the kit into your app as `scripts/store-screens.config.json`, then replace routes with real Expo Router paths.

2. Start app web server:

```bash
yarn web
```

3. Run the shared screenshot script from your app root:

```bash
export APP_URL=http://localhost:8081
export KIT_CLONE=../expo-store-publishing-kit

node "$KIT_CLONE/scripts/generate-store-screenshots.mjs"
# or set APP_ROOT=/abs/path/to/app and run from anywhere
```

First run opens a browser for manual login. Press Enter in terminal after login. Session is saved at `scripts/.auth/session.json`.

Reset saved session:

```bash
node "$KIT_CLONE/scripts/generate-store-screenshots.mjs" --reset-session
```

Filter by platform/device:

```bash
node "$KIT_CLONE/scripts/generate-store-screenshots.mjs" --platform=ios
node "$KIT_CLONE/scripts/generate-store-screenshots.mjs" --platform=android
```

Output folders:

```
store-assets/screenshots/
  ios/iphone-6.7/     1290x2796 (primary App Store size)
  ios/iphone-6.5/
  ios/ipad-pro-12.9/
  android/phone/      1080x1920
  android/tablet-10/
```

### Screens that cannot be captured from web

Camera/BLE/native-hardware/push-dependent flows must be captured on real devices or produced by designers. Add them to `manualNotes` in `scripts/store-screens.config.json` so the script prints reminders.

Free mockup tools: [Shots.so](https://shots.so), [AppMockUp](https://app-mockup.com).

### Linking screenshots in `store.config.json` (iOS)

After generating files, add paths under `apple.screenshots` and run `eas metadata:push` again. For Google Play, screenshot upload is often still handled manually in Play Console (check latest [Expo Metadata docs](https://docs.expo.dev/eas/metadata/)).

---

## Part 3 — Build and submit

Commands depend on each app's `package.json` and `eas.json`. Typical examples:

```bash
eas build --profile production --platform ios
eas submit --profile production -p ios --latest
```

Repeat for Android with the matching profile.

---

## Manual work that cannot be automated

### App Store Connect

- Create app record, pricing, and territory availability
- Complete App Privacy questionnaire
- Upload camera/native screenshots not available from web capture
- Fill real `apple.review` contact + demo credentials
- Submit build for review

### Google Play Console

- Create app record
- Complete Content rating (IARC) and Data safety forms
- Upload feature graphic (1024x500)
- Upload screenshots and listing graphics
- Promote internal/testing track to production

### Every release

- Update `releaseNotes` and listing text in `store.config.json`
- Run `eas metadata:push`
- Build + submit new binaries

---

## Troubleshooting

| Problem | Action |
|---------|--------|
| `eas metadata:push` auth error | `eas login` |
| Script cannot reach app | Check `APP_URL` and ensure `yarn web` is running |
| Script keeps capturing login screen | Run with `--reset-session` and log in again |
| Store rejects for missing privacy URL | Fill real `privacyPolicyUrl` in `store.config.json` |
