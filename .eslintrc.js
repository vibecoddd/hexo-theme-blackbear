module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jquery: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // 自定义规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // 代码风格
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    
    // 最佳实践
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // 安全性
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error'
  },
  globals: {
    // Hexo全局变量
    'config': 'readonly',
    'theme': 'readonly',
    'page': 'readonly',
    'site': 'readonly',
    
    // jQuery
    '$': 'readonly',
    'jQuery': 'readonly',
    
    // 第三方库
    'Slideout': 'readonly',
    'AV': 'readonly',
    'MathJax': 'readonly',
    'fancybox': 'readonly'
  }
};