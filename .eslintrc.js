module.exports = {
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  settings: {
    'import/ignore': ['react-native'],
  },
};
