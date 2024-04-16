import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchExercises from "./SearchExercises";

describe("SearchExercises", () => {
  const mockOnSearch = jest.fn();

  test("renders search input and button", () => {
    render(<SearchExercises onSearch={mockOnSearch} />);
    // Check if input box is rendered
    expect(screen.getByPlaceholderText("Search Exercises")).toBeInTheDocument();
    // Check if button is rendered
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("allows entering a search term", () => {
    render(<SearchExercises onSearch={mockOnSearch} />);
    // Find the input element and simulate typing
    const input = screen.getByPlaceholderText("Search Exercises");
    fireEvent.change(input, { target: { value: "yoga" } });

    // Assert the input display the correct value
    expect(input.value).toBe("yoga");
  });

  test("calls onSearch when search button is clicked", () => {
    render(<SearchExercises onSearch={mockOnSearch} />);
    // Type into the text field
    const input = screen.getByPlaceholderText("Search Exercises");
    fireEvent.change(input, { target: { value: "cardio" } });

    // Click the search button
    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    // Assert `onSearch` was called with the right arguments
    expect(mockOnSearch).toHaveBeenCalledWith("cardio");
  });
});
