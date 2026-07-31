type OxlintConfig = {
  plugins?: string[];
  categories?: Record<string, string>;
  rules?: Record<string, unknown>;
  overrides?: { files: string[]; rules?: Record<string, unknown> }[];
};

type OxfmtConfig = Record<string, unknown>;

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
