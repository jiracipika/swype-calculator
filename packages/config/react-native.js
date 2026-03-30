const base = require("./eslint-base");

module.exports = {
  ...base,
  extends: [
    ...base.extends,
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "react-hooks"],
  env: {
    ...base.env,
    browser: true,
    "react-native/react-native": true,
  },
  parserOptions: {
    ...base.parserOptions,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    ...base.rules,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-native/no-inline-styles": "warn",
  },
  settings: {
    ...base.settings,
    react: {
      version: "detect",
    },
  },
};
