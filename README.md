# expo-store-publishing-kit

Shared **docs + optional Playwright script** for shipping **Expo** apps to the **App Store** and **Google Play** with [EAS Metadata](https://docs.expo.dev/eas/metadata/).

Each real app keeps its own **`store.config.json`** in the app repository. This kit is cloned **separately** and referenced from the app when needed.

## Start here

Read **[docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)**. It explains, in order: where to clone this repository on your computer relative to your Expo app, how to add `store.config.json` to the app, how to run `eas metadata:push`, and which steps you still complete in **App Store Connect** and **Google Play Console** (outside this kit).

## Other docs

| File | Purpose |
|------|---------|
| [docs/SCREENSHOTS.md](./docs/SCREENSHOTS.md) | Optional web screenshots; explains the “path to this clone” next to your app |
| [docs/AI_PROMPT.md](./docs/AI_PROMPT.md) | Copy-paste prompt for an AI to draft `store.config.json` in an app repo |

## License

MIT — see [`LICENSE`](./LICENSE).
