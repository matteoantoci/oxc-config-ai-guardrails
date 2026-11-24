// Patterns that the presets must keep legal. The var line proves that this file is linted.
const build = () => 1;

export const pure = /* @__PURE__ */ build();
export const legacyPure = /* #__PURE__ */ build();

export const missing = (value?: number) => value == null;

export const sign = (value: number) => (value > 0 ? 'positive' : 'other');

export var linted = 'proves that this file is linted';
