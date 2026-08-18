type RuleSeverity = 'off' | 'warn' | 'error';

type RuleEntry = RuleSeverity | [RuleSeverity, ...unknown[]];

type OxlintOverride = {
  files: string[];
  rules?: Record<string, RuleEntry>;
};

type OxlintConfig = {
  $schema?: string;
  plugins?: string[];
  categories?: Record<string, RuleSeverity>;
  rules?: Record<string, RuleEntry>;
  overrides?: OxlintOverride[];
};

type SortImportsConfig = {
  newlinesBetween: boolean;
  groups: (string | string[])[];
};

type OxfmtConfig = {
  $schema?: string;
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  quoteProps: 'as-needed' | 'consistent' | 'preserve';
  trailingComma: 'none' | 'es5' | 'all';
  bracketSpacing: boolean;
  bracketSameLine: boolean;
  arrowParens: 'always' | 'avoid';
  endOfLine: 'lf' | 'crlf' | 'cr' | 'auto';
  insertFinalNewline: boolean;
  sortImports: SortImportsConfig;
};

export declare const base: OxlintConfig;
export declare const typescript: OxlintConfig;
export declare const react: OxlintConfig;
export declare const oxfmt: OxfmtConfig;

declare const configs: {
  base: OxlintConfig;
  typescript: OxlintConfig;
  react: OxlintConfig;
  oxfmt: OxfmtConfig;
};

export default configs;
