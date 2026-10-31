// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The Library "Keywords" panel: every keyword in the project with its photo
// count; clicking one adds it to the grid's keyword filter.

import { React, api } from "./rt";
import type { UiTokens } from "./safelight";

const P = "safelight-keywords";

export const CLASSES = {
  empty: `${P}-empty`,
  emptyText: `${P}-empty-text`,
  root: P,
  search: `${P}-search`,
  list: `${P}-list`,
  item: `${P}-item`,
  itemActive: `${P}-item-active`,
  name: `${P}-name`,
  count: `${P}-count`,
  selection: `${P}-selection`,
  chips: `${P}-chips`,
  chip: `${P}-chip`,
  chipRemove: `${P}-chip-remove`,
  clear: `${P}-clear`,
} as const;

const C = CLASSES;

/** The look core gave this panel with Tailwind utilities, as plain CSS (the
 *  app's Tailwind build never scans an extension). `:where()` drops the rules
 *  to zero specificity, so any stylesheet that restyles `button` or `input`
 *  (Custom Input Styling, a user's own CSS) wins over them as it wins over
 *  core's layered utilities. The last two rules repeat core's Accessibility ▸
 *  Larger text rules for 11 px and 10 px text. */
export function keywordsCss(t: UiTokens): string {
  const accent20 = `color-mix(in oklab, ${t.accent} 20%, transparent)`;
  return `
:where(.${C.empty}) { padding: 0.75rem; }
:where(.${C.emptyText}) { font-size: 11px; color: ${t.textMuted}; }
:where(.${C.root}) { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; }
:where(.${C.search}) { width: 100%; border-radius: 0.25rem; background-color: ${t.surface2}; padding: 0.25rem 0.5rem; font-size: 11px; color: ${t.textPrimary}; outline-style: none; }
:where(.${C.search})::placeholder { color: ${t.textMuted}; }
:where(.${C.search}:focus) { box-shadow: 0 0 0 1px ${t.accent}; }
:where(.${C.list}) { max-height: 16rem; overflow-y: auto; }
:where(.${C.list} > :not(:last-child)) { margin-block-start: 0; margin-block-end: 0.125rem; }
:where(.${C.item}) { display: flex; width: 100%; align-items: center; justify-content: space-between; border-radius: 0.25rem; padding: 0.25rem 0.5rem; font-size: 11px; color: ${t.textSecondary}; }
:where(.${C.itemActive}) { background-color: ${accent20}; color: ${t.textPrimary}; }
@media (hover: hover) { :where(.${C.item}:not(.${C.itemActive}):hover) { background-color: ${t.surface2}; color: ${t.textPrimary}; } }
:where(.${C.name}) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
:where(.${C.count}) { margin-left: 0.5rem; flex-shrink: 0; color: ${t.textMuted}; }
:where(.${C.selection} > :not(:last-child)) { margin-block-start: 0; margin-block-end: 0.375rem; }
:where(.${C.chips}) { display: flex; flex-wrap: wrap; gap: 0.25rem; }
:where(.${C.chip}) { display: inline-flex; align-items: center; gap: 0.125rem; border-radius: 0.25rem; background-color: ${accent20}; padding: 0.125rem 0.375rem; font-size: 10px; color: ${t.textPrimary}; }
:where(.${C.chipRemove}) { margin-left: 0.125rem; color: ${t.textMuted}; }
@media (hover: hover) { :where(.${C.chipRemove}:hover) { color: ${t.textPrimary}; } }
:where(.${C.clear}) { width: 100%; border-radius: 0.25rem; background-color: ${t.surface2}; padding: 0.25rem 0.5rem; font-size: 11px; color: ${t.textSecondary}; }
@media (hover: hover) { :where(.${C.clear}:hover) { background-color: ${t.surface3}; color: ${t.textPrimary}; } }
html.sl-larger-text :is(.${C.emptyText}, .${C.search}, .${C.item}, .${C.clear}) { font-size: 13px !important; line-height: 1.45 !important; }
html.sl-larger-text .${C.chip} { font-size: 12px !important; }
`;
}

export function KeywordsPanel() {
  const photos = api.stores.useCatalogStore((s) => s.photos);
  const filter = api.stores.useUIStore((s) => s.filter);
  const setFilter = api.stores.useUIStore((s) => s.setFilter);
  const [search, setSearch] = React.useState("");

  const keywordCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of photos) {
      for (const k of p.keywords) {
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [photos]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return keywordCounts;
    return keywordCounts.filter(([k]) => k.toLowerCase().includes(q));
  }, [keywordCounts, search]);

  const activeSet = React.useMemo(() => new Set(filter.keywords), [filter.keywords]);

  const toggleKeyword = (keyword: string) => {
    if (activeSet.has(keyword)) {
      setFilter({ keywords: filter.keywords.filter((k) => k !== keyword) });
    } else {
      setFilter({ keywords: [...filter.keywords, keyword] });
    }
  };

  if (keywordCounts.length === 0) {
    return (
      <div className={C.empty}>
        <p className={C.emptyText}>No keywords yet. Add keywords to photos in the Info panel.</p>
      </div>
    );
  }

  return (
    <div className={C.root}>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search keywords…"
        aria-label="Search keywords"
        className={C.search}
      />
      <div className={C.list}>
        {filtered.map(([keyword, count]) => (
          <button
            key={keyword}
            onClick={() => toggleKeyword(keyword)}
            className={activeSet.has(keyword) ? `${C.item} ${C.itemActive}` : C.item}
          >
            <span className={C.name}>{keyword}</span>
            <span className={C.count}>{count}</span>
          </button>
        ))}
      </div>
      {filter.keywords.length > 0 && (
        <div className={C.selection}>
          <div className={C.chips}>
            {filter.keywords.map((k) => (
              <span key={k} className={C.chip}>
                {k}
                <button
                  onClick={() => toggleKeyword(k)}
                  className={C.chipRemove}
                  aria-label={`Remove ${k} from keyword filter`}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            ))}
          </div>
          <button onClick={() => setFilter({ keywords: [] })} className={C.clear}>
            Clear keyword filter
          </button>
        </div>
      )}
    </div>
  );
}
