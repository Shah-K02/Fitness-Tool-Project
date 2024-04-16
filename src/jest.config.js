module.exports = {
  setupFilesAfterEnv: [
    "@testing-library/jest-dom/extend-expect",
    "jest-fetch-mock/setupJest",
  ],
  testEnvironment: "jsdom", // Use jsdom for the test environment
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Transform JS and JSX files
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock style imports
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock image files
  },
};
