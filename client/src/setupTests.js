// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "jest-canvas-mock";
// import "@testing-library/jest-dom/extend-expect";
require("dotenv").config();
// or if you need specific mock implementations for the context methods:
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  // provide minimal mock implementation or use a library like jest-canvas-mock
}));
