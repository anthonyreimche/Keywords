// A stand-in Safelight API over real React and zustand. The catalog store holds
// the project's photos; the UI store holds the Library filter with core's
// rating, flag and label fields beside the keywords, and merges setFilter
// patches the way core's does. Every setFilter patch is recorded, and so is
// every registration.

import * as React from "react";
import { create } from "zustand";
import type {
  CatalogStoreState,
  LibraryFilter,
  PanelContribution,
  SafelightAPI,
  StoreApi,
  StylesheetContribution,
  UIStoreState,
  UiTokens,
} from "../../src/safelight";

export const TOKENS: UiTokens = {
  surface2: "var(--color-surface-2)",
  surface3: "var(--color-surface-3)",
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textMuted: "var(--color-text-muted)",
  accent: "var(--color-accent)",
};

/** Core's whole filter. The store holds all of it, so tests can see setFilter
 *  leave the fields this extension never touches. */
export interface FullFilter extends LibraryFilter {
  rating: number;
  ratingOp: "lt" | "lte" | "gt" | "gte" | "eq" | "neq";
  flag: "any" | "pick" | "reject";
  label: string;
}

export const NO_FILTER: FullFilter = { rating: 0, ratingOp: "gte", flag: "any", label: "any", keywords: [] };

export interface Rig {
  api: SafelightAPI;
  catalog: StoreApi<CatalogStoreState>;
  ui: StoreApi<UIStoreState>;
  /** Every setFilter patch, in order. */
  patches: Partial<LibraryFilter>[];
  panels: PanelContribution[];
  stylesheets: StylesheetContribution[];
}

/** One photo per entry, carrying those keywords. */
export function fakeApi(
  { photos = [], filter = {} }: { photos?: string[][]; filter?: Partial<FullFilter> } = {},
): Rig {
  const patches: Partial<LibraryFilter>[] = [];
  const panels: PanelContribution[] = [];
  const stylesheets: StylesheetContribution[] = [];
  const catalog: StoreApi<CatalogStoreState> = create<CatalogStoreState>()(() => ({
    photos: photos.map((keywords) => ({ keywords })),
  }));
  const ui: StoreApi<UIStoreState> = create<UIStoreState>()((set) => ({
    filter: { ...NO_FILTER, ...filter },
    setFilter: (patch) => {
      patches.push(patch);
      set((s) => ({ filter: { ...s.filter, ...patch } }));
    },
  }));
  const api: SafelightAPI = {
    version: 1,
    extensionId: "safelight.keywords",
    react: React,
    registerPanel: (c) => void panels.push(c),
    registerStylesheet: (c) => void stylesheets.push(c),
    ui: { tokens: TOKENS },
    stores: { useCatalogStore: catalog, useUIStore: ui },
  };
  return { api, catalog, ui, patches, panels, stylesheets };
}
