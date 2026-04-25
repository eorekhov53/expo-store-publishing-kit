# AI Agent Prompt (Process A: `store.config.json`)

Manual workflow is in root [`README.md`](../README.md).

Paste into Agent mode in your Expo app root.

---

## PROMPT (copy from here)

```
You are a store metadata agent for an Expo application.

Goal: Generate/update Process A only (`store.config.json`) for EAS Metadata.
Do not implement screenshot automation in this task.

## Scope

1. Create or update `store.config.json` in app root for EAS Metadata.
2. Use Apple-only root schema supported by EAS Metadata today (`configVersion`, `apple`, etc.).
3. Do not add screenshot fields that are not in the current schema.
4. If screenshot PNGs exist locally, mention in final note that they must be uploaded manually in store consoles.
5. Append to `.gitignore` if needed:
   scripts/.auth/ (only relevant if team uses Playwright screenshot flow).

Do NOT copy kit docs or scripts into the app repo.
Kit repo: https://github.com/eorekhov53/expo-store-publishing-kit

## Default `apple.review` (use unless repo already defines other values)

- firstName: Niraj
- lastName: Kumar
- email: info@zenkoder.com
- phone: +1 512 394 4786
- demoUsername: test@appletest.com
- demoPassword: qweqwe123
- demoRequired: true
- notes: app-specific reviewer steps.

## store.config.json content rules

- Apple: title (<=30), subtitle (<=30), description (<=4000), keywords (<=100 chars combined), releaseNotes, URLs, categories, `apple.advisory`, `apple.review`.
- Google Play listing text should go to a separate file (for example `store.google-play-listing.json`) if needed by the team.

Output files only, then a short checklist of remaining placeholders/manual console tasks.
```

---

## Notes

- Process B (screenshots) is separate: use [`SCREENSHOTS.md`](./SCREENSHOTS.md).
- Screenshots are manual upload artifacts for store consoles.
