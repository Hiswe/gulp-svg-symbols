module.exports = {
  extends: `eslint:recommended`,
  parserOptions: {
    ecmaVersion: 6,
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'quotes': [`warn`, `backtick`],
    'indent': [`warn`, 2],
    'no-unused-vars': [`error`, { args: "none" }],
    'no-var': [`error`],
    'max-len': [`warn`, {
      code: 80,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
    }],
    'max-nested-callbacks': [`warn`, {max: 4}],
    'comma-style': [`warn`],
    'comma-spacing': [`warn`],
    'comma-dangle': [`warn`, {
        arrays: "always",
        objects: "always",
    }],
    'eol-last': [`warn`],
    'camelcase': [`warn`],
    'semi': [`warn`],
  },
};
