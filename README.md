# Keywords for Safelight

The Library **Keywords** panel: every keyword in the project, with the number
of photos that carry it, most used first.

- **Filter:** click a keyword to show only the photos that have it. Click more
  to narrow further: a photo must carry every selected keyword. Click a
  selected keyword again to drop it.
- **Search:** the box above the list narrows it to keywords containing what
  you type, in any letter case.
- **Selected keywords** show as chips under the list. The × on a chip drops
  that keyword; **Clear keyword filter** drops them all.

Keywords are added to photos in the Info panel. With none in the project, the
panel says so.

Until Safelight 3.2.0 this panel was built in. It keeps the built-in panel's
id (`core.keywords`), so layouts saved before then keep it where it was.

## Development

```bash
npm install
npm run typecheck
npm run build    # dist/index.js, the file Safelight loads
npm test         # vitest; the bundle checks read dist/, so build first
npm run check    # all three, in that order
```

Safelight hands the extension its own React through `api.react`, so the
bundle never includes React. `src/safelight.d.ts` mirrors the part of the
app's extension API the extension uses.

## License

GPL-3.0-only with an attribution term (GPL v3 §7b), the same licence as Safelight; see LICENSE. Copyright (C) 2026 Anthony Reimche.
