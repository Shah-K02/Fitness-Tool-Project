import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import SearchExercises from "./SearchExercises";

const options = {
  bodyParts: ["back", "chest"],
  equipment: ["barbell", "dumbbell"],
  difficulties: ["beginner", "intermediate", "advanced"],
};

describe("SearchExercises", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => mockOnSearch.mockClear());

  test("renders search input and button", () => {
    render(<SearchExercises onSearch={mockOnSearch} options={options} />);
    // Check if input box is rendered
    expect(screen.getByPlaceholderText("Search Exercises")).toBeInTheDocument();
    // Check if button is rendered
    expect(screen.getByRole("button", { name: /^search$/i })).toBeInTheDocument();
  });

  test("allows entering a search term", () => {
    render(<SearchExercises onSearch={mockOnSearch} options={options} />);
    // Find the input element and simulate typing
    const input = screen.getByPlaceholderText("Search Exercises");
    fireEvent.change(input, { target: { value: "yoga" } });

    // Assert the input display the correct value
    expect(input.value).toBe("yoga");
  });

  test("calls onSearch when search button is clicked", () => {
    render(<SearchExercises onSearch={mockOnSearch} options={options} />);
    // Type into the text field
    const input = screen.getByPlaceholderText("Search Exercises");
    fireEvent.change(input, { target: { value: "cardio" } });

    // Click the search button
    fireEvent.click(screen.getByRole("button", { name: /^search$/i }));

    // Assert `onSearch` was called with the right arguments
    expect(mockOnSearch).toHaveBeenCalledWith({
      by: "name",
      q: "cardio",
      difficulty: "",
    });
  });

  test("calls onSearch when Enter is pressed in the search field", () => {
    render(<SearchExercises onSearch={mockOnSearch} options={options} />);
    const input = screen.getByPlaceholderText("Search Exercises");
    fireEvent.change(input, { target: { value: "squat" } });

    // Pressing Enter in a text field submits its form
    fireEvent.submit(screen.getByRole("search"));

    expect(mockOnSearch).toHaveBeenCalledWith({
      by: "name",
      q: "squat",
      difficulty: "",
    });
  });

  test("does not search with an empty term", () => {
    render(<SearchExercises onSearch={mockOnSearch} options={options} />);
    fireEvent.submit(screen.getByRole("search"));
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test("searches by body part when one is chosen", () => {
    render(<SearchExercises onSearch={mockOnSearch} options={options} />);
    fireEvent.click(screen.getByRole("button", { name: "Body part" }));

    fireEvent.mouseDown(screen.getByRole("combobox", { name: /choose body part/i }));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("chest"));

    expect(mockOnSearch).toHaveBeenCalledWith({
      by: "bodyPart",
      q: "chest",
      difficulty: "",
    });
  });

  test("searches by difficulty on its own", () => {
    render(<SearchExercises onSearch={mockOnSearch} options={options} />);
    fireEvent.click(screen.getByRole("button", { name: "Difficulty" }));

    fireEvent.mouseDown(screen.getByRole("combobox", { name: /choose difficulty/i }));
    fireEvent.click(within(screen.getByRole("listbox")).getByText("beginner"));

    expect(mockOnSearch).toHaveBeenCalledWith({
      by: "difficulty",
      q: "beginner",
      difficulty: "",
    });
  });
});
