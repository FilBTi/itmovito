import vanillaExtract from '@antebudimir/eslint-plugin-vanilla-extract';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

import {
  quality,
  stylistic,
  react,
  importX,
  typescript,
} from './eslint-presets/index.js';

export default defineConfig([
  globalIgnores(['.yarn/**', '**/build/**', '.pnp.*']),

  {
    files: ['src/**/*.css.ts'],
    extends: [vanillaExtract.configs.recommended],
  },

  // Основные файлы исходного кода проекта
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
    },

    extends: [
      js.configs.recommended,
      quality,
      react,
      importX,
      typescript,
      stylistic,
    ],

    rules: {
      'no-console': 'error',
    },
  },

  // Конфиг файлы проекта
  {
    files: ['*.config.js', 'eslint-presets/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },

    extends: [js.configs.recommended, quality, importX, stylistic],

    rules: {
      'import-x/no-commonjs': 'error',
      'import-x/no-import-module-exports': 'error',
      'no-restricted-globals': ['error', '__dirname', '__filename'],
    },
  },
]);
