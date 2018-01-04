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
  },
};
