module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: 'eslint:recommended',
  rules: {
    // // Removed rule disallow the use of console from recommended eslint rules
    'no-console': 'off',
  }
}
