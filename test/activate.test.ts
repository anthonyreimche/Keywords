// What activate() registers: the Keywords panel under core's old panel id,
// title and dock spot (so saved layouts keep it), and the stylesheet that
// gives it core's look.

import { describe, expect, it } from "vitest";
import { CLASSES, KeywordsPanel } from "../src/KeywordsPanel";
import { PANEL_ID, STYLESHEET_ID, activate } from "../src/index";
import { fakeApi } from "./support/fake-api";

describe("activate", () => {
  it("registers exactly the Keywords panel, as core's core.keywords did", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.panels).toHaveLength(1);
    expect(rig.panels[0]).toStrictEqual({
      id: "core.keywords",
      title: "Keywords",
      component: KeywordsPanel,
      defaultDock: { module: "library", direction: "left", order: 2, width: 240 },
    });
    expect(PANEL_ID).toBe("core.keywords");
  });

  it("registers one stylesheet for the panel's classes, coloured from the theme tokens", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.stylesheets.map((s) => s.id)).toEqual([STYLESHEET_ID]);
    const css = rig.stylesheets[0].css;
    for (const cls of Object.values(CLASSES)) expect(css).toContain(`.${cls}`);
    expect(css).toContain(`:where(.${CLASSES.search}) { width: 100%; border-radius: 0.25rem; background-color: var(--color-surface-2);`);
    expect(css).toContain(`:where(.${CLASSES.search})::placeholder { color: var(--color-text-muted); }`);
    expect(css).toContain(`:where(.${CLASSES.search}:focus) { box-shadow: 0 0 0 1px var(--color-accent); }`);
    expect(css).toContain(
      `:where(.${CLASSES.itemActive}) { background-color: color-mix(in oklab, var(--color-accent) 20%, transparent); color: var(--color-text-primary); }`,
    );
    expect(css).toContain(
      `@media (hover: hover) { :where(.${CLASSES.item}:not(.${CLASSES.itemActive}):hover) { background-color: var(--color-surface-2); color: var(--color-text-primary); } }`,
    );
    expect(css).toContain(
      `@media (hover: hover) { :where(.${CLASSES.clear}:hover) { background-color: var(--color-surface-3); color: var(--color-text-primary); } }`,
    );
  });

  it("repeats core's Larger text sizes: 11 px text to 13 px, the 10 px chips to 12 px", () => {
    const rig = fakeApi();
    activate(rig.api);
    const css = rig.stylesheets[0].css;
    expect(css).toContain(
      `html.sl-larger-text :is(.${CLASSES.emptyText}, .${CLASSES.search}, .${CLASSES.item}, .${CLASSES.clear}) { font-size: 13px !important; line-height: 1.45 !important; }`,
    );
    expect(css).toContain(`html.sl-larger-text .${CLASSES.chip} { font-size: 12px !important; }`);
  });

  it("keeps every rule at zero specificity, below any stylesheet that restyles buttons or inputs", () => {
    const rig = fakeApi();
    activate(rig.api);
    const rules = rig.stylesheets[0].css.split("\n").filter((line) => line.includes("{"));
    const plain = rules.filter((line) => !line.includes(":where(") && !line.startsWith("html.sl-larger-text"));
    expect(plain).toEqual([]);
  });
});
