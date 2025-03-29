import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // 👇 ここから明示的にルールを追加！
  {
    rules: {
      quotes: ['error', 'single'], // ← シングルクォートを明示指定！
    },
  },
];
export default eslintConfig;
