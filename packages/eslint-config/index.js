module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    es2017: true,
    es2020: true,
    jest: true,
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unsafe-call": 0,
    "@typescript-eslint/no-unsafe-return": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/no-unsafe-member-access": 0,
    "@typescript-eslint/no-var-requires": 0,
    camelcase: 0,
    "@typescript-eslint/naming-convention": 1,
    "@typescript-eslint/no-floating-promises": [2, { ignoreIIFE: true }],
    "@typescript-eslint/restrict-template-expressions": 1,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
