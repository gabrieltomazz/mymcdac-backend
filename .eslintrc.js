module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 'off',
    camelcase: 'off',
    'no-param-reassign': 0,
  },
};
