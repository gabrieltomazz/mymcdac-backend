module.exports = {
    env: {
        es2020: true,
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
        indent: ['error', 4],
        'no-tabs': 'off',
        'max-len': 'off',
    },
};
