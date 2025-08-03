import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import tsConfig from "./typescript.js";

const config = tseslint.config(
  ...tsConfig,
  {
    name: "react-settings",
    files: ["**/*.ts", "**/*.tsx"],
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: "detect" } },
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
  },
  {
    name: "react-rules",
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      "react/require-default-props": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-no-bind": "off",
      "react/prop-types": "off",
      "react/no-unknown-property": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      "react/jsx-filename-extension": [
        "error",
        {
          extensions: [".jsx", ".tsx"],
        },
      ],
    },
  }
);

export default config;
