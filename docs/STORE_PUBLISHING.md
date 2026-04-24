# Store publishing (Expo / StartupJS)

End-to-end process for publishing Expo apps (including StartupJS + Expo) to the App Store and Google Play using the shared toolkit: [expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit).

Three layers:

| Layer | Tool | Purpose |
|------|------|---------|
| Build and binary upload | EAS Build + EAS Submit | Build, signing, upload |
| Listing metadata | [EAS Metadata](https://docs.expo.dev/eas/metadata/) (`store.config.json` in app root) | Descriptions, keywords, rating, some iOS listing fields |
| Screenshot automation | `scripts/generate-store-screenshots.mjs` from the kit | Playwright captures at store-required sizes (**optional**) |

---

## Suggested workflow order

1. **Optional — web screenshots first**  
   Run the Playwright script so `store-assets/screenshots/...` exists on disk. Then an AI or a human can edit **`store.config.json`** once, including **`apple.screenshots`** paths that point at those files. You skip this entirely if you upload screenshots only in App Store Connect / Play Console or use designer assets later.

2. **Create / refine `store.config.json`**  
   Text fields, URLs, review notes, and (if you did step 1) screenshot paths.

3. **`eas metadata:push`**  
   Expo reads **local files** at the paths listed under `apple.screenshots` (and other supported fields) and uploads them to Apple. Paths must exist at push time.

4. **Build + `eas submit`** when the binary is ready.

You can swap (1) and (2) if you prefer to draft copy first and attach images in a second pass — screenshots are never required for a valid first `store.config.json`.

---

## What stays in each app repo

- **`store.config.json`** — required in app root for `eas metadata:push`
- **`scripts/store-screens.config.json`** — only if you use the optional Playwright screenshot flow

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
```

Add `store-assets/screenshots/` **only if** you do not commit listing PNGs (see next section).

---

## Part 1 — EAS Metadata

From app root (where `store.config.json` lives):

```bash
eas metadata:push
eas metadata:pull   # sync remote listing fields into local store.config.json
```

Typical fields covered by metadata push: app title, subtitle (iOS), descriptions, keywords (iOS), release notes, categories, age rating, support/privacy URLs, and App Review contact fields.

### Where screenshot files should live (git)

- **`eas metadata:push` needs real files on disk** at the paths referenced in `store.config.json` (usually paths relative to the app root, e.g. `./store-assets/screenshots/ios/iphone-6.7/1-home.png`).
- **Committing PNGs to the app repo is optional but practical** for teams: everyone who clones the repo can push metadata without re-running Playwright. Large repos may prefer **Git LFS** or generating screenshots in CI right before `eas metadata:push`.
- If you **do not** commit screenshots, keep `store-assets/screenshots/` in `.gitignore` and regenerate (or copy designer files) before each push that includes images.

### `eas metadata:pull` and images

- **`eas metadata:pull` updates `store.config.json` from the store** (text and structured listing fields). Behavior for **re-downloading every screenshot binary** into your tree can vary by EAS CLI / connector version.
- **Do not treat `metadata:pull` as guaranteed backup** of all PNG bytes. If you need reproducible pushes from any machine, **version-control the image files** (or store them in CI artifacts) and keep paths in `store.config.json` stable.

See [EAS Metadata](https://docs.expo.dev/eas/metadata/) for the latest pull/push capabilities.

---

## Part 2 — Screenshots (web, optional)

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
