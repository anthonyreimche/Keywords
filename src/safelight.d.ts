// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The slice of Safelight's extension API this extension touches, mirrored from
// the app's src/extensions/types.ts, src/extensions/ui-kit.tsx,
// src/state/catalog-store.ts, src/state/ui-store.ts and
// src/modules/library/visible-photos.ts. Extensions are standalone bundles, so
// the host's source is not on the type path; React types come from
// @types/react (dev only).

import type { ComponentType } from "react";

export interface StoreApi<T> {
  (): T;
  <U>(selector: (state: T) => U): U;
  getState(): T;
  setState(partial: Partial<T> | ((s: T) => Partial<T>)): void;
  subscribe(listener: (state: T, prev: T) => void): () => void;
}

/** A photo in the open project. Core's also carries its file, rating, flag,
 *  label and metadata, which this extension never reads. */
export interface CatalogPhoto {
  keywords: string[];
}

export interface CatalogStoreState {
  /** Every photo in the open project. */
  photos: CatalogPhoto[];
}

/** The Library grid's filter. Core's also holds the rating, flag and label
 *  filters, which `setFilter` leaves as they are. */
export interface LibraryFilter {
  /** A photo must carry all of these to show (AND). */
  keywords: string[];
}

export interface UIStoreState {
  filter: LibraryFilter;
  /** Merges the patch into the filter. */
  setFilter(patch: Partial<LibraryFilter>): void;
}

export interface PanelDockDefault {
  module: "library" | "develop";
  direction: "left" | "right" | "bottom";
  order?: number;
  width?: number;
  height?: number;
}

export interface PanelContribution {
  /** Globally unique, e.g. "core.histogram" or "my-ext.fancy-curves". */
  id: string;
  title: string;
  component: ComponentType;
  defaultDock?: PanelDockDefault;
}

/** A stylesheet applied to every app window after the core styles. Extension
 *  rules are unlayered, so they win over Tailwind utility classes at equal or
 *  lower specificity; disabling the extension removes the sheet. */
export interface StylesheetContribution {
  id: string;
  css: string;
}

/** The theme's CSS variables as `var(--color-…)` strings. */
export interface UiTokens {
  readonly surface2: string;
  readonly surface3: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly accent: string;
}

export interface SafelightAPI {
  version: 1;
  extensionId: string;
  react: typeof import("react");
  registerPanel(c: PanelContribution): void;
  registerStylesheet(c: StylesheetContribution): void;
  ui: { tokens: UiTokens };
  stores: {
    useCatalogStore: StoreApi<CatalogStoreState>;
    useUIStore: StoreApi<UIStoreState>;
  };
}

export interface ExtensionModule {
  activate(api: SafelightAPI): void;
  deactivate?(): void;
}
