module.exports = {
  extends: `eslint:recommended`,
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    node: true,
  },
  rules: {
    quotes: [`warn`, `backtick`],
    indent: [`warn`, 2],
    'no-unused-vars': [`error`, { args: "none" }],
    'no-var': [`error`],
  },
};
