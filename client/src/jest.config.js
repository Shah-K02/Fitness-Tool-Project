require("dotenv").config();

module.exports = {
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "jest-fetch-mock/setupJest",
    "<rootDir>/src/setupTests.js",
  ],
  testEnvironment: "jsdom", // Use jsdom for the test environment
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest", // Transform .js, .jsx, .ts, and .tsx files using babel-jest
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock style imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock image files
  },
  transformIgnorePatterns: ["node_modules/(?!(axios)/)"], // Ignore node_modules except for axios
};
