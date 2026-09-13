import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2022,
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unknown-property': ['error', { ignore: ['alt'] }],
      'react/prop-types': 'off',
      'no-console': ['warn', {allow: ['warn', 'error']}],
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'scripts/'],
  },
];