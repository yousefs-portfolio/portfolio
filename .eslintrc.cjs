module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/', 'build/'],
};
