/* eslint-disable testing-library/no-debugging-utils */ // remove once tests are complete

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MacroCalculator from "./MacroCalculator";
import { MemoryRouter } from "react-router-dom";

describe("MacroCalculator Component", () => {
  const setup = () =>
    render(
      <MemoryRouter>
        <MacroCalculator />
      </MemoryRouter>
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
    const maleOption = screen.getByLabelText(/Gender/i);
    const loseOption = screen.getByLabelText(/Lose weight/i);

    fireEvent.change(heightInput, { target: { value: "180" } });
    fireEvent.change(weightInput, { target: { value: "75" } });
    fireEvent.change(ageInput, { target: { value: "30" } });
    fireEvent.click(maleOption);
    fireEvent.click(loseOption);
    fireEvent.click(screen.getByText(/Calculate/i));

    screen.debug(); // Debug here after interactions

    expect(heightInput.value).toBe("180");
    expect(weightInput.value).toBe("75");
    expect(ageInput.value).toBe("30");
    expect(maleOption.checked).toBeTruthy();
    expect(loseOption.checked).toBeTruthy();
  });

  test("displays results after form submission", async () => {
    setup();
    const button = screen.getByText(/Calculate/i);

    fireEvent.click(button);
    await screen.findByText(/BMI:/i); // Wait for element to appear

    screen.debug(); // Debug here after clicking the button and expecting results

    expect(await screen.findByText(/Protein:/i)).toBeInTheDocument();
    expect(await screen.findByText(/Carbs:/i)).toBeInTheDocument();
    expect(await screen.findByText(/Fats:/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Estimated Daily Calories Needed:/i)
    ).toBeInTheDocument();
  });

  test("initializes the chart with provided data", () => {
    setup();
    const chart = screen.getByTestId("macroChart");
    expect(chart).toBeInTheDocument();
    expect(chart.nodeName).toBe("CANVAS");

    screen.debug(); // Debug to check the chart element
  });
});
