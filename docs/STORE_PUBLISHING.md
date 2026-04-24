# Store publishing (Expo / StartupJS)

Полный процесс публикации в **App Store** и **Google Play** для приложений на **Expo** (в т.ч. **StartupJS + Expo**). Общий репозиторий с инструментами: [expo-store-publishing-kit](https://github.com/eorekhov53/expo-store-publishing-kit).

Три слоя:

| Слой | Инструмент | Задача |
|------|------------|--------|
| Сборка и загрузка бинарника | EAS Build + EAS Submit | Сборка, подпись, отправка в сторы |
| Тексты и метаданные листинга | [EAS Metadata](https://docs.expo.dev/eas/metadata/) (`store.config.json` в **корне приложения**) | Описания, ключевые слова, возрастной рейтинг, часть скриншотов (iOS) |
| Скриншоты с веба | Скрипт из kit: `scripts/generate-store-screenshots.mjs` | Playwright, размеры под требования сторов |

---

## Что лежит в репозитории приложения

- **`store.config.json`** — только этот файл обязателен в корне проекта для `eas metadata:push`.
- **`scripts/store-screens.config.json`** — список маршрутов для скриншотов (скопируйте из [templates/store-screens.config.json](../templates/store-screens.config.json) в kit).

Остальная документация и скрипт — **в kit** (этот репозиторий или его клон), чтобы не дублировать между приложениями.

---

## Подготовка

```bash
npm install -g eas-cli

# В корне приложения:
yarn add -D playwright
npx playwright install chromium
```

В `.gitignore` приложения добавьте:

```gitignore
scripts/.auth/
store-assets/screenshots/
```

---

## Часть 1 — EAS Metadata

Из **корня приложения**, где лежит `store.config.json`:

```bash
eas metadata:push
eas metadata:pull   # забрать изменения, сделанные вручную в консолях
```

Что обычно покрывает push: название, подзаголовок (iOS), описания, ключевые слова (iOS), release notes, категории, возрастной рейтинг, URL политики/поддержки, контакты для ревью Apple.

---

## Часть 2 — Скриншоты (веб)

1. Скопируйте `templates/store-screens.config.json` из kit в приложение как `scripts/store-screens.config.json` и пропишите **реальные пути** Expo Router (`/home`, `/(tabs)/contacts` и т.д.).

2. Запустите веб:

```bash
yarn web
# или свой скрипт прод-сервера веба
```

3. Из **корня приложения** (или с `APP_ROOT`):

```bash
export APP_URL=http://localhost:8081
export KIT_CLONE=../expo-store-publishing-kit   # путь к клону kit

node "$KIT_CLONE/scripts/generate-store-screenshots.mjs"
# или APP_ROOT=/abs/path/to/app node ...
```

Первый запуск: откроется браузер — войдите в приложение, затем Enter в терминале. Сессия сохранится в `scripts/.auth/session.json`.

Сброс сессии:

```bash
node "$KIT_CLONE/scripts/generate-store-screenshots.mjs" --reset-session
```

Только iOS или только Android:

```bash
node "$KIT_CLONE/scripts/generate-store-screenshots.mjs" --platform=ios
node "$KIT_CLONE/scripts/generate-store-screenshots.mjs" --platform=android
```

Выходные файлы:

```
store-assets/screenshots/
  ios/iphone-6.7/     … 1290×2796 (основной размер App Store)
  ios/iphone-6.5/
  ios/ipad-pro-12.9/
  android/phone/      … 1080×1920
  android/tablet-10/
```

### Что не снять с веба

Экраны с **камерой**, **BLE**, **нативными очками**, **push** и т.п. — только устройство или макет от дизайнера. Перечислите их в `manualNotes` внутри `store-screens.config.json` — скрипт выведет напоминание в конце.

Ссылки на бесплатные мокапы: [Shots.so](https://shots.so), [AppMockUp](https://app-mockup.com).

### Привязка скриншотов к `store.config.json` (iOS)

После генерации добавьте пути в `apple.screenshots` и снова `eas metadata:push`. Для **Google Play** скриншоты часто загружаются вручную в консоли (поддержка в Metadata ограничена — уточняйте в [документации Expo](https://docs.expo.dev/eas/metadata/)).

---

## Часть 3 — Сборка и submit

Команды зависят от вашего `package.json`. Типично:

```bash
eas build --profile production --platform ios
eas submit --profile production -p ios --latest
```

То же для Android. Уточните профили в `eas.json` проекта.

---

## Что разработчик делает только вручную

Ни EAS Metadata, ни скрипт скриншотов это не закрывают.

### App Store Connect (один раз и по релизам)

- Создание записи приложения, цены, доступность по странам
- Анкета **App Privacy** (сбор данных)
- Загрузка скриншотов, которые нельзя получить с веба
- Реальные значения в `apple.review` и рабочий демо-аккаунт для ревью
- Отправка на ревью после загрузки билда

### Google Play Console

- Запись приложения, **рейтинг контента** (IARC), **Data safety**
- **Feature graphic** 1024×500
- Скриншоты и графика по правилам консоли
- Продвижение трека internal → production

### Каждый релиз

- Обновить `releaseNotes` / описания в `store.config.json`
- `eas metadata:push` + новый билд + submit

---

## Troubleshooting

| Проблема | Действие |
|----------|----------|
| `eas metadata:push` и auth | `eas login` |
| Скрипт не открывает приложение | Проверьте `APP_URL` и что `yarn web` запущен |
| Везде экран логина | `--reset-session`, залогиньтесь снова |
| Отклонили из-за privacy URL | Заполните реальный `privacyPolicyUrl` в `store.config.json` |
