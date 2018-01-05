module.exports = {
  extends: `eslint:recommended`,
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    node: true,
  },
  rules: {
    'quotes': [`warn`, `backtick`],
    'indent': [`warn`, 2],
    'no-unused-vars': [`error`, { args: "none" }],
    'no-var': [`error`],
    'max-len': [`warn`, {code: 80, ignoreTemplateLiterals: true}],
    'max-nested-callbacks': [`warn`, {max: 4}],
    'comma-style': [`warn`],
    'comma-dangle': [`warn`, {
        arrays: "always",
        objects: "always",
    }],
    'eol-last': [`warn`],
    'camelcase': [`warn`],
    'semi': [`warn`],
  },
};
