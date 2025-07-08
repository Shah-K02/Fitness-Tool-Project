const { plugins } = require("chart.js");

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-flow", // Important for Jest to understand JSX
      {
        targets: {
          node: "current", // Important for Jest to understand the environment
        },
        plugins: [
          "@babel/plugin-proposal-class-properties",
          "babel-plugin-styled-components",
          "@babel/plugin-transform-runtime",
        ],
      },
    ],
  ],
};
