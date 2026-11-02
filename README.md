<div align="center">

# oxc-config-ai-guardrails

**Strict [oxlint](https://oxc.rs/docs/guide/usage/linter.html) presets and an [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) profile that keep AI-generated code small, flat and honest about its types.**

[![npm version](https://img.shields.io/npm/v/oxc-config-ai-guardrails?color=blue)](https://www.npmjs.com/package/oxc-config-ai-guardrails)
[![oxlint](https://img.shields.io/badge/oxlint-%E2%89%A51.76-orange)](https://oxc.rs)
[![license](https://img.shields.io/npm/l/oxc-config-ai-guardrails)](./LICENSE)

[🚀 Quick start](#quick-start) · [📦 Presets](#presets) · [🛡️ Rules](#rules) · [❓ FAQ](#faq) · [🤝 Contributing](#contributing)

</div>

---

A coding agent writes code that compiles and looks finished. It also writes 300-line functions, nested `if` blocks, `any` parameters, module mocks that hide the real code, and `TODO` comments that nobody returns to. This package makes oxlint reject those patterns, so the agent must fix them before you review the code.

- ✅ **77 rules, each one proven to fire.** `npm run verify` lints deliberate violations and fails if a rule stays silent.
- ⚡ **Native oxlint only.** There are no ESLint plugins and no `jsPlugins`. The package has 2 peer dependencies.
- 💬 **Comments are allowed.** Placeholder comments (`TODO`, `FIXME`, `XXX`, `HACK`) are not.

## 👀 Example

An agent writes this:

```ts
export async function loadUsers(ids: string[], cache: any) {
  const users = [];
  for (let i = 0; i < ids.length; i++) {
    const user = await fetch(`/api/users/${ids[i]}`).then((r) => r.json());
    if (user) {
      // TODO: handle inactive users
      users.push(Reflect.get(user, 'profile'));
    }
  }
  return users;
}
```

oxlint with the `base` preset rejects it (the output below is shortened):

```text
1:8   error  eslint(func-style): Expected a function expression.
1:23  error  typescript(explicit-module-boundary-types): Missing return type on function
1:48  error  typescript(explicit-module-boundary-types): Argument is explicitly typed as `any`
1:55  error  typescript(no-explicit-any): Unexpected `any`. Specify a different type.
3:35  error  eslint(no-plusplus): Unary operator '++' used.
4:18  error  eslint(no-await-in-loop): Unexpected `await` inside a loop.
5:5   error  eslint(max-depth): Blocks are nested too deeply (2). Maximum allowed is 1.
6:7   error  eslint(no-warning-comments): Unexpected 'todo' comment: TODO: handle inactive users
7:18  error  eslint(no-restricted-properties): 'Reflect.get' is restricted from being used.
```

<a id="quick-start"></a>

## 🚀 Quick start

**1. Install**

```sh
npm i -D oxlint oxfmt oxc-config-ai-guardrails
```

Add `oxlint-tsgolint` only if you want the type-aware preset:

```sh
npm i -D oxlint-tsgolint
```

**2. Configure oxlint**

`.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": [
    "./node_modules/oxc-config-ai-guardrails/configs/base.json",
    "./node_modules/oxc-config-ai-guardrails/configs/typescript.json",
    "./node_modules/oxc-config-ai-guardrails/configs/react.json"
  ]
}
```

Or `oxlint.config.ts`:

```ts
import { defineConfig } from 'oxlint';
import { base, react, typescript } from 'oxc-config-ai-guardrails';

export default defineConfig({ extends: [base, typescript, react] });
```

**3. Configure oxfmt**

oxfmt has no `extends`, so import the profile from `oxfmt.config.ts`:

```ts
import { defineConfig } from 'oxfmt';
import { oxfmt } from 'oxc-config-ai-guardrails';

export default defineConfig(oxfmt);
```

**4. Add scripts**

```json
{
  "scripts": {
    "lint": "oxlint",
    "lint:types": "oxlint --type-aware",
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check"
  }
}
```

<a id="presets"></a>

## 📦 Presets

| Preset | Contents | Needs |
|---|---|---|
| `configs/base.json` | 57 syntax rules, plus the `correctness`, `suspicious` and `perf` categories | oxlint |
| `configs/typescript.json` | 16 type-aware rules | `oxlint-tsgolint` and `--type-aware` |
| `configs/react.json` | 4 React rules, and a 100-line budget for `.tsx` and `.jsx` functions | oxlint |
| `configs/oxfmt.json` | 120 columns, single quotes, sorted imports | oxfmt |

Use only the presets that you need. For a Node project with no React, leave out `react.json`.

`base` and `typescript` relax their noisiest rules in `*.test.*`, `*.spec.*`, `test/`, `tests/` and `__tests__/` files.

<a id="rules"></a>

## 🛡️ What the rules enforce

### 📏 Size budgets

| Rule | Limit | Test files |
|---|---|---|
| `max-lines` | 200 lines for each file | off |
| `max-lines-per-function` | 50 lines (100 in `.tsx`/`.jsx`) | off |
| `max-statements` | 20 for each function | off |
| `max-params` | 3 | on |
| `max-depth` | 1 level of nested blocks | on |
| `complexity` | 10 | on |
| `max-nested-callbacks` | 2 | off |

Blank lines do not count against the line limits.

<details>
<summary>🪜 <b>Flat control flow</b>: no <code>else</code> after <code>return</code>, no <code>continue</code>, no labels, no <code>++</code></summary>

`no-else-return` (also bans `else if`), `no-lonely-if`, `no-continue`, `no-labels`, `no-plusplus`, `no-void`, `curly`, `no-await-in-loop`, `no-loop-func`, `guard-for-in`.

</details>

<details>
<summary>🧩 <b>Functional style</b>: arrow functions, <code>const</code>, no classes, no parameter changes</summary>

`func-style` (expressions only), `prefer-arrow-callback`, `arrow-body-style`, `no-var`, `prefer-const`, `no-param-reassign` (properties too), `max-classes-per-file: 0`, `oxc/no-this-in-exported-function`.

Test files can declare classes.

</details>

<details>
<summary>🔒 <b>Honest types</b>: no <code>any</code>, no fake evidence, typed module boundaries</summary>

| Rule | Rejects |
|---|---|
| `typescript/no-explicit-any` | `any` |
| `typescript/no-non-null-assertion` | `value!` |
| `typescript/explicit-module-boundary-types` | exported functions without parameter and return types |
| `typescript/no-restricted-types` | `object`, `Record<string, unknown>` and `Record<string, any>` |
| `typescript/no-empty-object-type` | `{}`, which accepts every non-nullish value |
| `typescript/consistent-indexed-object-style` | `{ [key: string]: T }`, rewritten to `Record` so the rule above can check it |
| `no-restricted-properties` | `Reflect.get` and `Reflect.apply`, which turn an unsound access into `any` |
| `typescript/no-unsafe-*` (type-aware) | values of type `any` that move through calls, assignments and returns |
| `typescript/no-unsafe-type-assertion` (type-aware) | `as` casts that the compiler cannot prove |

</details>

<details>
<summary>🧪 <b>Test hygiene</b>: no module mocks</summary>

`no-restricted-properties` bans `vi.mock`, `vi.doMock` and `jest.mock`. A module mock hides the real dependency, so a test can pass while the code is broken. Inject the dependency instead.

The match uses identifier names, so an aliased import is not caught.

</details>

<details>
<summary>⏳ <b>Promises and correctness</b> (type-aware)</summary>

`typescript/no-floating-promises`, `typescript/no-misused-promises`, `typescript/await-thenable`, `typescript/switch-exhaustiveness-check`, `typescript/no-unnecessary-condition`, `typescript/no-unnecessary-type-assertion`, `typescript/prefer-nullish-coalescing`, `typescript/prefer-optional-chain`, `typescript/no-deprecated`, `typescript/no-implied-eval`.

</details>

<details>
<summary>🧭 <b>Imports, modern APIs and safety</b></summary>

- **Imports:** `import/no-cycle`, `import/no-duplicates`, `import/first`, `import/newline-after-import`, `import/no-namespace`, `import/no-mutable-exports`, `typescript/consistent-type-imports`.
- **Modern APIs:** 11 `unicorn` rules, for example `prefer-at`, `prefer-array-find`, `prefer-includes`, `prefer-number-properties` and `throw-new-error`. Also `prefer-exponentiation-operator`.
- **Safety:** `no-eval`, `no-new-func`, `no-script-url`, `oxc/no-async-endpoint-handlers`.
- **Comments:** `no-warning-comments` bans `TODO`, `FIXME`, `XXX` and `HACK`.

</details>

<details>
<summary>⚛️ <b>React</b></summary>

`react/rules-of-hooks`, `react/exhaustive-deps`, `react/no-unstable-nested-components`, `react/no-array-index-key`.

</details>

<a id="faq"></a>

## ❓ FAQ

<details>
<summary><b>How do I turn off or change a rule?</b></summary>

Rules in your own config override the extended presets:

```json
{
  "extends": ["./node_modules/oxc-config-ai-guardrails/configs/base.json"],
  "rules": {
    "max-lines": ["error", { "max": 300, "skipBlankLines": true }],
    "no-continue": "off"
  }
}
```

</details>

<details>
<summary><b>Why does every exported React component need a return type?</b></summary>

`typescript/explicit-module-boundary-types` treats an exported component like every other exported function. The props type and the return type are the public contract of the component:

```tsx
export const Button = ({ label }: Props): ReactElement => <button>{label}</button>;
```

The rule does not check `.js` and `.jsx` files, or functions that you do not export.

</details>

<details>
<summary><b>Why is a rule that I added silently not working?</b></summary>

oxlint has two traps:

1. **A bare rule key can resolve to a type-aware rule.** `no-implied-eval` exists only as a tsgolint rule, so it never runs without `--type-aware`. This package keeps it in `configs/typescript.json` for that reason.
2. **oxlint ignores unknown rule options.** A typo in an option does not fail the run. Write a file that must fail, and check that oxlint reports it.

</details>

<a id="contributing"></a>

## 🤝 Contributing

Every rule must fire on a fixture. The verify script enforces this:

```sh
npm install
npm run verify
```

`scripts/verify.mjs` lints `fixtures/` and checks five claims:

1. Every rule in its manifest is in a preset, and every enabled rule is in the manifest.
2. Every rule in the manifest fires on a fixture.
3. The test-file overrides relax what they promise, and `prefer-const` still fires in the same file.
4. An 85-line component passes, a 110-line component fails, and a 51-line non-JSX function fails.
5. Each fixture that claims 3 and 4 use has at least one diagnostic, so a broken filename match fails.

To add a rule:

1. Add it to a file in `configs/`.
2. Add it to `MANIFEST` in `scripts/verify.mjs`.
3. Add a fixture in `fixtures/` that breaks the rule.
4. Run `npm run verify`.

The files in `fixtures/` are deliberate rule violations. Do not copy them.

## 📄 License

[MIT](./LICENSE)
