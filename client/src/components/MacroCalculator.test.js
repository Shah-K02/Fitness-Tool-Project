import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import MacroCalculator from "./MacroCalculator";

// axios is only used to prefill from a signed-in profile; these tests run
// signed out. (CRA's Jest also can't parse axios's ES module build.)
jest.mock("axios", () => ({
  __esModule: true,
  default: { get: jest.fn(() => Promise.resolve({ data: {} })) },
}));

describe("MacroCalculator", () => {
  beforeEach(() => localStorage.clear());

  const setup = () =>
    render(
      <MemoryRouter>
        <MacroCalculator />
      </MemoryRouter>
    );

  const fillIn = ({ height, weight, age, sex, activity, goal }) => {
    fireEvent.change(screen.getByLabelText("Height"), { target: { value: height } });
    fireEvent.change(screen.getByLabelText("Weight"), { target: { value: weight } });
    fireEvent.change(screen.getByLabelText("Age"), { target: { value: age } });
    fireEvent.click(screen.getByLabelText(sex));
    fireEvent.click(screen.getByLabelText(new RegExp(`^${activity}`)));
    fireEvent.click(screen.getByLabelText(new RegExp(`^${goal}`)));
  };

  // The results row (working ledger or macro table) whose label starts with `label`.
  const row = (label) =>
    screen
      .getAllByText(label, { exact: false })
      .map((el) => el.closest("tr, .ledger-row, .ledger-total"))
      .find(Boolean);

  test("renders every input, including activity level", () => {
    setup();
    expect(screen.getByRole("heading", { name: /macro calculator/i })).toBeInTheDocument();
    ["Height", "Weight", "Age"].forEach((label) =>
      expect(screen.getByLabelText(label)).toBeInTheDocument()
    );
    ["Sedentary", "Lightly active", "Moderately active", "Very active", "Extra active"].forEach(
      (level) => expect(screen.getByLabelText(new RegExp(`^${level}`))).toBeInTheDocument()
    );
    expect(screen.getByText(/fill in your height/i)).toBeInTheDocument();
  });

  test("shows the Mifflin-St Jeor working and macros for a real example", () => {
    setup();
    // 30-year-old man, 180 cm, 80 kg, moderately active, losing weight:
    // resting 1,780 kcal; × 1.55 = 2,759 → 2,760; − 600 → 2,160 kcal.
    fillIn({ height: "180", weight: "80", age: "30", sex: "Male", activity: "Moderately active", goal: "Lose weight" });

    expect(within(row("Resting energy")).getByText("1,780 kcal")).toBeInTheDocument();
    expect(within(row("Maintenance")).getByText("2,760 kcal")).toBeInTheDocument();
    expect(within(row("Daily target")).getByText("2,160 kcal")).toBeInTheDocument();
    // Protein 1.8 g/kg × 80 kg = 144 g
    expect(within(row("Protein")).getByText(/144 g/)).toBeInTheDocument();
  });

  test("changing activity level changes the result", () => {
    setup();
    fillIn({ height: "180", weight: "80", age: "30", sex: "Male", activity: "Sedentary", goal: "Maintain weight" });
    // 1,780 × 1.2 = 2,136 → 2,140 kcal
    expect(within(row("Daily target")).getByText("2,140 kcal")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/^Very active/));
    // 1,780 × 1.725 = 3,070.5 → 3,070 kcal
    expect(within(row("Daily target")).getByText("3,070 kcal")).toBeInTheDocument();
  });

  test("never suggests fewer calories than the safe minimum", () => {
    setup();
    // 25-year-old woman, 165 cm, 60 kg, sedentary, losing weight:
    // 1,345 × 1.2 − 600 = 1,014 kcal, raised to 1,200.
    fillIn({ height: "165", weight: "60", age: "25", sex: "Female", activity: "Sedentary", goal: "Lose weight" });
    expect(within(row("Daily target")).getByText("1,200 kcal")).toBeInTheDocument();
    expect(screen.getByText(/raised to 1,200 kcal/i)).toBeInTheDocument();
  });

  test("flags out-of-range values instead of calculating", () => {
    setup();
    fillIn({ height: "1800", weight: "80", age: "30", sex: "Male", activity: "Sedentary", goal: "Maintain weight" });
    expect(screen.getByText("Enter 100–250 cm.")).toBeInTheDocument();
    expect(screen.queryByText("Daily target")).not.toBeInTheDocument();
  });
});
