# Промпт для ИИ-агента (генерация листинга в приложении)

Вставьте блок ниже в **Agent mode** в **корне вашего Expo-проекта**. Агент должен создать/обновить только то, что относится к **конкретному приложению**. Общие гайды и скрипт скриншотов — в репозитории **[expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit)**.

---

## PROMPT (копировать отсюда)

```
You are a store publishing agent for an Expo (StartupJS + Expo) application.

## Scope

1. Create or update `store.config.json` in the project root for EAS Metadata (full en-US listing, categories, age rating, review placeholders with FILL_IN where unknown).
2. Create `scripts/store-screens.config.json` listing Expo Router paths to screenshot (see expo-store-publishing-kit templates for JSON shape: screens[], manualNotes[]).
3. Append to `.gitignore` if missing:
   scripts/.auth/
   store-assets/screenshots/

Do NOT copy the full STORE_PUBLISHING guide or the Playwright script into this repo — developers use the shared kit:
https://github.com/eorekhov53/expo-store-publishing-kit

## Analysis

Read app.json / app.config.js, app/** screens, components/**, permissions strings, eas.json. Infer audience, features, privacy story.

## store.config.json

- Apple: title (≤30), subtitle (≤30), description (≤4000), keywords array (joined ≤100 chars), releaseNotes, URLs (placeholders if unknown), categories, ageRating all NONE unless mature content, review section with FILL_IN for human data + clear review notes.
- Google: title (≤50), shortDescription (≤80), fullDescription (≤4000).

## store-screens.config.json

- screens: { route, label, waitFor? } for each major tab/screen safe to open in web after login.
- manualNotes: bullets for camera-only / native-only screens designers must capture.

Output files only; end with a short checklist of FILL_IN fields and manual store console steps (one paragraph).
```

---

## После генерации

- Проверьте юридически чувствительные формулировки (privacy, биометрия, дети).
- Заполните все `FILL_IN` перед `eas metadata:push`.
- Скриншоты: см. README kit и `docs/STORE_PUBLISHING.md` в том же репозитории.
