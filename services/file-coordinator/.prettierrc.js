module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  importOrder: [
    '^@core/(.*)$',
    '^@business/(.*)$',
    '^@data/(.*)$',
    '^@dtos/(.*)$',
    '^@entities/(.*)$',
    '^@interfaces/(.*)$',
    '^@utils/(.*)$',
    '^[./]',
  ],
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-sql'],
  importOrderParserPlugins: ['typescript'],
  importOrderTypeScriptVersion: '5.3.3',
  overrides: [
    {
      files: '*.sql',
      options: {
        language: 'postgresql',
      },
    },
  ],
};
