/* eslint-disable testing-library/no-debugging-utils */ // remove once tests are complete

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MacroCalculator from "./MacroCalculator";
import { MemoryRouter } from "react-router-dom";

describe("MacroCalculator Component", () => {
  // Describe the MacroCalculator component tests
  const setup = () =>
    // Setup the component for testing purposes (render the component)
    render(
      <MemoryRouter>
        {" "}
        {/* Wrap the component in a MemoryRouter to avoid errors */}
        <MacroCalculator /> {/* Render the MacroCalculator component */}
      </MemoryRouter> // Close the MemoryRouter
    );

  test("renders the macro calculator form", () => {
    setup();
    screen.debug(); // Debug here to check initial render state
    expect(screen.getByText(/Macro Calculator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height \(cm\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight \(kg\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender:/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate/i)).toBeInTheDocument();
  });

  test("updates input values and submits form", () => {
    setup();
    const heightInput = screen.getByLabelText(/Height \(cm\):/i);
    const weightInput = screen.getByLabelText(/Weight \(kg\):/i);
    const ageInput = screen.getByLabelText(/Age:/i);
    const genderSelect = screen.getByLabelText(/Gender:/i);
    const loseWeightOption = screen.getByLabelText(/Lose weight/i);

    fireEvent.change(heightInput, { target: { value: "180" } }); // Change the height input value
    fireEvent.change(weightInput, { target: { value: "75" } }); // Change the weight input value
    fireEvent.change(ageInput, { target: { value: "30" } }); // Change the age input value
    fireEvent.change(genderSelect, { target: { value: "male" } }); // Change the gender input value
    fireEvent.click(loseWeightOption); // Click the lose weight option
    fireEvent.click(screen.getByText(/Calculate/i)); // Click the calculate button

    expect(heightInput.value).toBe("180"); // Check if the height input value is updated
    expect(weightInput.value).toBe("75");
    expect(ageInput.value).toBe("30");
    expect(genderSelect.value).toBe("male"); // Check if the gender input value is updated
    expect(loseWeightOption.checked).toBeTruthy(); // Check if the lose weight option is checked
  });

  test("displays results after form submission", async () => {
    setup(); // Setup the component for testing purposes (render the component)
    const button = screen.getByText(/Calculate/i); // Get the button element to submit the form
    fireEvent.click(button); // Click the button to submit the form

    await waitFor(() => {
      // Wait for the results to be displayed on the screen before making assertions
      expect(screen.getByText(/BMI:/i)).toBeInTheDocument(); // Check if the BMI is displayed
    });

    expect(screen.getByText(/Protein:/i)).toBeInTheDocument(); // Check if the Protein is displayed
    expect(screen.getByText(/Carbs:/i)).toBeInTheDocument(); // Check if the Carbs are displayed
    expect(screen.getByText(/Fats:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Estimated Daily Calories Needed:/i)
    ).toBeInTheDocument(); // Check if the Estimated Daily Calories Needed is displayed
  });

  test("initializes the chart with provided data", () => {
    setup();
    const chart = screen.getByTestId("macroChart"); // Get the chart element by its test id
    expect(chart).toBeInTheDocument(); // Check if the chart element is rendered
    expect(chart.nodeName).toBe("CANVAS"); // Check if the chart element is a canvas element

    screen.debug(); // Debug to check the chart element
  });
});
