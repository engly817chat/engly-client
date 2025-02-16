import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import pluginQuery from '@tanstack/eslint-plugin-query'
import eslintPluginBoundaries from 'eslint-plugin-boundaries'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  ...pluginQuery.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      boundaries: eslintPluginBoundaries,
      query: pluginQuery,
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/ignore': ['**/*.test.*'],
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'app',
        },
        {
          type: 'views',
          pattern: 'src/views/*',
          capture: ['view'],
        },
        {
          type: 'widgets',
          pattern: 'widgets/*',
          capture: ['widget'],
        },
        {
          type: 'features',
          pattern: 'features/*',
          capture: ['feature'],
        },
        {
          type: 'entities',
          pattern: 'entities/*',
          capture: ['entity'],
        },
        {
          type: 'shared',
          pattern: 'shared/*',
          capture: ['segment'],
        },
      ],
    },
    rules: {
      'boundaries/entry-point': [
        2,
        {
          default: 'disallow',
          rules: [
            // app/providers
            {
              target: [
                [
                  'app',
                  {
                    segment: 'providers',
                  },
                ],
              ],
              allow: ['index.ts', '*.(ts|tsx)'],
            },
            // shared/api
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'api',
                  },
                ],
              ],
              allow: ['index.ts', '*.(ts|tsx)'],
            },
            // shared/hooks
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'hooks',
                  },
                ],
              ],
              allow: ['index.ts', '*.(ts|tsx)'],
            },
            // shared/utils
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'utils',
                  },
                ],
              ],
              allow: ['index.ts', '*.(ts|tsx)'],
            },
            // shared/lib
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'lib',
                  },
                ],
              ],
              allow: 'index.ts',
            },
            // shared/constants
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'constants',
                  },
                ],
              ],
              allow: 'index.ts',
            },
            // shared/types
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'types',
                  },
                ],
              ],
              allow: 'index.ts',
            },
            // shared/ui
            {
              target: [
                [
                  'shared',
                  {
                    segment: 'ui',
                  },
                ],
              ],
              allow: '**',
            },
            {
              target: ['app', 'views', 'widgets', 'features', 'entities'],
              allow: 'index.(ts|tsx)',
            },
          ],
        },
      ],
      'boundaries/element-types': [
        2,
        {
          default: 'disallow',
          message: '${file.type} is not allowed to import (${dependency.type})',
          rules: [
            {
              from: 'shared',
              allow: ['shared'],
              disallow: ['app', 'views', 'widgets', 'features', 'entities'],
              message:
                'Shared module must not import upper layers (${dependency.type})',
            },
            {
              from: 'entities',
              allow: ['shared'],
              disallow: ['app', 'views', 'widgets', 'features'],
              message:
                'Entity must not import upper layers (${dependency.type})',
            },
            {
              from: ['entities'],
              message: 'Entity must not import other entity',
              disallow: [
                [
                  'entities',
                  {
                    entity: '!${entity}',
                  },
                ],
              ],
            },
            {
              from: 'features',
              allow: ['entities', 'shared'],
              disallow: ['app', 'views', 'widgets'],
              message:
                'Feature must not import upper layers (${dependency.type})',
            },
            {
              from: ['features'],
              message: 'Feature must not import other feature',
              disallow: [
                [
                  'features',
                  {
                    feature: '!${feature}',
                  },
                ],
              ],
            },
            {
              from: 'widgets',
              allow: ['features', 'entities', 'shared'],
              disallow: ['app', 'views'],
              message:
                'Feature must not import upper layers (${dependency.type})',
            },
            {
              from: ['widgets'],
              message: 'Widget must not import other widget',
              disallow: [
                [
                  'widgets',
                  {
                    widget: '!${widget}',
                  },
                ],
              ],
            },
            {
              from: 'views',
              allow: ['widgets', 'features', 'entities', 'shared'],
              disallow: ['app'],
              message: 'View must not import upper layers (${dependency.type})',
            },
            {
              from: ['views'],
              message: 'View must not import other view',
              disallow: [
                [
                  'views',
                  {
                    page: '!${page}',
                  },
                ],
              ],
            },
            {
              from: 'app',
              allow: ['views', 'widgets', 'features', 'entities', 'shared'],
            },
          ],
        },
      ],
    },
  },
]

export default eslintConfig
