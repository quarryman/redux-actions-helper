'use strict'

const globals = require('globals')

const jest = { }
for (const i in globals.jest) {
  if (i !== 'test' && i !== 'xtest') jest[i] = globals.jest[i]
}
module.exports = {
  extends: [
    'standard',
    'plugin:es5/no-es2015',
    'plugin:es5/no-es2016'
  ],
  plugins: [
    'jest',
    'security',
    'node'
  ],
  rules: {
    "standard/no-callback-literal": "off",
    "semi": [
      "error",
      "always"
    ]
  },
  env: {
    browser: true,
    node: true
  },
  overrides: [
    {
      files: ['test/*.js'],
      rules: {
        'node/no-unpublished-require': 'off'
      },
      globals: jest
    },
    {
      files: ['*.test.js'],
      rules: {
        'jest/valid-expect-in-promise': 'error',
        'jest/prefer-to-be-undefined': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-disabled-tests': 'error',
        'jest/prefer-to-be-null': 'error',
        'jest/no-focused-tests': 'error',
        'jest/valid-expect': 'error'
      },
      globals: jest
    }
  ]
}