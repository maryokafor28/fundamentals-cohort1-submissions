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
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'build/**',
			'dist/**',
			'next-env.d.ts',
			'*.config.js',
			'*.config.ts',
		],
	},
	{
		rules: {
			// TypeScript specific rules
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/prefer-const': 'error',
			
			// React specific rules
			'react-hooks/exhaustive-deps': 'warn',
			'react/jsx-key': 'error',
			'react/no-unescaped-entities': 'warn',
			
			// Next.js specific rules
			'@next/next/no-img-element': 'warn',
			'@next/next/no-html-link-for-pages': 'error',
			
			// General code quality
			'prefer-const': 'error',
			'no-var': 'error',
			'no-console': 'warn',
			'no-debugger': 'error',
		},
	},
];

export default eslintConfig;
