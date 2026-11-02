// Proves the package's promises against fixtures:
//   1. every rule in the manifest below is configured by a preset,
//   2. every rule in the manifest actually fires on a fixture,
//   3. the shipped test-file overrides relax what they claim to relax,
//   4. the react preset raises the per-component line budget to 100 for JSX files only.
// The manifest is hardcoded on purpose: deriving it from the configs would make a
// silently dropped rule pass.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const MANIFEST = {
  base: [
    'func-style',
    'prefer-arrow-callback',
    'arrow-body-style',
    'no-var',
    'prefer-const',
    'no-param-reassign',
    'no-plusplus',
    'no-void',
    'no-else-return',
    'no-lonely-if',
    'curly',
    'max-classes-per-file',
    'oxc/no-this-in-exported-function',
    'no-warning-comments',
    'max-lines',
    'max-lines-per-function',
    'max-statements',
    'max-depth',
    'max-params',
    'complexity',
    'max-nested-callbacks',
    'no-await-in-loop',
    'no-continue',
    'no-labels',
    'no-loop-func',
    'guard-for-in',
    'import/no-cycle',
    'import/no-duplicates',
    'import/first',
    'import/newline-after-import',
    'import/no-namespace',
    'import/no-mutable-exports',
    'typescript/no-explicit-any',
    'typescript/no-non-null-assertion',
    'typescript/explicit-module-boundary-types',
    'typescript/method-signature-style',
    'typescript/consistent-type-imports',
    'typescript/no-restricted-types',
    'typescript/no-empty-object-type',
    'typescript/consistent-indexed-object-style',
    'no-restricted-properties',
    'unicorn/prefer-at',
    'unicorn/prefer-negative-index',
    'unicorn/prefer-array-find',
    'unicorn/prefer-array-flat-map',
    'unicorn/prefer-includes',
    'unicorn/prefer-set-has',
    'unicorn/prefer-optional-catch-binding',
    'unicorn/throw-new-error',
    'unicorn/explicit-length-check',
    'unicorn/no-useless-spread',
    'unicorn/prefer-number-properties',
    'prefer-exponentiation-operator',
    'no-eval',
    'no-new-func',
    'no-script-url',
    'oxc/no-async-endpoint-handlers',
  ],
  typescript: [
    'typescript/await-thenable',
    'typescript/no-floating-promises',
    'typescript/no-implied-eval',
    'typescript/no-misused-promises',
    'typescript/no-deprecated',
    'typescript/no-unnecessary-condition',
    'typescript/no-unnecessary-type-assertion',
    'typescript/prefer-nullish-coalescing',
    'typescript/prefer-optional-chain',
    'typescript/switch-exhaustiveness-check',
    'typescript/no-unsafe-argument',
    'typescript/no-unsafe-assignment',
    'typescript/no-unsafe-call',
    'typescript/no-unsafe-member-access',
    'typescript/no-unsafe-return',
    'typescript/no-unsafe-type-assertion',
  ],
  react: [
    'react/rules-of-hooks',
    'react/exhaustive-deps',
    'react/no-unstable-nested-components',
    'react/no-array-index-key',
  ],
};

const readConfig = (name) => JSON.parse(readFileSync(join(repoRoot, 'configs', `${name}.json`), 'utf8'));

const configs = {
  base: readConfig('base'),
  typescript: readConfig('typescript'),
  react: readConfig('react'),
};

const runOxlint = (args) => {
  try {
    return execFileSync('npx', ['oxlint', ...args, '-f', 'json'], { cwd: repoRoot, encoding: 'utf8' });
  } catch (error) {
    if (typeof error.stdout === 'string' && error.stdout.length > 0) {
      return error.stdout;
    }
    throw error;
  }
};

const diagnosticsOf = (args) => JSON.parse(runOxlint(args)).diagnostics ?? [];

const ruleOf = (diagnostic) => /\(([^()]+)\)\s*$/.exec(diagnostic.code)?.[1];

const shortName = (rule) => rule.split('/').at(-1);

const syntaxDiagnostics = diagnosticsOf(['fixtures', '-c', '.oxlintrc.json']);
const typeAwareDiagnostics = diagnosticsOf(['fixtures/type-aware.ts', '-c', '.oxlintrc.json', '--type-aware']);
const reported = new Set([...syntaxDiagnostics, ...typeAwareDiagnostics].map(ruleOf).filter(Boolean));

const failures = [];

for (const [preset, rules] of Object.entries(MANIFEST)) {
  const configured = configs[preset].rules ?? {};
  const inOverrides = (configs[preset].overrides ?? []).flatMap((entry) => Object.keys(entry.rules ?? {}));
  for (const rule of rules) {
    if (!(rule in configured) && !inOverrides.includes(rule)) {
      failures.push(`${preset}: ${rule} is in the manifest but missing from configs/${preset}.json`);
    }
    if (!reported.has(shortName(rule))) {
      failures.push(`${preset}: ${rule} never fired on any fixture`);
    }
  }
}

// Inverse direction: a rule added to a preset without a manifest entry would
// otherwise never be proven to fire.
const manifested = new Set(Object.values(MANIFEST).flat());
const severityOf = (value) => (Array.isArray(value) ? value[0] : value);

for (const [preset, config] of Object.entries(configs)) {
  const entries = [
    ...Object.entries(config.rules ?? {}),
    ...(config.overrides ?? []).flatMap((entry) => Object.entries(entry.rules ?? {})),
  ];
  for (const [rule, value] of entries) {
    if (severityOf(value) !== 'off' && !manifested.has(rule)) {
      failures.push(`${preset}: configs/${preset}.json enables ${rule}, which is missing from the manifest`);
    }
  }
}

// Normalise both sides: oxlint has reported `filename` both as a file:// URL and as a cwd-relative path.
const absolute = (file) => (file.startsWith('file:') ? fileURLToPath(file) : resolve(repoRoot, file));
const rulesFor = (file) =>
  syntaxDiagnostics.filter((diagnostic) => absolute(diagnostic.filename) === absolute(file)).map(ruleOf);

const overrideFile = 'fixtures/overrides.test.ts';
const underCap = 'fixtures/component-under-cap.tsx';
const overCap = 'fixtures/component-over-cap.tsx';
const sizeFile = 'fixtures/size.ts';

// Each checked fixture also breaks other rules. Zero matched diagnostics means the filename
// match broke, which would make the negative checks below pass without testing anything.
for (const fixture of [overrideFile, underCap, overCap, sizeFile]) {
  if (rulesFor(fixture).length === 0) {
    failures.push(`${fixture}: no diagnostics matched, so the checks on this file prove nothing`);
  }
}

const relaxed = Object.keys(configs.base.overrides[0].rules).map(shortName);
const overrideRules = rulesFor(overrideFile);
const leaked = [...new Set(overrideRules.filter((rule) => relaxed.includes(rule)))];

if (leaked.length > 0) {
  failures.push(`${overrideFile}: test overrides did not apply, still reporting ${leaked.join(', ')}`);
}
if (!overrideRules.includes('prefer-const')) {
  failures.push(`${overrideFile}: expected prefer-const to still fire, so the file is provably linted`);
}

if (rulesFor(underCap).includes('max-lines-per-function')) {
  failures.push(`${underCap}: 85-line component should fit the react 100-line budget`);
}
if (!rulesFor(overCap).includes('max-lines-per-function')) {
  failures.push(`${overCap}: 110-line component should exceed the react 100-line budget`);
}
if (!rulesFor(sizeFile).includes('max-lines-per-function')) {
  failures.push(`${sizeFile}: non-JSX file should keep the base 50-line budget`);
}

const total = Object.values(MANIFEST).flat().length;
console.log(`syntax diagnostics:     ${syntaxDiagnostics.length}`);
console.log(`type-aware diagnostics: ${typeAwareDiagnostics.length}`);
console.log(`rules in manifest:      ${total}`);
console.log(`checks failed:          ${failures.length}`);

if (failures.length > 0) {
  console.log('');
  for (const failure of failures) {
    console.log(`  FAIL ${failure}`);
  }
  process.exit(1);
}

console.log('\nEvery configured rule fires. Test overrides and the react line budget hold.');
