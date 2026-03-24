import nextConfig from "eslint-config-next";
import prettier from "eslint-config-prettier";

const eslintConfig = [
  ...nextConfig,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

export default eslintConfig;
