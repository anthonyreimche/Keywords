//#region src/rt.ts
var e, t;
function n(n) {
	t = n, e = n.react;
}
//#endregion
//#region src/KeywordsPanel.tsx
var r = "safelight-keywords", i = {
	empty: `${r}-empty`,
	emptyText: `${r}-empty-text`,
	root: r,
	search: `${r}-search`,
	list: `${r}-list`,
	item: `${r}-item`,
	itemActive: `${r}-item-active`,
	name: `${r}-name`,
	count: `${r}-count`,
	selection: `${r}-selection`,
	chips: `${r}-chips`,
	chip: `${r}-chip`,
	chipRemove: `${r}-chip-remove`,
	clear: `${r}-clear`
};
function a(e) {
	let t = `color-mix(in oklab, ${e.accent} 20%, transparent)`;
	return `
:where(.${i.empty}) { padding: 0.75rem; }
:where(.${i.emptyText}) { font-size: 11px; color: ${e.textMuted}; }
:where(.${i.root}) { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; }
:where(.${i.search}) { width: 100%; border-radius: 0.25rem; background-color: ${e.surface2}; padding: 0.25rem 0.5rem; font-size: 11px; color: ${e.textPrimary}; outline-style: none; }
:where(.${i.search})::placeholder { color: ${e.textMuted}; }
:where(.${i.search}:focus) { box-shadow: 0 0 0 1px ${e.accent}; }
:where(.${i.list}) { max-height: 16rem; overflow-y: auto; }
:where(.${i.list} > :not(:last-child)) { margin-block-start: 0; margin-block-end: 0.125rem; }
:where(.${i.item}) { display: flex; width: 100%; align-items: center; justify-content: space-between; border-radius: 0.25rem; padding: 0.25rem 0.5rem; font-size: 11px; color: ${e.textSecondary}; }
:where(.${i.itemActive}) { background-color: ${t}; color: ${e.textPrimary}; }
@media (hover: hover) { :where(.${i.item}:not(.${i.itemActive}):hover) { background-color: ${e.surface2}; color: ${e.textPrimary}; } }
:where(.${i.name}) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
:where(.${i.count}) { margin-left: 0.5rem; flex-shrink: 0; color: ${e.textMuted}; }
:where(.${i.selection} > :not(:last-child)) { margin-block-start: 0; margin-block-end: 0.375rem; }
:where(.${i.chips}) { display: flex; flex-wrap: wrap; gap: 0.25rem; }
:where(.${i.chip}) { display: inline-flex; align-items: center; gap: 0.125rem; border-radius: 0.25rem; background-color: ${t}; padding: 0.125rem 0.375rem; font-size: 10px; color: ${e.textPrimary}; }
:where(.${i.chipRemove}) { margin-left: 0.125rem; color: ${e.textMuted}; }
@media (hover: hover) { :where(.${i.chipRemove}:hover) { color: ${e.textPrimary}; } }
:where(.${i.clear}) { width: 100%; border-radius: 0.25rem; background-color: ${e.surface2}; padding: 0.25rem 0.5rem; font-size: 11px; color: ${e.textSecondary}; }
@media (hover: hover) { :where(.${i.clear}:hover) { background-color: ${e.surface3}; color: ${e.textPrimary}; } }
html.sl-larger-text :is(.${i.emptyText}, .${i.search}, .${i.item}, .${i.clear}) { font-size: 13px !important; line-height: 1.45 !important; }
html.sl-larger-text .${i.chip} { font-size: 12px !important; }
`;
}
function o() {
	let n = t.stores.useCatalogStore((e) => e.photos), r = t.stores.useUIStore((e) => e.filter), a = t.stores.useUIStore((e) => e.setFilter), [o, s] = e.useState(""), c = e.useMemo(() => {
		let e = /* @__PURE__ */ new Map();
		for (let t of n) for (let n of t.keywords) e.set(n, (e.get(n) ?? 0) + 1);
		return [...e.entries()].sort((e, t) => t[1] - e[1]);
	}, [n]), l = e.useMemo(() => {
		let e = o.trim().toLowerCase();
		return e ? c.filter(([t]) => t.toLowerCase().includes(e)) : c;
	}, [c, o]), u = e.useMemo(() => new Set(r.keywords), [r.keywords]), d = (e) => {
		u.has(e) ? a({ keywords: r.keywords.filter((t) => t !== e) }) : a({ keywords: [...r.keywords, e] });
	};
	return c.length === 0 ? /* @__PURE__ */ e.createElement("div", { className: i.empty }, /* @__PURE__ */ e.createElement("p", { className: i.emptyText }, "No keywords yet. Add keywords to photos in the Info panel.")) : /* @__PURE__ */ e.createElement("div", { className: i.root }, /* @__PURE__ */ e.createElement("input", {
		value: o,
		onChange: (e) => s(e.target.value),
		placeholder: "Search keywords…",
		"aria-label": "Search keywords",
		className: i.search
	}), /* @__PURE__ */ e.createElement("div", { className: i.list }, l.map(([t, n]) => /* @__PURE__ */ e.createElement("button", {
		key: t,
		onClick: () => d(t),
		className: u.has(t) ? `${i.item} ${i.itemActive}` : i.item
	}, /* @__PURE__ */ e.createElement("span", { className: i.name }, t), /* @__PURE__ */ e.createElement("span", { className: i.count }, n)))), r.keywords.length > 0 && /* @__PURE__ */ e.createElement("div", { className: i.selection }, /* @__PURE__ */ e.createElement("div", { className: i.chips }, r.keywords.map((t) => /* @__PURE__ */ e.createElement("span", {
		key: t,
		className: i.chip
	}, t, /* @__PURE__ */ e.createElement("button", {
		onClick: () => d(t),
		className: i.chipRemove,
		"aria-label": `Remove ${t} from keyword filter`
	}, /* @__PURE__ */ e.createElement("span", { "aria-hidden": "true" }, "×"))))), /* @__PURE__ */ e.createElement("button", {
		onClick: () => a({ keywords: [] }),
		className: i.clear
	}, "Clear keyword filter")));
}
//#endregion
//#region src/index.tsx
var s = "core.keywords", c = "safelight.keywords.styles";
function l(e) {
	n(e), e.registerStylesheet({
		id: c,
		css: a(e.ui.tokens)
	}), e.registerPanel({
		id: s,
		title: "Keywords",
		component: o,
		defaultDock: {
			module: "library",
			direction: "left",
			order: 2,
			width: 240
		}
	});
}
//#endregion
export { s as PANEL_ID, c as STYLESHEET_ID, l as activate };

//# sourceMappingURL=index.js.map