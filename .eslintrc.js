module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    quotes: [1, 'single'], //引号类型 `` "" ''
    'no-unreachable': 1,
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'no-empty': 'warn',
    // semi: 'off',
    'prettier/prettier': [
      'error',
      // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
      {
        singleQuote: true,
        arrowParens: 'avoid',
        endOfLine: 'auto',
        trailingComma: 'none',
        'no-empty': 'off'
      }
    ]
  }
};
