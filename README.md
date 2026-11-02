# oxc-config-ai-guardrails

Strict [oxlint](https://oxc.rs/docs/guide/usage/linter.html) presets and an [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) profile that keep AI-generated code small, flat and functional.

This is the oxc counterpart of [`eslint-config-ai-guardrails`](https://www.npmjs.com/package/eslint-config-ai-guardrails). It is not a port. Every rule is native to oxlint, so there are no ESLint plugin dependencies and no alpha `jsPlugins`.

- 78 rules across three presets, each one proven to fire by `npm run verify`
- 2 peer dependencies instead of 17
- comments are allowed; placeholder comments are not

## Install

```sh
npm i -D oxlint oxfmt oxc-config-ai-guardrails
```

Add `oxlint-tsgolint` only if you want the type-aware preset:

```sh
npm i -D oxlint-tsgolint
```

## Use

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

`.oxfmtrc.json` — oxfmt has no `extends`, so import the profile from a TS config:

```ts
import { defineConfig } from 'oxfmt';
import { oxfmt } from 'oxc-config-ai-guardrails';

export default defineConfig(oxfmt);
```

Scripts:

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

## Presets

| Preset | Rules | Needs |
|---|---|---|
| `configs/base.json` | 58 syntax-level rules, plus the `correctness`, `suspicious` and `perf` categories | oxlint only |
| `configs/typescript.json` | 16 type-aware rules | `oxlint-tsgolint` and `--type-aware` |
| `configs/react.json` | 4 React rules, and a 100-line budget for `.tsx`/`.jsx` | oxlint only |
| `configs/oxfmt.json` | 120 columns, single quotes, sorted imports | oxfmt only |

Both `base` and `typescript` ship `overrides` that relax the noisiest rules in `*.test.*`, `*.spec.*` and `test/` files.

## What changed from eslint-config-ai-guardrails

Cut:

| Removed | Reason |
|---|---|
| `no-comments/disallowComments` | Comments help AI-assisted work. Replaced by `no-warning-comments`, which bans leftover `TODO`, `FIXME`, `XXX` and `HACK`. |
| `sonarjs/*` (217 rules) | No native equivalent. `complexity`, `max-*` and the `oxc/*` rules carry the signal. |
| `security/*` (13 rules) | Regex heuristics. `no-eval`, `no-implied-eval`, `no-new-func`, `no-script-url` and `oxc/no-async-endpoint-handlers` cover the real defects. |
| `prettier/prettier`, `eslint-config-prettier`, `import/order` | oxfmt formats and sorts imports. |
| `unicorn/recommended` | 306 entries with 10 switched back off. Replaced by 11 explicit picks plus categories. |

Retuned:

| Rule | Was | Is | Reason |
|---|---|---|---|
| `max-params` | 2 | 3 | 2 rejects `reduce((acc, item, index) => …)`. |
| `no-magic-numbers` | `ignore: [0,1,-1,2]` | plus `ignoreDefaultValues`, `ignoreEnums`, `ignoreNumericLiteralTypes` | Status codes, ports and timeouts declared as enums, literal types or default values are named already. |
| `no-param-reassign` | `"error"` | `{ props: true }` | The old setting still allowed `param.field = x`. |
| `prefer-const` | `destructuring: "all"` | `destructuring: "any"` | `"all"` lets a whole destructuring stay `let`. |

Swapped for native rules:

| Was | Is |
|---|---|
| `prefer-arrow-functions/prefer-arrow-functions`, `func-names` | `func-style: ["error", "expression"]` |
| `functional/no-classes`, `no-class-inheritance`, `no-this-expressions` | `max-classes-per-file: ["error", 0]`, `oxc/no-this-in-exported-function` |
| `functional/prefer-property-signatures` | `typescript/method-signature-style: ["error", "property"]` |
| `no-restricted-syntax` (`void`) | `no-void` |
| `no-restricted-syntax` (`as unknown as`) | `typescript/no-unsafe-type-assertion` (type-aware, catches every unsafe assertion) |
| `no-restricted-syntax` (`else`) | `no-else-return: { allowElseIf: false }`, `no-lonely-if` |

Added: `typescript/no-misused-promises`, `typescript/switch-exhaustiveness-check`, `typescript/consistent-type-imports`, `typescript/explicit-module-boundary-types`, `no-warning-comments`, `no-plusplus`, `no-await-in-loop`, `max-nested-callbacks`, `unicorn/prefer-number-properties` (global `isNaN`/`isFinite`) and `prefer-exponentiation-operator` (`Math.pow`). `explicit-module-boundary-types` makes every exported function declare its parameter and return types, but leaves internal helpers inferred; it does not run on `.js` files. `unicorn/prefer-number-properties` and `prefer-exponentiation-operator` cover the airbnb `no-restricted-properties` entries that no other rule here catches. Unlike that list, they also catch a bare `isNaN(x)`.

`explicit-module-boundary-types` also applies to exported React components in `.tsx` files. Declare the return type on each one, for example `export const Button = ({ label }: Props): ReactElement => <button>{label}</button>;`. This is deliberate: the props type and the return type are the component's public contract.

Added to reject fabricated type evidence, which the original never covered:

| Rule | Rejects |
|---|---|
| `no-restricted-properties` | `Reflect.get` and `Reflect.apply`, which launder an unsound access into `any` without an assertion. Also `vi.mock`, `vi.doMock` and `jest.mock`. Matching is by identifier name, so an aliased import escapes. |
| `typescript/no-restricted-types` | the broad `object` type, plus `Record<string, unknown>` and `Record<string, any>` dictionary contracts. |
| `typescript/no-empty-object-type` | `{}`, which accepts every non-nullish value. |
| `typescript/consistent-indexed-object-style` | `{ [key: string]: T }`, rewritten to `Record` form so the rule above can judge the value type. |

## Two oxlint traps this package works around

1. **A bare rule key can resolve to a type-aware rule.** `no-implied-eval` exists only as the tsgolint rule, so it silently never runs without `--type-aware`. It lives in `configs/typescript.json` for that reason.
2. **Unknown rule options are ignored without an error.** A typo in a rule option does not fail the run. That is why `npm run verify` asserts behaviour instead of trusting the config.

## Verify

```sh
npm run verify
```

The script lints `fixtures/` and checks five claims:

1. every rule in its hardcoded manifest is present in the presets,
2. every rule in the manifest fires on a fixture,
3. the test-file overrides relax what they promise, while `prefer-const` still fires in the same file (proof the file was linted),
4. an 85-line component passes and a 110-line component fails, while a 51-line non-JSX function fails — proof the React budget applies to JSX only.
5. each fixture used by claims 3 and 4 has at least one diagnostic, so a broken filename match fails instead of passing silently.

Current output:

```
syntax diagnostics:     364
type-aware diagnostics: 39
rules in manifest:      78
checks failed:          0
```

The files in `fixtures/` are deliberate rule violations. Do not copy them.

## Licence

MIT
