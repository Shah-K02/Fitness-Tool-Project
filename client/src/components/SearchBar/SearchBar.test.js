import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import SearchBar from "./SearchBar";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe("SearchBar Component", () => {
  const setup = () =>
    render(
      <Router>
        <SearchBar />
      </Router>
    );

  test("updates input values on change", () => {
    setup();
    const input = screen.getByPlaceholderText("Search for food...");
    fireEvent.change(input, { target: { value: "apple" } });
    expect(input.value).toBe("apple");
  });

  test("displays results on successful search", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        foods: [
          {
            fdcId: 1234,
            description: "Apple",
            foodNutrients: [
              { nutrientName: "Energy", unitName: "KCAL", value: 95 },
            ],
          },
        ],
      })
    );
    setup();
    const input = screen.getByPlaceholderText("Search for food...");
    fireEvent.change(input, { target: { value: "apple" } });
    fireEvent.click(screen.getByText("Go"));
    await waitFor(() => {
      expect(
        screen.getByText(/Apple - Calories: 95 kcal/i)
      ).toBeInTheDocument();
    });
  });

  test("handles errors during search", async () => {
    fetch.mockReject(new Error("Search failed"));
    setup();
    const input = screen.getByPlaceholderText("Search for food...");
    fireEvent.change(input, { target: { value: "apple" } });
    fireEvent.click(screen.getByText("Go"));
    await waitFor(() => {
      expect(
        screen.queryByText(/Apple - Calories: 95 kcal/i)
      ).not.toBeInTheDocument();
    });
  });
});
