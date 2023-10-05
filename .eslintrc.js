module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  Plugin: [
    "@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  extends: [
    'airbnb-base',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 0,
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 0,
    'global-require': 0,
    'eslint linebreak-style': [0, 'error', 'windows']
  }
};
