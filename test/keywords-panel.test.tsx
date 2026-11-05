// The Keywords panel in a DOM, over real zustand catalogue and UI stores: the
// empty state, keywords counted across photos and listed most used first,
// search, clicking a keyword to add it to the grid's AND filter and again to
// drop it, the chips and Clear, and the panel following store changes made
// anywhere else (imports, the Info panel, Library Filters' Clear filters).

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CLASSES, KeywordsPanel } from "../src/KeywordsPanel";
import { React, initRuntime } from "../src/rt";
import { NO_FILTER, fakeApi, type FullFilter, type Rig } from "./support/fake-api";

afterEach(cleanup);

function mount(setup: { photos?: string[][]; filter?: Partial<FullFilter> } = {}): Rig {
  const rig = fakeApi(setup);
  initRuntime(rig.api);
  render(<KeywordsPanel />);
  return rig;
}

const EMPTY = "No keywords yet. Add keywords to photos in the Info panel.";
const LIBRARY = [["beach", "sunset"], ["beach", "family"], ["Beach Hut", "beach"], ["sunset"]];

const items = () => [...document.querySelectorAll<HTMLButtonElement>(`.${CLASSES.list} > button`)];
const rows = () => items().map((b) => [b.querySelector(`.${CLASSES.name}`)?.textContent, b.querySelector(`.${CLASSES.count}`)?.textContent]);
const item = (keyword: string) => {
  const found = items().find((b) => b.querySelector(`.${CLASSES.name}`)?.textContent === keyword);
  if (!found) throw new Error(`no keyword row "${keyword}"`);
  return found;
};
const chips = () => [...document.querySelectorAll(`.${CLASSES.chip}`)].map((c) => c.firstChild?.textContent);
const search = () => screen.getByLabelText<HTMLInputElement>("Search keywords");
const keywordsFilter = (rig: Rig) => rig.ui.getState().filter.keywords;

describe("KeywordsPanel", () => {
  it("shows core's empty message when no photo has a keyword", () => {
    mount({ photos: [[], []] });
    expect(document.querySelector(`.${CLASSES.empty} > p.${CLASSES.emptyText}`)?.textContent).toBe(EMPTY);
    expect(screen.queryByLabelText("Search keywords")).toBeNull();
  });

  it("shows the empty message with no photos at all", () => {
    mount();
    expect(screen.getByText(EMPTY)).toBeTruthy();
  });

  it("counts each keyword across photos and lists the most used first, ties in first-seen order", () => {
    mount({ photos: LIBRARY });
    expect(rows()).toEqual([
      ["beach", "3"],
      ["sunset", "2"],
      ["family", "1"],
      ["Beach Hut", "1"],
    ]);
  });

  it("renders the search box with core's placeholder and each keyword as a button", () => {
    mount({ photos: LIBRARY });
    expect(search().placeholder).toBe("Search keywords…");
    expect(search().className).toBe(CLASSES.search);
    expect(document.querySelector(`.${CLASSES.root} > .${CLASSES.list}`)).not.toBeNull();
    expect(items().every((b) => b.className === CLASSES.item)).toBe(true);
  });

  it("narrows the list to keywords containing the search, ignoring case and outer spaces", () => {
    mount({ photos: LIBRARY });
    fireEvent.change(search(), { target: { value: "  BEACH " } });
    expect(rows()).toEqual([
      ["beach", "3"],
      ["Beach Hut", "1"],
    ]);
    fireEvent.change(search(), { target: { value: "zzz" } });
    expect(rows()).toEqual([]);
    expect(screen.queryByText(EMPTY)).toBeNull();
    fireEvent.change(search(), { target: { value: "   " } });
    expect(rows()).toHaveLength(4);
  });

  it("adds a clicked keyword to the filter, after any already there, and leaves the other filter fields", () => {
    const rig = mount({ photos: LIBRARY, filter: { rating: 3, flag: "pick" } });
    fireEvent.click(item("sunset"));
    fireEvent.click(item("beach"));
    expect(rig.patches).toEqual([{ keywords: ["sunset"] }, { keywords: ["sunset", "beach"] }]);
    expect(rig.ui.getState().filter).toEqual({ ...NO_FILTER, rating: 3, flag: "pick", keywords: ["sunset", "beach"] });
  });

  it("marks selected keywords and drops one when it is clicked again", () => {
    const rig = mount({ photos: LIBRARY });
    fireEvent.click(item("beach"));
    expect(item("beach").className).toBe(`${CLASSES.item} ${CLASSES.itemActive}`);
    expect(item("sunset").className).toBe(CLASSES.item);
    fireEvent.click(item("sunset"));
    fireEvent.click(item("beach"));
    expect(keywordsFilter(rig)).toEqual(["sunset"]);
    expect(item("beach").className).toBe(CLASSES.item);
  });

  it("shows a chip per selected keyword, in filter order, with Clear, only while some are selected", () => {
    mount({ photos: LIBRARY, filter: { keywords: ["family", "beach"] } });
    expect(chips()).toEqual(["family", "beach"]);
    expect(screen.getByText("Clear keyword filter")).toBeTruthy();
    cleanup();
    mount({ photos: LIBRARY });
    expect(document.querySelector(`.${CLASSES.selection}`)).toBeNull();
    expect(screen.queryByText("Clear keyword filter")).toBeNull();
  });

  it("drops a keyword from its chip's × button", () => {
    const rig = mount({ photos: LIBRARY, filter: { keywords: ["family", "beach"] } });
    const remove = screen.getByLabelText<HTMLButtonElement>("Remove family from keyword filter");
    expect(remove.className).toBe(CLASSES.chipRemove);
    expect(remove.querySelector('span[aria-hidden="true"]')?.textContent).toBe("×");
    fireEvent.click(remove);
    expect(keywordsFilter(rig)).toEqual(["beach"]);
    expect(chips()).toEqual(["beach"]);
  });

  it("keeps a chip for a selected keyword the search hides", () => {
    mount({ photos: LIBRARY, filter: { keywords: ["family"] } });
    fireEvent.change(search(), { target: { value: "sun" } });
    expect(rows()).toEqual([["sunset", "2"]]);
    expect(chips()).toEqual(["family"]);
  });

  it("clears every keyword, and only the keywords, from Clear keyword filter", () => {
    const rig = mount({ photos: LIBRARY, filter: { label: "red", keywords: ["family", "beach"] } });
    fireEvent.click(screen.getByText("Clear keyword filter"));
    expect(rig.patches).toEqual([{ keywords: [] }]);
    expect(rig.ui.getState().filter).toEqual({ ...NO_FILTER, label: "red" });
    expect(chips()).toEqual([]);
    expect(items().every((b) => b.className === CLASSES.item)).toBe(true);
  });

  it("follows photos and keywords changing in the catalogue", () => {
    const rig = mount();
    act(() => rig.catalog.setState({ photos: [{ keywords: ["dog"] }, { keywords: ["dog", "park"] }] }));
    expect(rows()).toEqual([
      ["dog", "2"],
      ["park", "1"],
    ]);
    act(() => rig.catalog.setState({ photos: [] }));
    expect(screen.getByText(EMPTY)).toBeTruthy();
  });

  it("follows the filter being reset elsewhere", () => {
    const rig = mount({ photos: LIBRARY, filter: { keywords: ["beach"] } });
    act(() => rig.ui.setState({ filter: NO_FILTER }));
    expect(chips()).toEqual([]);
    expect(item("beach").className).toBe(CLASSES.item);
  });
});
