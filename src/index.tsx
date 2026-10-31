// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Registers the Library "Keywords" panel. It was core's built-in
// `core.keywords` until Safelight 3.2.0 and keeps that panel id, so saved
// layouts keep it where it was.

import { KeywordsPanel, keywordsCss } from "./KeywordsPanel";
import { initRuntime } from "./rt";
import type { SafelightAPI } from "./safelight";

export const PANEL_ID = "core.keywords";
export const STYLESHEET_ID = "safelight.keywords.styles";

export function activate(host: SafelightAPI): void {
  initRuntime(host);
  host.registerStylesheet({ id: STYLESHEET_ID, css: keywordsCss(host.ui.tokens) });
  host.registerPanel({
    id: PANEL_ID,
    title: "Keywords",
    component: KeywordsPanel,
    defaultDock: { module: "library", direction: "left", order: 2, width: 240 },
  });
}
