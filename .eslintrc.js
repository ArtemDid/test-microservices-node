// .eslintrc.js
module.exports = {
  extends: ['airbnb-typescript-prettier'],
  settings: {
    react: {
      version: '16.8.2',
    },
  },

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    quotes: ['error', 'single'],
    'no-case-declarations': 'off',
    'import/no-unresolved': 'off',
    'no-param-reassign': 'off',
    'no-console': ['error'],
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'func-names': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.spec.ts'],
      },
    ],
  },
  parserOptions: {
    project: './tsconfig.eslint.json',
    createDefaultProgram: true,
  },
};
