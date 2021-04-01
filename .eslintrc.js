module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
  ],
  plugins: [
    'sonarjs',
    'no-loops',
    'promise',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': ['warn', 'windows'],
  },
};
