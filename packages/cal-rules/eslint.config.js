import tsParser from '@typescript-eslint/parser';
import umpire from '@umpire/eslint-plugin';

export default [
  {
    files: ['src/**/*.ts', '__tests__/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  umpire.configs.recommended,
];
