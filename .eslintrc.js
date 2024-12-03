module.exports = {
  settings: {
    react: {
      pragma: 'React',
      fragment: 'Fragment',
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next',
    'plugin:react/recommended',
    'standard',
    'plugin:react/jsx-runtime',
    'prettier',
    'plugin:storybook/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react', '@typescript-eslint', 'testing-library'],
  overrides: [
    // Only uses Testing library lint rules in test files
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off', // Ensure ESLint does not wrongly flag TypeScript types
      },
    },
  ],
  root: true,
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'ignore' }],
    'no-sparse-arrays': 'off',
  },
};
