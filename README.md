# expo-store-publishing-kit

Набор шаблонов и инструментов для публикации **Expo**‑приложений (в т.ч. на **StartupJS + Expo**) в **App Store** и **Google Play**: EAS Metadata, чеклисты ручных шагов, промпт для ИИ‑агента и скрипт скриншотов через **Playwright** (веб‑сборка приложения).

Репозиторий рассчитан на **одну компанию / несколько проектов**: в каждом приложении остаётся только свой `store.config.json`, всё остальное подключается по ссылке на этот репозиторий или копированием файлов.

## Быстрый старт для разработчика

1. В корне своего Expo‑проекта заведите **`store.config.json`** (можно сгенерировать через ИИ по промпту из [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md)).
2. Прочитайте гайд [`docs/STORE_PUBLISHING.md`](./docs/STORE_PUBLISHING.md).
3. Для автоматических скриншотов веб‑версии:
   - один раз: `yarn add -D playwright && npx playwright install chromium`
   - скопируйте [`templates/store-screens.config.json`](./templates/store-screens.config.json) в свой проект как **`scripts/store-screens.config.json`** и отредактируйте маршруты под ваше приложение
   - из **корня приложения** выполните (подставьте путь к клону этого репозитория):

   ```bash
   yarn web   # отдельный терминал
   APP_URL=http://localhost:8081 node /path/to/expo-store-publishing-kit/scripts/generate-store-screenshots.mjs
   ```

   Текущая рабочая директория считается корнем приложения (`APP_ROOT`), если не задано иное: `APP_ROOT=/abs/path/to/app`.

4. Метаданные в сторы: `eas metadata:push` (из корня приложения, где лежит `store.config.json`).

## Содержимое репозитория

| Путь | Назначение |
|------|------------|
| [`docs/STORE_PUBLISHING.md`](./docs/STORE_PUBLISHING.md) | Полный процесс: EAS Metadata, скриншоты, билд/submit, что делать вручную |
| [`docs/AI_PROMPT.md`](./docs/AI_PROMPT.md) | Промпт для Cursor/другого агента: сгенерировать `store.config.json` и локальные файлы в приложении |
| [`scripts/generate-store-screenshots.mjs`](./scripts/generate-store-screenshots.mjs) | Playwright: сессия после первого логина, размеры под требования сторов |
| [`templates/store-screens.config.json`](./templates/store-screens.config.json) | Пример списка URL для скриншотов — копируется в приложение |
| [`templates/store.config.example.json`](./templates/store.config.example.json) | Минимальный каркас `store.config.json` |

## Git в приложении

Рекомендуется добавить в `.gitignore` приложения:

```gitignore
scripts/.auth/
store-assets/screenshots/
```

## Git: push на GitHub

Если `git push` по SSH падает с «Permission denied» (ключ привязан к другому GitHub‑аккаунту), используйте HTTPS‑remote:

```bash
git remote set-url origin https://github.com/eorekhov53/expo-store-publishing-kit.git
git push origin main
```

Или настройте SSH‑ключ для аккаунта, владеющего репозиторием.

## Лицензия

MIT — см. [`LICENSE`](./LICENSE).
